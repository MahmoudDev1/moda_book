import { verifyAuth } from "./auth";
import db from "./db";

export async function insertPost(text, image) {
  const { user } = await verifyAuth();
  try {
    db.prepare("INSERT INTO posts (text, image, user_id, likes) VALUES (?,?,?,?)").run(text, image, user.id, 0);
    return { success: true };
  } catch (error) {
    console.error("Error inserting post:", error);
    return { success: false };
  }
}

export async function getPosts() {
  const { user } = await verifyAuth();
  await new Promise((resolve) => {
    setTimeout(resolve, 4000);
  });
  try {
    const result = db
      .prepare(
        `
      SELECT 
        posts.id, 
        posts.image, 
        posts.text, 
        posts.likes,
        COUNT(likes.post_id) AS likes_count
      FROM posts
      LEFT JOIN likes ON posts.id = likes.post_id
      GROUP BY posts.id
    `
      )
      .all();
    result.map((post) => {
      const likeExists = db.prepare("SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?").get(post.id, user.id);
      post.isLiked = likeExists ? 1 : 0;
    });
    return { success: true, posts: result };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false };
  }
}

export async function findLike(postId, userId) {
  try {
    const result = db.prepare("SELECT * FROM likes WHERE post_id = ? AND user_id = ?").get(postId, userId);
    return result !== undefined;
  } catch (error) {
    console.error("Error finding like:", error);
    return false;
  }
}

export async function insertLike(postId, userId) {
  try {
    db.prepare("INSERT INTO likes (post_id, user_id) VALUES (?, ?)").run(postId, userId);
  } catch (error) {
    console.error("Error inserting like:", error);
  }
}

export async function deleteLike(postId, userId) {
  try {
    db.prepare("DELETE FROM likes WHERE post_id = ? AND user_id = ?").run(postId, userId);
  } catch (error) {
    console.error("Error deleting like:", error);
  }
}
