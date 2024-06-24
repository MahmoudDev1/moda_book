import { searchByName } from "@/lib/user";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import DefaultUser from "@/public/assets/default-user.jpg";
import { notFound } from "next/navigation";

async function SearchContent(props: { name: string }) {
  const results = await searchByName(decodeURIComponent(props.name.toString()), 50);
  
  if (!results.success || !results.users) {
    return notFound()
  }

  return (
    <div className="users">
      {results.users.map((user) => {
        return (
          <Link key={user.id} href={`/user/${user.id}`} className="user bg-white p-3 rounded-md shadow-sm block mb-2">
            <div className="flex gap-2">
              <Image
                src={user.image || DefaultUser}
                alt="User profile image"
                width={60}
                height={60}
                className="rounded-full"
              />
              <div>
                <h1 className="mt-1 font-semibold text-lg">{user.name}</h1>
                <div className="text-gray-400">Member Since 11/4/2024</div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default async function SearchPage(props: { params: { name: string } }) {
  return (
    <Suspense fallback={<h1 className="text-xl font-semibold">Loading...</h1>}>
      <SearchContent name={props.params.name} />
    </Suspense>
  );
}
