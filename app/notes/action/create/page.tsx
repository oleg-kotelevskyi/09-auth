import { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Create note',
  description: 'Create and save a new personal note on NoteHub.',
  openGraph: {
    title: 'Create note | NoteHub',
    description: 'Create and save a new personal note on NoteHub.',
    url: 'https://notehub.com/notes/action/create',
    images: [
      {
        url: 'https://goit.global',
        width: 1200,
        height: 630,
        alt: 'Create note on NoteHub',
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}

