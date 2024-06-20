
import LoginForm from "@/components/LoginForm";
import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const { user } = await verifyAuth();
  if(user) {
    return redirect("/")
  }
  return (
    <div className="home">
      <div className="box bg-white p-5 rounded-md shadow-sm mx-auto w-100 md:w-1/2">
        <h3 className="text-2xl font-semibold">Login to your account</h3>
        <LoginForm />
      </div>
    </div>
  );
}
