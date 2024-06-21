import { getUserById } from "@/lib/user";
import Image from "next/image";
import { notFound } from "next/navigation";
import DefaultUser from "@/public/assets/default-user.jpg";
import { QueryResultRow } from "@vercel/postgres";
import { getUserPosts } from "@/lib/posts";

interface User {
  id: number;
  name: string;
  image: string;
  email: string;
}

interface Post {
  id: number;
  text: string;
  image: string | null;
  likes_count: number;
}

export default async function User(props: { params: { id: number } }) {
  const result = await getUserById(props.params.id);
  if (!result.success || !result.user) {
    return notFound();
  }
  const user: QueryResultRow = result.user;
  const posts: QueryResultRow = await getUserPosts(user.id);

  return (
    <div className="box bg-white shadow-sm p-3 rounded-md">
      <div className="flex gap-2">
        <Image src={user.image || DefaultUser} alt="User Profile Image" width={70} height={70} />
        <div>
          <div className="mt-2 font-semibold text-lg">{user.name}</div>
          <div className="text-gray-500">{posts.length == 1 ? "1 Post" : posts.length + " Posts"}</div>
        </div>
      </div>
      {posts.length > 0 && (
        <div className="posts mt-8 grid grid-cols-2 gap-2">
          {posts.map((post: Post) => {
            return post.image ? (
              <div key={post.id} className="post border p-2 rounded-sm">
                <div className="img relative h-64">
                  <Image
                    src={post.image}
                    alt={post.text}
                    fill
                    className="rounded-md object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="flex justify-between mt-3">
                  <h2 className="font-medium text-lg">{post.text}</h2>
                  <span>Likes: {post.likes_count}</span>
                </div>
              </div>
            ) : (
              <div key={post.id} className="post border p-3 rounded-sm h-fit">
                <h2 className="font-medium text-lg">{post.text}</h2>
                <span>Likes: {post.likes_count}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
