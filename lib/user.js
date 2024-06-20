import { hashUserPassword } from "./hash";
import { sql } from "@vercel/postgres";

export async function createUser(name, image_url, email, password) {
  const hashedPassword = hashUserPassword(password);
  try {
    await sql`
      INSERT INTO users (name, image, email, password) VALUES (${name}, ${image_url}, ${email}, ${hashedPassword})
    `;

    const result = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;
    return { success: true, userId: result.rows[0].id };
  } catch (error) {
    if (error.code === "23505") {
      return { success: false, message: "Email is already taken." };
    } else {
      console.error("Error creating user:", error);
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
      return { success: false, user: null };
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
    user.password = null;
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

export async function searchByName(name) {
  try {
    const searchPattern = `%${name.toLowerCase()}%`;

    const result = await sql`
      SELECT * FROM users WHERE LOWER(name) LIKE ${searchPattern} LIMIT 5
    `;
    const users = result.rows;

    if (users.length > 0) {
      return { success: true, users };
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    console.error("Error retrieving users:", error);
    return { success: false, message: "An error occurred while retrieving the users." };
  }
}
