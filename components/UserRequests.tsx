"use client";
import Image from "next/image";
import DefaultUser from "@/public/assets/default-user-big.png";
import { QueryResultRow } from "@vercel/postgres";
import { acceptFriendRequest, deleteFriendRequests } from "@/actions/user";
import { useFormStatus } from "react-dom";
import { startTransition, useEffect, useOptimistic } from "react";
import PusherClient from "pusher-js";
import { useRouter } from "next/navigation";

function AcceptRequestButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="mt-5 w-full rounded-md p-2 bg-sky-500 text-white font-semibold text-sm disabled:opacity-70"
      disabled={pending}
    >
      Accept Request
    </button>
  );
}

export default function UserFriendRequests({
  users,
  userId,
}: {
  users: QueryResultRow[] | undefined;
  userId: string | null;
}) {
  const [optimisticUsers, triggerOptimistic] = useOptimistic(users, (currentState, userIdToRemove) => {
    return currentState?.filter((user) => user.from_id !== userIdToRemove) ?? [];
  });
  const handleDelete = async (userId: number) => {
    startTransition(() => {
      triggerOptimistic(userId);
    });
    await deleteFriendRequests(userId);
  };
  const router = useRouter()

  function handleRequestChanges() {
    router.refresh()
  }

  useEffect(() => {
    const pusherClient = new PusherClient("a61348eb9dd39fc40d2b", {
      cluster: "mt1",
    });

    pusherClient.subscribe(`friend_request-${userId}`);
    pusherClient.bind("friend_request_event", handleRequestChanges);
    pusherClient.bind("remove_friend_request_event", handleRequestChanges);

    return () => {
      pusherClient.unsubscribe(`friend_request-${userId}`);
      pusherClient.unbind("friend_request_event", handleRequestChanges);
      pusherClient.unbind("remove_friend_request_event", handleRequestChanges);
    };
  }, []);

  return (
    <>
      {users &&
        users.length > 0 &&
        optimisticUsers?.map((user) => (
          <div key={user.request_id} className="box rounded-md shadow-sm bg-white overflow-hidden">
            <div className="img relative h-[130px]">
              <Image src={user.image || DefaultUser} alt="User Image" fill className="object-cover" />
            </div>
            <div className="p-3">
              <h2 className="font-semibold">{user.name}</h2>
              <form action={acceptFriendRequest.bind(null, user.from_id)}>
                <AcceptRequestButton />
              </form>
              <button
                onClick={() => handleDelete(user.from_id)}
                className="mt-2 w-full rounded-md p-2 bg-red-300 text-red-900 font-semibold text-sm"
              >
                Delete Request
              </button>
            </div>
          </div>
        ))}
    </>
  );
}
