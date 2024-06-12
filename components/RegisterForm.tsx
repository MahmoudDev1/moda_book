"use client";

import InputBox from "@/components/InputBox";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";
import { signup } from "@/actions/auth";
import Spinner from "@/components/Spinner";
import PlusIcon from "@/components/PlusIcon";

interface Errors {
  name: string | null;
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
          Register
        </button>
      ) : (
        <button className="main-btn">
          <PlusIcon />
          Register
        </button>
      )}
      <Link href="/login" className="text-sky-500">
        Already have an account?
      </Link>
    </div>
  );
}

export default function RegisterForm() {
  const [formState, formAction] = useFormState<State, FormData>(signup, {
    errors: { name: null, email: null, password: null },
  });

  return (
    <form action={formAction} className="mt-6">
      <InputBox name="name" label="Name" placeholder="Enter your name" type="text" error={formState.errors.name} />
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
        placeholder="Enter a strong password"
        type="password"
        error={formState.errors.password}
      />
      <FormSubmit />
    </form>
  );
}
