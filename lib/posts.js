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
      const postSaved = db.prepare("SELECT 1 FROM saved_posts WHERE post_id = ? AND user_id = ?").get(post.id, user.id);
      post.postSaved = !!postSaved;
      post.isLiked = !!likeExists;
    });
    return { success: true, posts: result };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false };
  }
}

export async function getSavedPostsData() {
  const { user } = await verifyAuth();
  
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
        INNER JOIN saved_posts ON posts.id = saved_posts.post_id
        LEFT JOIN likes ON posts.id = likes.post_id
        WHERE saved_posts.user_id = ?
        GROUP BY posts.id
        `
      )
      .all(user.id);
    
    result.map((post) => {
      const likeExists = db.prepare("SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?").get(post.id, user.id);
      const postSaved = db.prepare("SELECT 1 FROM saved_posts WHERE post_id = ? AND user_id = ?").get(post.id, user.id);
      post.postSaved = !!postSaved;
      post.isLiked = !!likeExists;
    });

    return { success: true, posts: result };
  } catch (error) {
    console.error("Error fetching saved posts:", error);
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

export async function savePost(postId, userId) {
  try {
    db.prepare("INSERT INTO saved_posts (post_id, user_id) VALUES (?, ?)").run(postId, userId);
  } catch (error) {
    console.error("Error Saving Post:", error);
  }
}

export async function deleteSavedPost(postId, userId) {
  try {
    db.prepare("DELETE FROM saved_posts WHERE post_id = ? AND user_id = ?").run(postId, userId);
  } catch (error) {
    console.error("Error Deleting Saved Post:", error);
  }
}

export async function getSavedPosts(userId) {
  try {
    const savedPosts = db.prepare("SELECT post_id FROM saved_posts WHERE user_id = ?").all(userId);
    return savedPosts;
  } catch (error) {
    console.error("Error Retrieving Saved Posts:", error);
    return [];
  }
}

export async function findSavedPost(postId, userId) {
  try {
    const result = db.prepare("SELECT * FROM saved_posts WHERE post_id = ? AND user_id = ?").get(postId, userId);
    return result !== undefined;
  } catch (error) {
    console.error("Error finding like:", error);
    return false;
  }
}