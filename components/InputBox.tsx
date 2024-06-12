"use client"

import { ChangeEvent, useEffect, useState } from "react";

interface Props {
  type: string;
  label: string;
  name: string;
  placeholder: string;
  error: string | null
}

export default function InputBox(props: Props) {
  const [isInvalid, setIsInvalid] = useState(props.error)
  useEffect(() => {
    setIsInvalid(props.error)
  }, [props.error])

  function change(e: ChangeEvent) {
    setIsInvalid(null)
  }

  return (
    <div className="input-box relative mb-2">
      <label htmlFor={props.label} className={`block mb-1 text-sm font-medium text-gray-900 dark:text-white ${isInvalid ? "text-red-700" : ""}`}>
        {props.label}
      </label>
      <input
        type={props.type}
        id={props.label}
        className={`bg-gray-50 border border-1 border-gray-300 outline-none text-gray-900 text-sm rounded-lg block w-full p-2.5 ${isInvalid ? 'bg-red-50 border-red-500 focus:border-red-500' : 'focus:border-sky-500'}`}
        placeholder={props.placeholder}
        name={props.name}
        onChange={change}
      />
      {/* {isInvalid && <div className="error absolute top-full right-0 text-red-700">{isInvalid}</div>} */}
    </div>
  );
}
