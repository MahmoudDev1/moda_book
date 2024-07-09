"use client";

import { logout } from "@/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaHouse, FaPowerOff } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { BiSolidBookmarks } from "react-icons/bi";

export default function NavLinks(props: { isAuth: boolean; friendRequestsCount: number }) {
  const pathname = usePathname();

  function logoutHandler(event: any) {
    event.preventDefault();

    logout();
  }

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
              {props.friendRequestsCount > 0 && (
                <div className="count absolute z-10 bg-red-600 rounded-full w-[18px] h-[18px] flex justify-center items-center text-white text-[12px] right-[-5px] top-[-10px]">
                  {props.friendRequestsCount}
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
