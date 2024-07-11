import UserFriendsContainer from "@/components/user/UserFriendsContainer";
import UserRequestsContainer from "@/components/user/UserRequestsCountainer";
import { Suspense } from "react";

export default async function UserFriends() {
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
        <UserFriendsContainer />
        <div className="line h-[1px] w-full bg-gray-400 my-5"></div>
        <UserRequestsContainer />
      </Suspense>
    </>
  );
}
