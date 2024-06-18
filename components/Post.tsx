import Image from "next/image";
import LikePost from "./LikePost";
import { toggleSave } from "@/actions/posts";
import SavePost from "./SavePost";

interface Props {
  id: number;
  text: string;
  image: string | null;
  likes_count: number;
  isLiked: boolean;
  updateOptimisticPosts: Function;
  postSaved: boolean;
}

export default function Post(props: Props) {
  return (
    <div className="post bg-white p-4 rounded-md shadow-sm mb-4">
      {props.image && (
        <div className="img relative h-80">
          <Image src={props.image} alt={props.text} fill className="rounded-md" priority />
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
