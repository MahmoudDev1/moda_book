"use server";

import { pusherServer } from "@/lib/pusher";
import {
  deleteFriendDb,
  deleteFriendRequest,
  deleteFriendRequestsDb,
  getUserId,
  insertFriendRequest,
  updateRequestStatus,
} from "@/lib/user";
import { revalidatePath } from "next/cache";

export async function sendFriendRequest(to: number) {
  const from = await getUserId();
  const result = await insertFriendRequest(from, to);
  
  pusherServer.trigger(`friend_request-${to}`, "friend_request_event", {
    user: {
      from_id: result.id,
      name: result.name,
      image: result.image,
    }
  });
  
  revalidatePath(`/user/${to}`);
}

export async function removeFriendRequest(to: number) {
  const from = await getUserId();
  const result = await deleteFriendRequest(from, to);
  pusherServer.trigger(`friend_request-${to}`, "remove_friend_request_event", {});
  revalidatePath(`/user/${to}`);
}

export async function acceptFriendRequest(id: number) {
  const to = await getUserId();

  const result = await updateRequestStatus(id, to);
  revalidatePath(`/friends`);
}

export async function deleteFriend(id: number) {
  const to = await getUserId();

  const result = await deleteFriendDb(id);
  revalidatePath(`/friends`);
}

export async function deleteFriendRequests(id: number) {
  const to = await getUserId();

  const result = await deleteFriendRequestsDb(id);
  revalidatePath(`/friends`);
}
