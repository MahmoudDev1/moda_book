import HomePosts from "@/components/HomePosts";
import SkeletonPost from "@/components/SkeletonPost";
import { verifyAuth } from "@/lib/auth";
import { getUserById } from "@/lib/user";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const { user } = await verifyAuth();
  let userData = null;
  if (user) {
    userData = await getUserById(user!.id);
  }

  return (
    <div className="home">
      <div className="box bg-white p-5 rounded-md shadow-sm mb-4">
        {user ? (
          <>
            <h3 className="text-2xl font-semibold">
              Welcome, <span className="text-sky-500">{userData?.user?.name}</span>
            </h3>
            <p className="text-gray-400 text-md">You can now create posts, check out new posts and like posts also.</p>
            <Link className="main-btn mt-5" href="/create-post">
              Create a new post
            </Link>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-semibold">
              Welcome to <span className="text-sky-500">Modabook</span>
            </h3>
            <p className="text-gray-400 text-md">
              Our website is used to communicate with other people and share your knowledge together in varius fields,
              but you need to register/login to access all the benefits.
            </p>
            <Link href="/register" className="main-btn mt-5">
              Register Now!
            </Link>
          </>
        )}
      </div>
      <Suspense
        fallback={
          <>
            <SkeletonPost />
            <SkeletonPost />
          </>
        }
      >
        {user && <HomePosts />}
      </Suspense>
    </div>
  );
}
