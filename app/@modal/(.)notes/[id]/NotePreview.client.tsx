"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { notesApi } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import { Note } from "@/types/note";
import css from "./NotePreview.module.css";

export default function NotePreviewClient() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => notesApi.fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={handleClose}>
        <p style={{ padding: "20px", textAlign: "center" }}>
          Loading, please wait...
        </p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal isOpen={true} onClose={handleClose}>
        <p style={{ padding: "20px", textAlign: "center" }}>
          Something went wrong.
        </p>
      </Modal>
    );
  }

  return (
    <Modal isOpen={true} onClose={handleClose}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.tag}>{note.tag || "General"}</p>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString("uk-UA")}
        </p>

        <button type="button" className={css.backBtn} onClick={handleClose}>
          Close preview
        </button>
      </div>
    </Modal>
  );
}
