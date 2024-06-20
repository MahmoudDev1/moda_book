import Link from "next/link";
import NavLinks from "./NavLinks";
import { verifyAuth } from "@/lib/auth";
import burgerIcon from "@/public/assets/burger.svg";
import Image from "next/image";
import SearchForm from "./SearchForm";

export default async function Navbar() {
  const { user } = await verifyAuth();

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
        <div className="navbar-brand md:flex-1">
          <Link href="/">
            <span className="text-2xl font-semibold whitespace-nowrap text-sky-500">Modabook</span>
          </Link>
        </div>
        <div className="flex md:order-2 md:flex-1 justify-end">
          <div className="relative hidden md:block">
            <SearchForm />
          </div>
          <button
            data-collapse-toggle="navbar-search"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-search"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <Image src={burgerIcon} alt="Burger Icon" width={20} height={16} />
          </button>
        </div>
        <div className="items-center justify-center hidden w-full md:flex md:w-auto md:order-1 md:flex-1" id="navbar-search">
          <div className="relative mt-3 md:hidden">
            <SearchForm />
          </div>
          <ul className="nav-links flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:gap-14 lg:gap-20 md:flex-row md:mt-0 md:border-0 md:bg-white">
            <NavLinks isAuth={!!user} />
          </ul>
        </div>
      </div>
    </nav>
  );
}
