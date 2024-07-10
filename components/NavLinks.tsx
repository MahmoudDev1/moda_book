"use client";

import { logout } from "@/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaHouse, FaPowerOff } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { BiSolidBookmarks } from "react-icons/bi";
import { useEffect, useState } from "react";
import PusherClient from "pusher-js";

export default function NavLinks(props: { isAuth: boolean; userId: string | undefined, friendRequestsCount: number }) {
  const [friendRequestsCountState, setFriendRequestsCountState] = useState(props.friendRequestsCount)
  const pathname = usePathname();

  function logoutHandler(event: any) {
    event.preventDefault();

    logout();
  }

  function handleAddFriendRequest() {
    setFriendRequestsCountState(prev => prev + 1)
  }

  function handleRemoveFriendRequest() {
    setFriendRequestsCountState(prev => prev - 1)
  }

  useEffect(() => {
    const pusherClient = new PusherClient("a61348eb9dd39fc40d2b", {
      cluster: "mt1",
    });
    
    pusherClient.subscribe(`friend_request-${props.userId}`);
    pusherClient.bind("friend_request_event", handleAddFriendRequest);
    pusherClient.bind("remove_friend_request_event", handleRemoveFriendRequest);
    
    return () => {
      pusherClient.unsubscribe(`friend_request-${props.userId}`);
      pusherClient.unbind("friend_request_event", handleAddFriendRequest);
      pusherClient.unbind("remove_friend_request_event", handleRemoveFriendRequest);
    };
  }, []);

  return (
    <>
      <li>
        <Link href="/" className={pathname == "/" ? "nav-link-active" : "nav-link"} aria-current="page">
          <FaHouse fontSize={21} className="inline" />
          <div className="md:hidden inline pl-2">Home</div>
        </Link>
      </li>
      {props.isAuth ? (
        <>
          <li>
            <Link
              href="/saved-posts"
              className={pathname.startsWith("/saved-posts") ? "nav-link-active" : "nav-link"}
              aria-current="page"
            >
              <BiSolidBookmarks fontSize={21} className="inline" />
              <div className="md:hidden inline pl-2">Saved Posts</div>
            </Link>
          </li>
          <li>
            <Link
              href="/friends"
              className={pathname.startsWith("/friends") ? "nav-link-active relative" : "nav-link relative"}
              aria-current="page"
            >
              <FaUserFriends fontSize={21} className="inline" />
              <div className="md:hidden inline pl-2">Friends</div>
              {friendRequestsCountState > 0 && (
                <div className="count absolute z-10 bg-red-600 rounded-full w-[18px] h-[18px] flex justify-center items-center text-white text-[12px] right-[-5px] top-[-10px]">
                  {+friendRequestsCountState}
                </div>
              )}
            </Link>
          </li>
          <li>
            <a href="#" onClick={logoutHandler} className="nav-link" aria-current="page">
              <FaPowerOff fontSize={21} className="inline" />
              <div className="md:hidden inline pl-2">Logout</div>
            </a>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link
              href="/register"
              className={pathname.startsWith("/register") ? "nav-link-active" : "nav-link"}
              aria-current="page"
            >
              <i className="fa fa-user-plus"></i>
              <div className="md:hidden inline pl-2">Register</div>
            </Link>
          </li>
        </>
      )}
    </>
  );
}
