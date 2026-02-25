import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const NOTEHUB_TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${NOTEHUB_TOKEN}`;
  return config;
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  search?: string;
  page?: number;
  perPage?: number;
}

export async function fetchNotes({
  search,
  page = 1,
  perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: { search, page, perPage },
  });

  return data;
}

export interface NoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export async function createNote(noteData: NoteData): Promise<Note> {
  const { data } = await api.post<Note>("/notes", noteData);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}