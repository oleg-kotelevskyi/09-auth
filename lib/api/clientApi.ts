import { AxiosResponse } from 'axios';
import api from './api';
import { Note, CreateNoteInput } from '@/types/note';
import { User, LoginInput, RegisterInput, UpdateMeInput } from '@/types/user';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const clientApi = {
  // 1. Нотатки
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

    const { data } = await api.get<FetchNotesResponse>('/notes', { params: queryParams });
    return data;
  },

  fetchNoteById: async (id: string): Promise<Note> => {
    const { data } = await api.get<Note>(`/notes/${id}`);
    return data;
  },

  createNote: async (note: CreateNoteInput): Promise<Note> => {
    const { data } = await api.post<Note>('/notes', note);
    return data;
  },

  dynamicDeleteNote: async (id: string): Promise<Note> => {
    const { data } = await api.delete<Note>(`/notes/${id}`);
    return data;
  },

  deleteNote: async (id: string): Promise<Note> => {
    const { data } = await api.delete<Note>(`/notes/${id}`);
    return data;
  },

  register: async (body: RegisterInput): Promise<User> => {
    const { data } = await api.post<User>('/auth/register', body);
    return data;
  },

  login: async (body: LoginInput): Promise<User> => {
    const { data } = await api.post<User>('/auth/login', body);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  checkSession: async (): Promise<AxiosResponse<User | null>> => {
    const response = await api.get<User | null>('/auth/session');
    return response;
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  updateMe: async (body: UpdateMeInput): Promise<User> => {
    const { data } = await api.patch<User>('/users/me', body);
    return data;
  },
};


