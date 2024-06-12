"use client";
import { ChangeEvent, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";
import { createPost } from "@/actions/posts";
import Image from "next/image";

function AddPostButton(props: { isDisabled: boolean }) {
  const { pending } = useFormStatus();
  return pending ? (
    <button
      disabled={true}
      className="main-btn justify-center disabled:opacity-65 disabled:bg-sky-500"
      style={{ width: "100%" }}
    >
      <Spinner />
      Post
    </button>
  ) : (
    <button
      disabled={props.isDisabled}
      className="main-btn justify-center disabled:opacity-65 disabled:bg-sky-500"
      style={{ width: "100%" }}
    >
      Post
    </button>
  );
}

export default function AddPost() {
  const imageInput = useRef<HTMLInputElement>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  function addImage(e: any) {
    e.preventDefault();
    imageInput.current!.click();
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageURL(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function textChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value !== "") {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }

  return (
    <form action={createPost}>
      <textarea
        name="text"
        rows={6}
        autoFocus
        placeholder="What's on your mind?"
        className="bg-gray-50 border border-1 border-gray-300 outline-none placeholder:text-gray-600 placeholder:text-lg text-gray-900 text-lg rounded-lg block w-full p-2.5 resize-none"
        onChange={textChange}
      ></textarea>
      {imageURL && (
        <div className="my-3">
          <Image src={imageURL} alt="Uploaded" className="rounded-md w-full h-52 object-cover" width={100} height={200} />
        </div>
      )}
      <div className="flex gap-3 items-center mt-3">
        <input type="file" name="image" accept="image/*" hidden ref={imageInput} onChange={handleImageChange} />
        <button onClick={addImage}>
          <Image src="assets/gallary.svg" alt="Add image to post" width={45} height={45} />
        </button>
        <AddPostButton isDisabled={isDisabled} />
      </div>
    </form>
  );
}
