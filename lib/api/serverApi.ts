import { cookies } from 'next/headers';
import { AxiosResponse } from 'axios';
import api from './api';
import { Note } from '@/types/note';
import { User } from '@/types/user';
import { FetchNotesResponse } from './clientApi';

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
    search: string = '',
    perPage: number = 12,
    tag: string = ''
  ): Promise<FetchNotesResponse> => {
    const queryParams: Record<string, string | number> = { page, perPage };
    if (search.trim() !== '') queryParams.search = search.trim();
    if (tag && tag.trim() !== '' && tag.toLowerCase() !== 'all') {
      queryParams.tag = tag.trim();
    }

    const config = await getServerHeaders();
    const { data } = await api.get<FetchNotesResponse>('/notes', {
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

  getMe: async (): Promise<User> => {
    const config = await getServerHeaders();
    const { data } = await api.get<User>('/users/me', config);
    return data;
  },

  checkSession: async (): Promise<AxiosResponse<User | null>> => {
    const config = await getServerHeaders();
    const response = await api.get<User | null>('/auth/session', config);
    return response;
  },
};


