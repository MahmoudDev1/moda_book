import { toggleSave } from "@/actions/posts";
import { useFormStatus } from "react-dom";

function Button(props: { postSaved: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="main-btn-sm" disabled={pending}>
      {props.postSaved ? "Remove from saved" : "Save Post"}
    </button>
  );
}

export default function SavePost(props: { id: number; postSaved: boolean }) {
  return (
    <form action={() => toggleSave(props.id)}>
      <Button postSaved={props.postSaved} />
    </form>
  );
}
