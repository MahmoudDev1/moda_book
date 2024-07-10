import { verifyAuth } from "./auth";
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
      const authResult = await verifyAuth();
      const friendRequestResult = await sql`
      SELECT status 
      FROM friend_requests 
      WHERE (from_id = ${authResult.user.id} AND to_id = ${id})
          OR (to_id = ${authResult.user.id} AND from_id = ${id})
      ORDER BY request_date DESC
      LIMIT 1;
    `;

      const friendRequestStatus = friendRequestResult.rows[0]?.status || null;

      return { success: true, user, friendRequestStatus };
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    console.error("Error retrieving user:", error);
    return { success: false, message: "An error occurred while retrieving the user." };
  }
}

export async function searchByName(name, limit) {
  try {
    const searchPattern = `%${name.toLowerCase()}%`;

    const result = await sql`
      SELECT * FROM users WHERE LOWER(name) LIKE ${searchPattern} LIMIT ${limit}
    `;
    const users = result.rows;

    if (users.length > 0) {
      return { success: true, users };
    } else {
      return { success: false, message: "No users found." };
    }
  } catch (error) {
    console.error("Error retrieving users:", error);
    return { success: false, message: "An error occurred while retrieving the users." };
  }
}

export async function getUserId() {
  const result = await verifyAuth();
  return result.user.id || null;
}

export async function insertFriendRequest(from, to) {
  const result = await sql`
    INSERT INTO friend_requests (from_id, to_id, status, request_date)
    VALUES (${from}, ${to}, 'pending', CURRENT_TIMESTAMP);
  `;
  const userResult = await sql`
    SELECT * 
    FROM users 
    WHERE id = ${from};
  `;
  return userResult.rows[0]
}

export async function deleteFriendRequest(from, to) {
  const result = await sql`
    DELETE FROM friend_requests
    WHERE from_id = ${from} AND to_id = ${to}
    RETURNING *;
  `;
}

export async function updateRequestStatus(from, to) {
  try {
    const result = await sql`
    UPDATE friend_requests
    SET status = 'accepted'
    WHERE from_id = ${from} AND to_id = ${to}
    RETURNING *;
  `;

    if (result.rowCount > 0) {
      await sql`
      INSERT INTO friends (user_id, friend_id, friendship_date)
      VALUES  (${from}, ${to}, CURRENT_TIMESTAMP),
              (${to}, ${from}, CURRENT_TIMESTAMP)
    `;

      return { success: true, message: "Friend request accepted successfully." };
    } else {
      return { success: false, message: "Error while accepting friend request." };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Error while accepting friend request." };
  }
}

export async function getUserFriends() {
  try {
    const { user } = await verifyAuth();
    const friendsResult = await sql`
      SELECT u.id, u.name, u.image, f.friendship_date
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = ${user.id}
    `;

    const friends = friendsResult.rows;

    const friendRequestsResult = await sql`
      SELECT fr.id AS request_id, fr.from_id, fr.to_id, fr.status, fr.request_date, u.name, u.image
      FROM friend_requests fr
      JOIN users u ON u.id = fr.from_id
      WHERE fr.to_id = ${user.id} AND fr.status = 'pending'
    `;

    const friendRequests = friendRequestsResult.rows;
    return { success: true, friends, friendRequests };
  } catch (error) {
    return { success: false, message: "An error occurred while retrieving friends and friend requests." };
  }
}

export async function deleteFriendDb(friendId) {
  try {
    const userId = await getUserId();

    await sql`
      DELETE FROM friends 
      WHERE (user_id = ${userId} AND friend_id = ${friendId}) 
        OR (user_id = ${friendId} AND friend_id = ${userId});
    `;

    await sql`
      DELETE FROM friend_requests 
      WHERE (from_id = ${userId} AND to_id = ${friendId}) 
        OR (from_id = ${friendId} AND to_id = ${userId});
    `;

    return { success: true };
  } catch (error) {
    console.error("Error deleting friend and requests:", error);
    return { success: false, error: "An error occurred while deleting friend and requests." };
  }
}

export async function deleteFriendRequestsDb(friendId) {
  try {
    const userId = await getUserId();

    await sql`
      DELETE FROM friend_requests 
      WHERE (from_id = ${userId} AND to_id = ${friendId}) 
        OR (from_id = ${friendId} AND to_id = ${userId});
    `;

    return { success: true };
  } catch (error) {
    console.error("Error deleting friend and requests:", error);
    return { success: false, error: "An error occurred while deleting friend and requests." };
  }
}

export async function getUserRequestsCount() {
  try {
    const userId = await getUserId();

    const { rows } = await sql`
      SELECT COUNT(*) as count 
      FROM friend_requests 
      WHERE to_id = ${userId} AND status = 'pending';
    `;

    const count = rows[0].count;
    return { success: true, count };
  } catch (error) {
    console.error("Error fetching friend requests count:", error);
    return { success: false, error: "An error occurred while fetching friend requests count." };
  }
}
