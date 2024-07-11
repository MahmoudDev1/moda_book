import { getUserFriends } from "@/lib/user";
import UserFriendsBoxes from "./UserFriendsBoxes";
import { QueryResultRow } from "@vercel/postgres";
import { GoPeople } from "react-icons/go";

interface Friend extends QueryResultRow {
  id: number;
  name: string;
  image: string | null;
}

export default async function UserFriendsContainer() {
  const { friends } = await getUserFriends();

  return <UserFriendsBoxes friends={friends as Friend[]} />;
}
