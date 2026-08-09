import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { notesApi } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const note = await notesApi.fetchNoteById(id);
    
    const shortDescription = note.content.length > 150 
      ? `${note.content.substring(0, 150)}...` 
      : note.content;

    return {
      title: note.title,
      description: shortDescription,
      openGraph: {
        title: `${note.title} | NoteHub`,
        description: shortDescription,
        url: `https://notehub.com{id}`,
        images: [
          {
            url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
            width: 1200,
            height: 630,
            alt: note.title,
          },
        ],
      },
    };
  } catch {
    return {
      title: 'Note Details',
      description: 'View note details on NoteHub.',
    };
  }
}

export default async function NoteDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["note", id],
      queryFn: () => notesApi.fetchNoteById(id),
    });
  } catch (error) {
    console.error(`Prefetch note ${id} failed during build:`, error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}

