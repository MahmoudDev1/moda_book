import { sql } from "@vercel/postgres";
import { verifyAuth } from "./auth";

export async function insertPost(text, image) {
  const { user } = await verifyAuth();
  try {
    await sql`INSERT INTO posts (text, image, user_id, likes) VALUES (${text},${image},${user.id},0)`;
    return { success: true };
  } catch (error) {
    console.error("Error inserting post:", error);
    return { success: false };
  }
}

export async function getPosts() {
  const { user } = await verifyAuth();

  try {
    const { rows } = await sql`
    SELECT 
      posts.id, 
      posts.image, 
      posts.text, 
      posts.user_id,
      posts.created_at,
      COUNT(likes.post_id) AS likes_count
    FROM posts
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.created_at IS NOT NULL
    GROUP BY posts.id
    ORDER BY posts.created_at DESC;`

    for (const post of rows) {
      const likeExists = await sql`SELECT 1 FROM likes WHERE post_id = ${post.id} AND user_id = ${user.id}`;
      const postSaved = await sql`SELECT 1 FROM saved_posts WHERE post_id = ${post.id} AND user_id = ${user.id}`;
      const postUser = await sql`SELECT id,name,image FROM users WHERE id = ${post.user_id}`
      post.isLiked = likeExists.rows.length > 0;
      post.postSaved = postSaved.rows.length > 0;
      post.user = postUser.rows[0]
    }
    return { success: true, posts: rows };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false };
  }
}

export async function getSavedPostsData() {
  const { user } = await verifyAuth();

  try {
    const {rows} = await sql`
      SELECT 
        posts.id, 
        posts.image, 
        posts.text, 
        posts.created_at,
        COUNT(likes.post_id) AS likes_count
      FROM posts
      INNER JOIN saved_posts ON posts.id = saved_posts.post_id
      LEFT JOIN likes ON posts.id = likes.post_id
      WHERE saved_posts.user_id = ${user.id}
      GROUP BY posts.id
      ORDER BY posts.created_at DESC;
    `;

    for (const post of rows) {
      const likeExists = await sql`SELECT 1 FROM likes WHERE post_id = ${post.id} AND user_id = ${user.id}`;
      const postSaved = await sql`SELECT 1 FROM saved_posts WHERE post_id = ${post.id} AND user_id = ${user.id}`;
      const postUser = await sql`SELECT id,name,image FROM users WHERE id = ${post.user_id}`
      post.isLiked = likeExists.rows.length > 0;
      post.postSaved = postSaved.rows.length > 0;
      post.user = postUser.rows[0]
    }

    return { success: true, posts: rows };
  } catch (error) {
    console.error("Error fetching saved posts:", error);
    return { success: false };
  }
}

export async function findLike(postId, userId) {
  const result = await sql`SELECT * FROM likes WHERE post_id = ${postId} AND user_id = ${userId}`;
  return result.rows;
}

export async function insertLike(postId, userId) {
  try {
    await sql`
      INSERT INTO likes (post_id, user_id) VALUES (${postId}, ${userId})
    `;
  } catch (error) {
    console.error("Error inserting like:", error);
  }
}

export async function deleteLike(postId, userId) {
  try {
    await sql`
      DELETE FROM likes WHERE post_id = ${postId} AND user_id = ${userId}
    `;
  } catch (error) {
    console.error("Error deleting like:", error);
  }
}

export async function savePost(postId, userId) {
  try {
    await sql`
      INSERT INTO saved_posts (post_id, user_id) VALUES (${postId}, ${userId})
    `;
  } catch (error) {
    console.error("Error Saving Post:", error);
  }
}

export async function deleteSavedPost(postId, userId) {
  try {
    await sql`DELETE FROM saved_posts WHERE post_id = ${postId} AND user_id = ${userId}`
  } catch (error) {
    console.error("Error Deleting Saved Post:", error);
  }
}

export async function getSavedPosts(userId) {
  try {
    const result = await sql`SELECT post_id FROM saved_posts WHERE user_id = ${userId}`
    return result.rows;
  } catch (error) {
    console.error("Error Retrieving Saved Posts:", error);
    return [];
  }
}

export async function findSavedPost(postId, userId) {
  try {
    const result = await sql`SELECT * FROM saved_posts WHERE post_id = ${postId} AND user_id = ${userId}`

    return result.rows;
  } catch (error) {
    console.error("Error finding posts:", error);
    return false;
  }
}

export async function getUserPosts(id) {
  const results = await sql`
    SELECT 
      posts.id, 
      posts.image, 
      posts.text, 
      COUNT(likes.post_id) AS likes_count
    FROM posts
    LEFT JOIN likes ON posts.id = likes.post_id
    WHERE posts.user_id = ${id}
    GROUP BY posts.id
  `

  return results.rows
}