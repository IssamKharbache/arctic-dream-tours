import { create } from "zustand";

//authentifaction dialogs store

type AuthDialogs = {
  isSignupOpen: boolean;
  setIsSignUpOpen: (isSignupOpen: boolean) => void;
  isSignInOpen: boolean;
  setIsSignInOpen: (isSignInOpen: boolean) => void;
};

export const useAuthDialogsStore = create<AuthDialogs>((set) => ({
  isSignupOpen: false,
  setIsSignUpOpen: (isSignupOpen) => set({ isSignupOpen }),
  isSignInOpen: false,
  setIsSignInOpen: (isSignInOpen) => set({ isSignInOpen }),
}));
