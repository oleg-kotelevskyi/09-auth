"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { notesApi } from "../../../../lib/api";
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => notesApi.fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag || "General"}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>
            {new Date(note.createdAt).toLocaleDateString("uk-UA")}
          </p>
        </div>
      </div>
    </main>
  );
}
