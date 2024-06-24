import Posts from "./Posts";
import { getPosts } from "@/lib/posts";

interface PostInterface {
  id: number;
  text: string;
  image: string | null;
  likes_count: number;
  isLiked: boolean;
  postSaved: boolean;
  user: { id: number; name: string };
  created_at: Date
}

export default async function HomePosts() {
  let posts = (await getPosts()).posts as PostInterface[];
  
  return <Posts posts={posts} />;
}
