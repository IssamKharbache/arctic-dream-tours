"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Users } from "lucide-react";

export interface MembersSelection {
  adults: number;
  children: number;
  infants: number;
}

interface MembersStepProps {
  value: MembersSelection;
  onChange: (value: MembersSelection) => void;
}

export default function MembersStep({
  value,
  onChange,
}: MembersStepProps) {
  const totalMembers = value.adults + value.children;

  const updateCount = (
    type: keyof MembersSelection,
    amount: number,
  ) => {
    onChange({
      ...value,
      [type]: Math.max(
        type === "adults" ? 1 : 0,
        value[type] + amount,
      ),
    });
  };

  const memberTypes = [
    {
      key: "adults" as const,
      title: "Adults",
      description: "Ages 13 and above",
      minimum: 1,
    },
    {
      key: "children" as const,
      title: "Children",
      description: "Ages 3–12",
      minimum: 0,
    },
    {
      key: "infants" as const,
      title: "Infants",
      description: "Under 3 years",
      minimum: 0,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-xl space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <Users className="h-6 w-6" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900">
          Who's joining the adventure?
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Select the number of travelers in your group.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-4">
          <span className="text-sm text-gray-500">
            Total travelers
          </span>

          <span className="font-semibold text-gray-900">
            {totalMembers}{" "}
            {totalMembers === 1 ? "person" : "people"}
          </span>
        </div>

        <div className="space-y-6">
          {memberTypes.map((member) => (
            <div
              key={member.key}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {member.title}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {member.description}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  disabled={value[member.key] <= member.minimum}
                  onClick={() =>
                    updateCount(member.key, -1)
                  }
                  aria-label={`Remove one ${member.title.toLowerCase()}`}
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <span className="w-5 text-center font-medium tabular-nums">
                  {value[member.key]}
                </span>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  onClick={() =>
                    updateCount(member.key, 1)
                  }
                  aria-label={`Add one ${member.title.toLowerCase()}`}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-gray-500">
        You can review your selection before confirming your booking.
      </p>
    </div>
  );
}