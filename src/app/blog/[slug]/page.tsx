import { notFound } from "next/navigation";
import {
  getPostBySlug,
  extractToc,
  adjacentPosts,
} from "@/lib/content";
import {
  incrementView,
  listComments,
  mergePostsWithStats,
} from "@/lib/engagement";
import PostReader from "@/components/PostReader";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const raw = getPostBySlug(params.slug);
  if (!raw) notFound();

  const views = await incrementView(raw.slug);
  const [post] = await mergePostsWithStats([raw]);
  post.views = views || post.views;

  const toc = extractToc(post.content);
  const comments = await listComments(post.slug);
  const { prev, next } = adjacentPosts(post.publishedAt);

  return (
    <PostReader
      post={post}
      toc={toc}
      prev={prev}
      next={next}
      comments={comments}
    />
  );
}
