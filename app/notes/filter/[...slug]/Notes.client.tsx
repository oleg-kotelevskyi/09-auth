"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import {
  useParams,
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import Link from "next/link";

import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import EmptyState from "@/components/EmptyState/EmptyState";

import { clientApi } from "@/lib/api/clientApi";
import { Note } from "@/types/note";

import css from "./notes.module.css";

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const slug = params?.slug as string[] | undefined;
  const currentTag = slug ? slug[0] : tag;

  const page = Number(searchParams?.get("page")) || 1;
  const filter = searchParams?.get("search") || "";

  const tagFilter = currentTag === "all" ? "" : currentTag;

  const { data, isLoading, isError, isPlaceholderData } =
    useQuery<NotesResponse>({
      queryKey: ["notes", page, filter, tagFilter],
      queryFn: async () => {
        const result = await clientApi.fetchNotes(page, filter, 12, tagFilter);
        return result as NotesResponse;
      },
      placeholderData: keepPreviousData,
    });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const currentParams = new URLSearchParams(window.location.search);

    if (value.trim()) {
      currentParams.set("search", value.trim());
    } else {
      currentParams.delete("search");
    }

    currentParams.set("page", "1");
    router.push(`${pathname}?${currentParams.toString()}`);
  }, 500);

  const handlePageChange = (newPage: number) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("page", newPage.toString());
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const notesArray = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;
  const hasNotes = notesArray.length > 0;

  return (
    <div className={css.container}>
      <header className={css.header}>
        <div className={css.headerActions}>
          <SearchBox onChange={debouncedSearch} value={filter} />

          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
        </div>
      </header>

      {isLoading && !isPlaceholderData && (
        <Loader message="Fetching your notes from NoteHub..." />
      )}
      {isError && (
        <ErrorMessage message="Failed to load notes. Please check your connection or token." />
      )}

      {!isLoading &&
        !isError &&
        (hasNotes ? (
          <NoteList notes={notesArray} />
        ) : (
          <EmptyState
            message={
              filter
                ? `No results found for "${filter}"`
                : "Your note history is empty."
            }
          />
        ))}

      {hasNotes && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
