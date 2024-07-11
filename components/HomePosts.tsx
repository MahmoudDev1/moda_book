import Posts from "./posts/Posts";
import { getPosts } from "@/lib/posts";

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

export default async function HomePosts() {
  let posts = (await getPosts()).posts as PostInterface[];
  
  if(posts.length == 0) {
    return <h2 className="font-semibold text-lg">There is no posts to show, try adding friends if you don&apos;t have.</h2>
  }

  return <Posts posts={posts} />;
}
