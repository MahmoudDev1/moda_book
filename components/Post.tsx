import Image from "next/image";
import LikePost from "./LikePost";

interface Props {
  id: number;
  text: string;
  image: string | null;
  likes_count: number;
  isLiked: boolean;
  updateOptimisticPosts: Function
}

export default function Post(props: Props) {
  return (
    <div className="post bg-white p-4 rounded-md shadow-sm mb-4">
      {props.image && (
        <Image src={props.image} alt={props.text} width={800} height={300} className="w-full h-80 rounded-md" />
      )}
      <h4 className={`font-semibold py-2 border-b whitespace-pre-line ${props.image ? "text-md" : "text-xl"}`}>{props.text}</h4>
      <div className="like mt-2 flex items-center gap-2">
        <LikePost id={props.id} isLiked={props.isLiked} updateOptimisticPosts={props.updateOptimisticPosts} />
        <span>{props.likes_count} Likes</span>
      </div>
    </div>
  );
}
