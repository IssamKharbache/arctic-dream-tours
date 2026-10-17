
import { create } from "zustand";
import type {
  Picked,
  MembersSelection,
  PackageStep,
  CustomerDetailsData,
} from "@/types/packagespicker";

type ActivityPickerState = {
  step: PackageStep;
  picked: Picked[];
  members: MembersSelection;
  customer: Partial<CustomerDetailsData>;

  setStep: (step: PackageStep) => void;
  setPicked: (picked: Picked[]) => void;
  setMembers: (members: MembersSelection) => void;
  setCustomer: (customer: Partial<CustomerDetailsData>) => void;
  reset: () => void;
};

const initialMembers: MembersSelection = {
  adults: 1,
  children: 0,
  infants: 0,
};

export const useActivityPickerStore =
  create<ActivityPickerState>((set) => ({
    step: 1,
    picked: [],
    members: initialMembers,
    customer: {},

    setStep: (step) => set({ step }),
    setPicked: (picked) => set({ picked }),
    setMembers: (members) => set({ members }),
    setCustomer: (customer) =>
      set((state) => ({
        customer: { ...state.customer, ...customer },
      })),

    reset: () =>
      set({
        step: 1,
        picked: [],
        members: { ...initialMembers },
        customer: {},
      }),
  }));
