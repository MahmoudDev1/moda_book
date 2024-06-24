import Posts from "@/components/Posts";
import { getSavedPostsData } from "@/lib/posts";
import { Suspense } from "react";

interface PostInterface {
  id: number;
  text: string;
  image: string | null;
  likes_count: number;
  isLiked: boolean;
  postSaved: boolean;
  user: { id: number; name: string; image: string };
  created_at: Date
}

async function SavedPosts() {
  let posts = (await getSavedPostsData()).posts as PostInterface[];
  return posts && posts.length > 0 ? (
    <Posts posts={posts} />
  ) : (
    <h2 className="p-3 bg-white shadow-sm rounded-md font-semibold">No saved posts found.</h2>
  );
}

export default async function SavedPostsPage() {
  return <Suspense fallback={<h1 className="text-xl font-semibold">Loading Data...</h1>}><SavedPosts /></Suspense>
}
