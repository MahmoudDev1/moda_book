"use client";
import { removeFriendRequest, sendFriendRequest } from "@/actions/user";
import { useFormStatus } from "react-dom";
import { FaPlus } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { IoIosRemoveCircle } from "react-icons/io";

function Button({status}: {status: string}) {
  const { pending } = useFormStatus();

  if (status == "pending") {
    return (
      <button className="main-btn disabled:opacity-70" disabled={pending}>
        <IoIosRemoveCircle fontSize={17} /> Cancel Friend Request
      </button>
    );
  }

  if (!status) {
    return (
      <button className="main-btn disabled:opacity-70" disabled={pending}>
        <FaPlus fontSize={15} /> Add Friend
      </button>
    );
  }
}

export default function UserRequestButton({ friendRequestStatus, id }: { friendRequestStatus: string; id: number }) {
  
  if (friendRequestStatus == "pending") {

    return (
      <form action={removeFriendRequest.bind(null, id)}>
        <Button status={friendRequestStatus} />
      </form>
    );
  }

  if (!friendRequestStatus) {
    return <form action={sendFriendRequest.bind(null, id)}>
      <Button status={friendRequestStatus} />
    </form>;
  }

  if(friendRequestStatus == "accepted") {
    return <div className="flex gap-2 items-center py-1 px-2 bg-sky-200 text-sky-900 rounded-sm"><FaUserCheck fontSize={18} /> Friend</div>
  }
}
