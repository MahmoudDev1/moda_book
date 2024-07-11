import UserFriendsBoxes from "@/components/UserFriends";
import UserFriendRequests from "@/components/UserRequests";
import { getUserFriends, getUserId } from "@/lib/user";
import { QueryResultRow } from "@vercel/postgres";
import { Suspense } from "react";

interface Friend extends QueryResultRow {
  id: number;
  name: string;
  image: string | null;
}

export default async function UserFriends() {
  const { friends, friendRequests } = await getUserFriends();
  const userId = await getUserId();

  return (
    <>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="animate-pulse h-[280px] w-[170px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-[280px] w-[170px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-[280px] w-[170px] bg-gray-300 rounded-md"></div>
          </div>
        }
        >
        {friends?.length == 0 && friendRequests?.length == 0 && (
          <h2 className="font-semibold text-xl text-gray-500">
            You don&apos;t have friends, friends added and friend requests will appear here.
          </h2>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <UserFriendsBoxes friends={friends as Friend[]} />
          <UserFriendRequests users={friendRequests} userId={userId} />
        </div>
      </Suspense>
    </>
  );
}
