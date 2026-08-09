export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateNoteInput = Omit<Note, "id" | "createdAt" | "updatedAt">;
