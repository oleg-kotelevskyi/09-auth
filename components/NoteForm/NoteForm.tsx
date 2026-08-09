'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import { notesApi } from '../../lib/api';
import { useNoteStore } from '../../lib/store/noteStore';
import { CreateNoteInput } from '../../types/note';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel?: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Мінімум 3 символи")
    .max(50, "Максимум 50 символів")
    .required("Обов'язкове поле"),
  content: Yup.string().max(500, "Максимум 500 символів"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Невалідний тег")
    .required("Обов'язкове поле"),
});

const NoteForm = ({ onCancel }: NoteFormProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const [errors, setErrors] = useState<{ title?: string; content?: string; tag?: string }>({});

  const createNoteMutation = useMutation({
    mutationFn: (newNote: CreateNoteInput) => notesApi.create(newNote),
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      
      if (onCancel) {
        onCancel();
      } else {
        router.push('/notes/filter/all');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formValues: CreateNoteInput = draft;

    try {
      await NoteSchema.validate(formValues, { abortEarly: false });
      createNoteMutation.mutate(formValues);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title} 
          onChange={(e) => setDraft({ title: e.target.value })}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content} 
          onChange={(e) => setDraft({ content: e.target.value })}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag} 
          onChange={(e) => setDraft({ tag: e.target.value })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      {createNoteMutation.isError && (
        <p className={css.serverError}>Failed to create note. Please try again.</p>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={onCancel ? onCancel : () => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;




