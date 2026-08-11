import api from "./api";
import { Note, CreateNoteInput } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface UserResponse {
  email: string;
  username: string;
  avatar: string;
}

export const clientApi = {
  fetchNotes: async (
    page: number = 1,
    search: string = "",
    perPage: number = 12,
    tag: string = "",
  ): Promise<FetchNotesResponse> => {
    const queryParams: Record<string, string | number> = { page, perPage };
    if (search.trim() !== "") queryParams.search = search.trim();
    if (tag && tag.trim() !== "" && tag.toLowerCase() !== "all") {
      queryParams.tag = tag.trim();
    }

    const { data } = await api.get<FetchNotesResponse>("/notes", {
      params: queryParams,
    });
    return data;
  },

  fetchNoteById: async (id: string): Promise<Note> => {
    const { data } = await api.get<Note>(`/notes/${id}`);
    return data;
  },

  createNote: async (note: CreateNoteInput): Promise<Note> => {
    const { data } = await api.post<Note>("/notes", note);
    return data;
  },

  deleteNote: async (id: string): Promise<Note> => {
    const { data } = await api.delete<Note>(`/notes/${id}`);
    return data;
  },

  register: async (body: Record<string, string>): Promise<unknown> => {
    const { data } = await api.post("/auth/register", body);
    return data;
  },

  login: async (body: Record<string, string>): Promise<unknown> => {
    const { data } = await api.post("/auth/login", body);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  checkSession: async (): Promise<unknown> => {
    const { data } = await api.get("/auth/session");
    return data;
  },

  getMe: async (): Promise<unknown> => {
    const { data } = await api.get("/users/me");
    return data;
  },

  updateMe: async (body: Record<string, string>): Promise<unknown> => {
    const { data } = await api.patch("/users/me", body);
    return data;
  },
};
