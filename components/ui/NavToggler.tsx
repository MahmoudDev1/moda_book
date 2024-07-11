'use client'

import Image from "next/image";
import burgerIcon from "@/public/assets/burger.svg";

export default function NavToggler() {

  function click() {
    document.getElementById("navbar-items")?.classList.toggle("hidden")
  }

  return (
    <button
      data-collapse-toggle="navbar-search"
      type="button"
      onClick={click}
      className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
    >
      <span className="sr-only">Open main menu</span>
      <Image src={burgerIcon} alt="Burger Icon" width={20} height={16} />
    </button>
  );
}
