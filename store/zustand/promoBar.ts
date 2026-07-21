import { create } from "zustand";

interface PromobarType {
  openPromobar: boolean;
  setOpenPromoBar: (openPromobar: boolean) => void;
}

export const usePromobarStore = create<PromobarType>((set) => ({
  openPromobar: true,
  setOpenPromoBar: (openPromobar: boolean) => set({ openPromobar }),
}));
