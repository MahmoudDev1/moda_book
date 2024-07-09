import UserFriendsBoxes from "@/components/UserFriends";
import UserFriendRequests from "@/components/UserRequests";
import { getUserFriends } from "@/lib/user";
import { QueryResultRow } from "@vercel/postgres";
import { Suspense } from "react";

interface Friend extends QueryResultRow {
  id: number;
  name: string;
  image: string | null;
}

export default async function UserFriends() {
  const { friends, friendRequests } = await getUserFriends();

  if (friends?.length == 0 && friendRequests?.length == 0) {
    return (
      <h2 className="font-semibold text-xl text-gray-500">
        You don&apos;t have friends, friends added and friend requests will appear here.
      </h2>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      <Suspense
        fallback={
          <>
            <div className="animate-pulse h-[280px] w-[170px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-[280px] w-[170px] bg-gray-300 rounded-md"></div>
            <div className="animate-pulse h-[280px] w-[170px] bg-gray-300 rounded-md"></div>
          </>
        }
      >
        {friends && friends.length > 0 && <UserFriendsBoxes friends={friends as Friend[]} />}
        {friendRequests && friendRequests.length > 0 && <UserFriendRequests users={friendRequests} />}
      </Suspense>
    </div>
  );
}
