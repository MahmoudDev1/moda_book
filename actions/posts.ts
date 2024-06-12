"use server";
import { verifyAuth } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { insertPost, findLike, insertLike, deleteLike } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData): Promise<void> {
  const text = formData.get("text") as string;
  const image = formData.get("image") as File;
  let image_url: string | null = null;
  
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  if (image && image.size > 0) { // image exists on the post
    try {
      image_url = await uploadImage(image);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  }

  try {
    await insertPost(text, image_url);
  } catch (error) {
    console.error("Error inserting post:", error);
    throw new Error("Failed to insert post");
  }

  redirect("/");
}

export async function toggleLike(postId: number): Promise<void> {
  const { user } = await verifyAuth();
  const userId = user?.id;
  
  await new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });

  try {
    const existingLike = await findLike(postId, userId);
    if (existingLike) {
      await deleteLike(postId, userId);
    } else {
      await insertLike(postId, userId);
    }
    revalidatePath("/", "page")
  } catch (error) {
    throw new Error("Failed.. " + error);
  }
}
