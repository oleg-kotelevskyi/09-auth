import axios from "axios";
import { Note, CreateNoteInput } from "@/types/note";

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

axios.interceptors.request.use(
  (config) => {
    const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
    if (token && config.headers) {
      const cleanToken = token.replace(/['"]/g, "").trim();
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const notesApi = {
  getAll: async (
    page: number = 1,
    search: string = "",
    perPage: number = 12,
    tag: string = "",
  ): Promise<FetchNotesResponse> => {
    const queryParams: Record<string, string | number> = { page, perPage };

    if (search.trim() !== "") {
      queryParams.search = search.trim();
    }

    if (tag && tag.trim() !== "" && tag.toLowerCase() !== "all") {
      queryParams.tag = tag.trim();
    }

    const { data } = await axios.get<FetchNotesResponse>("/notes", {
      params: queryParams,
    });
    return data;
  },

  fetchNoteById: async (id: string): Promise<Note> => {
    const { data } = await axios.get<Note>(`/notes/${id}`);
    return data;
  },

  create: async (note: CreateNoteInput): Promise<Note> => {
    const { data } = await axios.post<Note>("/notes", note);
    return data;
  },

  delete: async (id: string): Promise<Note> => {
    const { data } = await axios.delete<Note>(`/notes/${id}`);
    return data;
  },
};
