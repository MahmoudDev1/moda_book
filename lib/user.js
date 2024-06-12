import { hashUserPassword } from "./hash";
import db from "./db";

export function createUser(name, email, password) {
  try {
    const result = db
      .prepare("INSERT INTO users (name, email, password) VALUES (?,?,?)")
      .run(name, email, hashUserPassword(password));
    return { success: true, userId: result.lastInsertRowid };
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return { success: false, message: "Email is already taken." };
    } else {
      return { success: false, message: "An error occurred while creating the user." };
    }
  }
}

export function getUserByEmail(email) {
  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    return { success: false, message: "An error occurred while retrieving the user." };
  }
}

export function getUserById(id) {
  try {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    return { success: false, message: "An error occurred while retrieving the user." };
  }
}