import { create } from "zustand";

type deleteActionsButtonStoreTypes = {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
};

export const useDeleleActionButtonStore = create<deleteActionsButtonStoreTypes>(
    (set) => ({
        isLoading: false,
        setIsLoading: (isLoading) => set({ isLoading }),
    }),
);
