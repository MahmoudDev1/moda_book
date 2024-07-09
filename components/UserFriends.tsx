"use client";
import Image from "next/image";
import DefaultUser from "@/public/assets/default-user-big.png";
import { QueryResultRow } from "@vercel/postgres";
import { useOptimistic } from "react";
import { deleteFriend } from "@/actions/user";
import { startTransition } from "react";

interface Friend extends QueryResultRow {
  id: number;
  name: string;
  image: string | null;
}

interface Props {
  friends: Friend[] | undefined;
}

export default function UserFriendsBoxes({ friends }: Props) {
  const [optimisticFriends, addOptimistic] = useOptimistic(
    friends,
    (currentState, friendIdToRemove) => {
      return currentState?.filter(friend => friend.id !== friendIdToRemove) ?? [];
    }
  );

  const handleDelete = async (friendId: number) => {
    startTransition(() => {
      addOptimistic(friendId);
    });
    await deleteFriend(friendId);
  };

  return (
    <>
      {optimisticFriends?.map((friend) => (
        <div key={friend.id} className="box rounded-md shadow-sm bg-white overflow-hidden h-fit">
          <div className="img relative h-[130px]">
            <Image src={friend.image || DefaultUser} alt="User Image" fill className="object-cover" />
          </div>
          <div className="p-3">
            <h2 className="font-semibold">{friend.name}</h2>
            <button className="mt-5 w-full rounded-md p-2 bg-sky-200 text-sky-700 font-semibold text-sm">
              Chat Together
            </button>
            <button
              onClick={() => handleDelete(friend.id)}
              className="mt-2 w-full rounded-md p-2 bg-red-300 text-red-900 font-semibold text-sm"
            >
              Remove Friend
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
