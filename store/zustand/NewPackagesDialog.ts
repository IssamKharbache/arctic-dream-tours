import { create } from "zustand";

interface NewPackagesDialogState {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useNewPackagesDialogStore = create<NewPackagesDialogState>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
);
