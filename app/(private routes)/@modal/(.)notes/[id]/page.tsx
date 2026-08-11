import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notesApi } from "@/lib/api";
import NotePreviewClient from "./NotePreview.client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function NotePreview({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => notesApi.fetchNoteById(id),
    });
  } catch (error) {
    console.error(`Prefetch note ${id} failed in preview modal:`, error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient />
    </HydrationBoundary>
  );
}
