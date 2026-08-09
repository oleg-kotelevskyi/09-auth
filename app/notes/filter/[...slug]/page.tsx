import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { notesApi } from '@/lib/api';
import NotesClient from './Notes.client';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

const VALID_TAGS = ['all', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug?.[0] || 'all';
  
  const displayTag = currentTag.toLowerCase() === 'all' ? 'All' : currentTag;
  const title = `${displayTag} Notes`;
  const description = `Browse and filter your ${displayTag.toLowerCase()} notes on NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | NoteHub`,
      description,
      url: `https://notehub.com/${currentTag}`,
      images: [
        {
          url: 'https://goit.global',
          width: 1200,
          height: 630,
          alt: `NoteHub - ${title}`,
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const queryClient = new QueryClient();
  const currentTag = slug?.[0] || 'all';

  if (!VALID_TAGS.includes(currentTag) || slug.length > 1) {
    notFound();
  }

  try {
    await queryClient.prefetchQuery({
      queryKey: ['notes', 1, '', currentTag],
      queryFn: () => notesApi.getAll(1, '', 12, currentTag),
    });
  } catch {
    console.error('Prefetch notes failed during build.');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={currentTag} />
    </HydrationBoundary>
  );
}


