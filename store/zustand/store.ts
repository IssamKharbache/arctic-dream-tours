import { create } from "zustand";

import { persist } from "zustand/middleware";
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

//user data store
type UserInfo = {
    firstName: string;
    lastName: string;
    email: string;
};

type UserInfoState = UserInfo & {
    setUserInfo: (data: Partial<UserInfo>) => void;
    resetUserInfo: () => void;
};

export const useUserInfoStore = create<UserInfoState>()(
    persist(
        (set) => ({
            firstName: "",
            lastName: "",
            email: "",
            setUserInfo: (data) => set((state) => ({ ...state, ...data })),
            resetUserInfo: () =>
                set({ firstName: "", lastName: "", email: "" }),
        }),
        {
            name: "user-info",
        },
    ),
);
