#!/usr/bin/env bash
# Run on Aliyun-RMMT, detached by the caller. Never restart the shared stack.
set -Eeuo pipefail
umask 077

repo=/root/v1/PixelCard
compose=/root/v1/docker-compose.yml
builder=pixelcard-limited
state=/root/pixelcard-deploy
mkdir -p "$state"
exec 9>"$state/deploy.lock"
flock -n 9 || { echo 'Another PixelCard deployment is running.'; exit 1; }
cd "$repo"
compose_cmd=(docker compose --project-directory /root/v1 -f "$compose")
switched=0
old_image=

finish() {
  result=$?
  trap - EXIT TERM INT
  if (( result != 0 )); then
    echo "Deployment failed (exit $result)."
    if (( switched )); then
      echo "Restoring previous image: $old_image"
      docker tag "$old_image" rmmt-pixelcard-web:latest
      "${compose_cmd[@]}" up -d --no-deps --no-build pixelcard-web
    fi
    printf 'failed %s\n' "$result" > "$state/status"
  else
    printf 'success %s\n' "$revision" > "$state/status"
  fi
  # This builder belongs only to PixelCard; keep its bounded cache for next time.
  docker buildx stop "$builder" || true
  exit "$result"
}
trap finish EXIT
trap 'exit 143' TERM
trap 'exit 130' INT

echo "Starting deployment at $(date -Is)"
printf 'running\n' > "$state/status"
test -z "$(git status --porcelain --untracked-files=normal)"
test "$(git branch --show-current)" = main
test "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)"
revision=$(git rev-parse HEAD)
printf '%s\n' "$revision" > "$state/target-commit"
old_image=$(docker inspect pixelcard-web --format '{{.Image}}')
printf '%s\n' "$old_image" > "$state/previous-image"
docker tag "$old_image" "pixelcard-rollback:${revision:0:12}"

available_kb=$(awk '/MemAvailable:/ {print $2}' /proc/meminfo)
disk_kb=$(df -Pk /var/lib/docker | awk 'NR==2 {print $4}')
(( available_kb >= 1800 * 1024 )) || { echo 'Need 1800 MiB available RAM.'; exit 1; }
(( disk_kb >= 4 * 1024 * 1024 )) || { echo 'Need 4 GiB free disk.'; exit 1; }
curl -fsS --max-time 15 https://jaredan.site/api/e/health
echo

if ! docker buildx inspect "$builder" >/dev/null 2>&1; then
  docker buildx create --name "$builder" --driver docker-container \
    --driver-opt memory=1280m,memory-swap=1280m,cpu-period=100000,cpu-quota=100000 \
    --buildkitd-flags '--oci-worker-gc-keepstorage 1024'
fi
# Verify the existing builder really has the intended hard cgroup limits.
docker buildx inspect "$builder" --bootstrap
limits=$(docker inspect "buildx_buildkit_${builder}0" \
  --format '{{.HostConfig.Memory}} {{.HostConfig.MemorySwap}} {{.HostConfig.CpuPeriod}} {{.HostConfig.CpuQuota}}')
test "$limits" = '1342177280 1342177280 100000 100000' || {
  echo "Unexpected builder resource limits: $limits"; exit 1;
}

docker buildx build --builder "$builder" --load --provenance=false \
  --progress=plain --file Dockerfile \
  --build-arg ENGAGEMENT_URL=http://pixelcard-engagement:4000 \
  --build-arg PIXELCARD_LIMITED_BUILD=1 \
  --build-arg BUILD_NODE_OPTIONS=--max-old-space-size=768 \
  --label "org.opencontainers.image.revision=$revision" \
  --tag "rmmt-pixelcard-web:$revision" .

docker tag "rmmt-pixelcard-web:$revision" rmmt-pixelcard-web:latest
switched=1
"${compose_cmd[@]}" up -d --no-deps --no-build pixelcard-web
healthy=0
for attempt in {1..12}; do
  if curl -fsS --max-time 10 https://jaredan.site/ -o "$state/home.html" &&
     curl -fsS --max-time 10 https://jaredan.site/api/e/health | grep -q '"ok":true'; then
    healthy=1
    break
  fi
  sleep 5
done
(( healthy )) || { echo 'Post-deploy HTTP health check failed.'; exit 1; }
test "$(docker inspect pixelcard-web --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')" = "$revision"
"${compose_cmd[@]}" ps pixelcard-web pixelcard-engagement
echo "Deployment complete: $revision at $(date -Is)"
