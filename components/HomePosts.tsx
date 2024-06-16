import Posts from "./Posts";
import { getPosts } from "@/lib/posts";

export default async function HomePosts() {
  let posts = (await getPosts()).posts;
  
  return <Posts posts={posts} />;
}
