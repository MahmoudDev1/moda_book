import { hashUserPassword } from "./hash";
import { sql } from "@vercel/postgres";

export async function createUser(name, email, password) {
  const hashedPassword = hashUserPassword(password);
  try {
    await sql`
      INSERT INTO users (name, email, password) VALUES (${name}, ${email}, ${hashedPassword})
    `;

    const result = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    return { success: true, userId: result.rows[0].id };
  } catch (error) {
    console.error("Error creating user:", error);
    if (error.code === "23505") {
      return { success: false, message: "Email is already taken." };
    } else {
      return { success: false, message: "An error occurred while creating the user." };
    }
  }
}

export async function getUserByEmail(email) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    let user = result.rows[0];
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, user: null};
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return { success: false, message: "An error occurred while retrieving the user." };
  }
}

export async function getUserById(id) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;

    let user = result.rows[0];
    user.password = null
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return { success: false, message: "An error occurred while retrieving the user." };
  }
}