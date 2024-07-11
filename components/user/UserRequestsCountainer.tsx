import { getUserFriendRequests, getUserId } from "@/lib/user";
import UserFriendRequestsBoxes from "./UserRequestsBoxes";

export default async function UserRequestsContainer() {
  const userId = await getUserId();
  const { friendRequests } = await getUserFriendRequests();

  return <UserFriendRequestsBoxes users={friendRequests} userId={userId} />;
}
