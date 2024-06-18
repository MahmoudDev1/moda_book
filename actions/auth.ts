"use server";
import { createAuthSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/hash";
import { createUser, getUserByEmail } from "@/lib/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface Errors {
  name: string | null;
  email: string | null;
  password: string | null;
}

interface LoginErrors {
  email: string | null;
  password: string | null;
}

interface State {
  errors: Errors;
}

interface LoginState {
  errors: LoginErrors;
}

export async function signup(state: State, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, 1000);
  });

  let errors: Errors = { name: null, email: null, password: null };

  if (!name) {
    errors.name = "Please enter a name.";
  }

  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password || password.length <= 6) {
    errors.password = "Password must be at least 6 characters long.";
  }

  if (!errors.name && !errors.email && !errors.password) {
    const result = await createUser(name, email, password);
    if (!result.success) {
      errors.email = result.message as string;
    } else {
      await createAuthSession(result.userId);
      redirect("/");
    }
  }

  return { errors };
}

export async function login(state: LoginState, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(null);
    }, 1000);
  });

  let errors: LoginErrors = { email: null, password: null };

  if (!email || !email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (!password) {
    errors.password = "Please enter a password.";
  }

  if (!errors.email && !errors.password) {
    const result = await getUserByEmail(email);
    if (!result.success || !result.user) {
      errors.email = "Email or password is wrong.";
    } else {
      const passwordValid = verifyPassword(result.user.password, password);

      if (!passwordValid) {
        errors.email = "Email or password is wrong.";
      } else {
        await createAuthSession(result.user.id);
        redirect("/");
      }
    }
  }

  return { errors };
}

export async function logout() {
  cookies().delete("auth_session");
  return redirect("/login");
}
