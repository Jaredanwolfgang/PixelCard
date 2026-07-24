import { listPosts } from "@/lib/content";
import { mergePostsWithStats } from "@/lib/engagement";
import { getSiteConfig } from "@/lib/config";
import ArchiveClient from "@/components/ArchiveClient";

export const dynamic = "force-dynamic";

export function generateMetadata() {
  const { site } = getSiteConfig();
  return { title: `全部博客 · ${site.name}` };
}

export default async function ArchivePage() {
  const { site } = getSiteConfig();
  const posts = await mergePostsWithStats(listPosts());
  return (
    <>
      <span className="wordmark">{site.name}</span>
      <ArchiveClient posts={posts} />
    </>
  );
}
