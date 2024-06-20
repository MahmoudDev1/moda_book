"use client";
import { toggleLike } from "@/actions/posts";
import Post from "./Post";
import { useOptimistic } from "react";
import { startTransition } from "react";

interface PostInterface {
  id: number;
  text: string;
  image: string | null;
  likes_count: number;
  isLiked: boolean;
  postSaved: boolean
}

interface Props {
  posts: PostInterface[];
}

export default function Posts(props: Props) {
  const [optimisticPosts, updateOptimisticPosts] = useOptimistic(
    props.posts,
    (prevPosts: PostInterface[], updatedPostId: number) => {
      return prevPosts.map((post) =>
        post.id === updatedPostId
          ? { ...post, isLiked: !post.isLiked, likes_count: +post.likes_count + (post.isLiked ? -1 : 1) }
          : post
      );
    }
  );

  async function updatePost(postId: number) {
    startTransition(() => {
      updateOptimisticPosts(postId);
    });
    await toggleLike(postId);
  }

  return (
    <>
      {optimisticPosts.map((post: PostInterface, index) => (
        <Post
          key={post.id}
          index={index}
          id={post.id}
          image={post.image}
          text={post.text}
          likes_count={post.likes_count}
          isLiked={post.isLiked}
          updateOptimisticPosts={updatePost}
          postSaved={post.postSaved}
        />
      ))}
    </>
  );
}
