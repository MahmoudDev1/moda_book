import Image from "next/image";
import LikePost from "./LikePost";
import SavePost from "./SavePost";
import DefaultUser from "@/public/assets/default-user.jpg";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
  id: number;
  index: number;
  text: string;
  image: string | null;
  likes_count: number;
  isLiked: boolean;
  updateOptimisticPosts: Function;
  postSaved: boolean;
  user: { id: number; name: string; image: string };
  created_at: Date;
}

export default function Post(props: Props) {
  const [postDate, setPostDate] = useState('')
  useEffect(() => {
    setPostDate(new Date(props.created_at).toLocaleDateString())
  }, [])

  return (
    <div className="post bg-white p-4 rounded-md shadow-sm mb-4">
      <div className="user flex gap-2 mb-3">
        <Image src={props.user.image || DefaultUser} alt="User Profile Image" width={40} height={40} />
        <div>
          <Link className="font-semibold hover:underline" href={`/user/${props.user.id}`}>{props.user.name}</Link>
          <div className="text-gray-500 -mt-1">{postDate}</div>
        </div>
      </div>
      {props.image && (
        <div className="img relative h-64 md:h-80">
          <Image
            src={props.image}
            alt={props.text}
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={props.index == 0 || props.index == 1}
          />
        </div>
      )}
      <h4 className={`font-semibold py-2 border-b whitespace-pre-line ${props.image ? "text-md" : "text-xl"}`}>
        {props.text}
      </h4>
      <div className="like mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          <LikePost id={props.id} isLiked={props.isLiked} updateOptimisticPosts={props.updateOptimisticPosts} />
          <span>{props.likes_count} Likes</span>
        </div>
        <SavePost id={props.id} postSaved={props.postSaved} />
      </div>
    </div>
  );
}
