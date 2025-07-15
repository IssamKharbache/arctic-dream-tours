import { create } from "zustand";

interface EditDialogState {
    openDialogId: string | null;
    openDialog: (id: string) => void;
    closeDialog: () => void;
}

export const useEditDialogStore = create<EditDialogState>((set) => ({
    openDialogId: null,
    openDialog: (id) => set({ openDialogId: id }),
    closeDialog: () => set({ openDialogId: null }),
}));
