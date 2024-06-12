"use client";

import { logout } from "@/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks(props: { isAuth: boolean }) {
  const pathname = usePathname();

  function logoutHandler(event: any) {
    event.preventDefault()

    logout()
  }

  return (
    <>
      <li>
        <Link href="/" className={pathname == "/" ? "nav-link-active" : "nav-link"} aria-current="page">
          Home
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
              Saved Posts
            </Link>
          </li>
          <li>
            <a href="#" onClick={logoutHandler} className="nav-link" aria-current="page">
              Logout
            </a>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link href="/register" className={pathname.startsWith("/register") ? "nav-link-active" : "nav-link"} aria-current="page">
              Register
            </Link>
          </li>
        </>
      )}
    </>
  );
}
