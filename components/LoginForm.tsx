"use client";

import { login } from "@/actions/auth";
import { useFormState, useFormStatus } from "react-dom";
import Spinner from "./Spinner";
import Link from "next/link";
import InputBox from "./InputBox";
import LoginIcon from "./LoginIcon";

interface Errors {
  email: string | null;
  password: string | null;
}

interface State {
  errors: Errors;
}

function FormSubmit() {
  const { pending } = useFormStatus();

  return (
    <div className="flex mt-6 gap-2 items-center justify-between">
      {pending ? (
        <button className="main-btn opacity-75">
          <Spinner />
          Login
        </button>
      ) : (
        <button className="main-btn">
          <LoginIcon />
          Login
        </button>
      )}
      <Link href="/register" className="text-sky-500">
        Don&apos;t have an account?
      </Link>
    </div>
  );
}

export default function LoginForm() {
  const [formState, formAction] = useFormState<State, FormData>(login, {
    errors: { email: null, password: null },
  });

  return (
    <form action={formAction} className="mt-6">
      <InputBox
        name="email"
        label="Email address"
        placeholder="Enter your email address"
        type="email"
        error={formState.errors.email}
      />
      <InputBox
        name="password"
        label="Password"
        placeholder="Enter your password"
        type="password"
        error={formState.errors.password}
      />
      <FormSubmit />
    </form>
  );
}
