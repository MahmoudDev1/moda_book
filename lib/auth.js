import { Lucia } from "lucia";
import { cookies } from "next/headers";
import { db } from "@vercel/postgres";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { cache } from "react";

const adapter = new NodePostgresAdapter(db, {
  user: "users", // Replace with your actual table name
  session: "sessions", // Replace with your actual table name
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export async function createAuthSession(userId) {
  const session = await lucia.createSession(userId, {});
  const cookie = lucia.createSessionCookie(session.id);
  cookies().set(cookie.name, cookie.value, cookie.attributes);
}

export const verifyAuth = async () => {
  const sessionCookie = cookies().get(lucia.sessionCookieName);

  if (!sessionCookie) {
    return { user: null, session: null };
  }

  const sessionId = sessionCookie.value;

  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const cookie = lucia.createSessionCookie(result.session.id);
      cookies().set(cookie.name, cookie.value, cookie.attributes);
    }

    if (!result.session) {
      const cookie = lucia.createBlankSessionCookie();
      cookies().set(cookie.name, cookie.value, cookie.attributes);
    }
  } catch {}

  return result;
};

export default lucia;
