'use client';

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "@/lib/api/clientApi"; 
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientApi.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.contentWrapper}>
            <span className={css.tag}>{note.tag || 'General'}</span>
            <h3 className={css.title}>{note.title}</h3>
            <p className={css.content}>
              {note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content}
            </p>
          </div>
          <div className={css.actions}>
            <Link href={`/notes/${note.id}`} className={css.viewButton}>
              View details
            </Link>
            <button
              type="button"
              className={css.deleteButton}
              onClick={() => deleteMutation.mutate(note.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

