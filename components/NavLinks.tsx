"use client";

import { logout } from "@/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function NavLinks(props: { isAuth: boolean }) {
  const pathname = usePathname();

  function logoutHandler(event: any) {
    event.preventDefault();

    logout();
  }

  return (
    <>
      <li>
        <Link href="/" className={pathname == "/" ? "nav-link-active" : "nav-link"} aria-current="page">
          <i className="fa fa-home"></i>
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
              <i className="fa fa-bookmark"></i>
              <div className="md:hidden inline pl-2">Saved Posts</div>
            </Link>
          </li>
          <li>
            <a href="#" onClick={logoutHandler} className="nav-link" aria-current="page">
              <i className="fa fa-right-from-bracket"></i>
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
