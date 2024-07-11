"use client";

import Image from "next/image";

export default function LikePost(props: { id: number; isLiked: boolean; updateOptimisticPosts: Function }) {
  function likePost(e: any) {
    e.preventDefault();
    props.updateOptimisticPosts(props.id)
  }

  return (
    <form onSubmit={likePost}>
      {props.isLiked ? (
        <button>
          <Image src="assets/like-alt.svg" alt="Like Post" width={25} height={25} />
        </button>
      ) : (
        <button>
          <Image src="assets/like.svg" alt="Like Post" width={25} height={25} />
        </button>
      )}
    </form>
  );
}
