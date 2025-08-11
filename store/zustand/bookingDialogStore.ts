import { create } from "zustand";

interface BookingDialogType {
    openDialog: boolean;
    setOpenDialog: (openDialog: boolean) => void;
    step: number;
    setStep: (step: number) => void;
}

export const useBookingDialogStore = create<BookingDialogType>((set) => ({
    openDialog: false,
    setOpenDialog: (openDialog: boolean) => set({ openDialog }),
    step: 1,
    setStep: (step: number) => set({ step }),
}));
