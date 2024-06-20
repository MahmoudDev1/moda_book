"use client";
import Image from "next/image";
import DefaultUser from "@/public/assets/default-user.jpg";
import Link from "next/link";
import searchIcon from "@/public/assets/search-icon.svg";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { throttle } from "lodash";
interface User {
  id: number;
  name: string;
  image: string;
  email: string;
}

export default function SearchForm() {
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const input = useRef<HTMLInputElement>(null)

  const throttledSearch = useCallback(
    throttle((value: string) => {
      if (value === "") {
        setResults([]);
      } else {
        fetch(`/api/search/${value}`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data.users);
          })
          .catch((error) => {
            console.error("Error fetching search results:", error);
          });
      }
    }, 500),
    []
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchValue(value);
    throttledSearch(value);
  }

  useEffect(() => {
    window.addEventListener("click", (e) => {
      e.stopPropagation()
      
      if(e.target === input.current) {
        return;
      } else {
        setResults([])
      }
    })
  }, [])

  return (
    <>
      <div className="absolute inset-y-0 start-0 flex items-center pl-3 pointer-events-none">
        <Image src={searchIcon} alt="Search Icon" width={16} height={16} />
      </div>
      <input
        type="text"
        className="block w-full md:w-64 lg:w-80 p-2 ps-10 text-sm text-gray-900 border-2 border-gray-300 rounded-lg bg-gray-50 outline-none focus:border-sky-500 transition"
        placeholder="Search by user name..."
        value={searchValue}
        onChange={handleChange}
        ref={input}
      />
      {results.length > 0 && (
        <div className="results bg-white py-2 rounded-md absolute w-full md:top-14 shadow-md z-50">
          {results.map((user: User) => {
            return (
              <Link key={user.id} href={`/user/${user.id}`} className="result p-2 flex items-center gap-3 transition hover:bg-gray-200">
                <Image
                  src={user.image || DefaultUser}
                  alt="User profile image"
                  width={30}
                  height={30}
                  className="rounded-full w-8 h-8"
                />
                <div className="name">{user.name}</div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
