import Link from "next/link";
import { listPosts } from "@/lib/content";
import { mergePostsWithStats, fetchAggregate } from "@/lib/engagement";
import { getSiteConfig } from "@/lib/config";
import HomeFeed from "@/components/HomeFeed";
import ProfileSidebar from "@/components/ProfileSidebar";
import { SearchIcon } from "@/components/SocialIcons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { site } = getSiteConfig();
  const posts = await mergePostsWithStats(listPosts());
  const aggregate = await fetchAggregate();

  return (
    <>
      <span className="wordmark">{site.name}</span>
      <div className="top-right">
        <Link href="/archive" className="icon-btn" aria-label="搜索 / 全部博客">
          <SearchIcon />
        </Link>
      </div>
      <main className="shell">
        <ProfileSidebar views={aggregate.views} likes={aggregate.likes} />
        <HomeFeed posts={posts} />
      </main>
    </>
  );
}
