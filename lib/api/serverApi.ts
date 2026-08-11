import { cookies } from "next/headers";
import api from "./api";
import { Note } from "@/types/note";
import { FetchNotesResponse, UserResponse } from "./clientApi";

const getServerHeaders = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  return {
    headers: {
      Cookie: cookieString,
    },
  };
};

export const serverApi = {
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

    const config = await getServerHeaders();
    const { data } = await api.get<FetchNotesResponse>("/notes", {
      ...config,
      params: queryParams,
    });
    return data;
  },

  fetchNoteById: async (id: string): Promise<Note> => {
    const config = await getServerHeaders();
    const { data } = await api.get<Note>(`/notes/${id}`, config);
    return data;
  },

  getMe: async (): Promise<UserResponse> => {
    const config = await getServerHeaders();
    const { data } = await api.get<UserResponse>("/users/me", config);
    return data;
  },

  checkSession: async (): Promise<UserResponse | null> => {
    try {
      const config = await getServerHeaders();
      const { data } = await api.get<UserResponse | null>(
        "/auth/session",
        config,
      );
      return data;
    } catch {
      return null;
    }
  },
};
