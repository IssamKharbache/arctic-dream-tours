
import { create } from "zustand";
import type {
  Picked,
  MembersSelection,
  PackageStep,
  CustomerDetailsData,
  BonusActivitySelection,
} from "@/types/packagespicker";

type ActivityPickerState = {
  step: PackageStep;
  picked: Picked[];
  bonusActivities: BonusActivitySelection[];
  members: MembersSelection;
  customer: Partial<CustomerDetailsData>;

  setStep: (step: PackageStep) => void;
  setPicked: (picked: Picked[]) => void;
  setBonusActivities: (
    bonusActivities: BonusActivitySelection[]
  ) => void;
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
    bonusActivities: [],
    members: initialMembers,
    customer: {},

    setStep: (step) => set({ step }),

    setPicked: (picked) => set({ picked }),

    setBonusActivities: (bonusActivities) =>
      set({ bonusActivities }),

    setMembers: (members) => set({ members }),

    setCustomer: (customer) =>
      set((state) => ({
        customer: { ...state.customer, ...customer },
      })),

    reset: () =>
      set({
        step: 1,
        picked: [],
        bonusActivities: [],
        members: { ...initialMembers },
        customer: {},
      }),
  }));
