
import Link from "next/link";
import AddPost from "@/components/AddPost";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Modal() {
  const { user } = await verifyAuth();
  if(!user) {
    return redirect("/login")
  }
  return (
    <>
      <Link className="overlay cursor-default" href="/"></Link>
      <div className="modal rounded-md bg-white p-3 shadow-md">
        <div className="mb-3 pb-3 border-b flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Create new post</h2>
          <Link href="/" className="w-8 h-8 rounded-full flex justify-center items-center bg-gray-200">
            <Image src="assets/x.svg" alt="Close Modal" width={15} height={15} />
          </Link>
        </div>
        <AddPost />
      </div>
    </>
  );
}
