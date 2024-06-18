import Posts from "@/components/Posts";
import { getSavedPostsData } from "@/lib/posts";

interface PostInterface {
  id: number;
  text: string;
  image: string | null;
  likes_count: number;
  isLiked: boolean;
  postSaved: boolean
}

export default async function SavedPosts() {
  let posts = (await getSavedPostsData()).posts as PostInterface[];
  
  return posts && posts.length > 0 ? <Posts posts={posts} /> : <h2 className="p-3 bg-white shadow-sm rounded-md font-semibold">No saved posts found.</h2> ;
}
