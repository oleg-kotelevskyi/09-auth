import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CreateNoteInput } from '@/types/note';

interface NoteStore {
  draft: CreateNoteInput;
  setDraft: (note: Partial<CreateNoteInput>) => void;
  clearDraft: () => void;
}

const initialDraft: CreateNoteInput = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      
      setDraft: (updatedFields: Partial<CreateNoteInput>) =>
        set((state: NoteStore) => ({
          draft: { ...state.draft, ...updatedFields },
        })),
        
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'notehub-draft-storage',
      storage: createJSONStorage(() => localStorage),
      
      partialize: (state: NoteStore) => ({ draft: state.draft }),
    }
  )
);


