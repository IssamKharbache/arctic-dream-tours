import { Check, Gift } from "lucide-react";
import type { BonusActivity } from "@/app/data/laplandPackages";

type Props = {
  items: BonusActivity[];
};

export default function BonusActivities({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Gift className="h-4 w-4 text-[#B9822B]" />
        <h4 className="text-sm font-semibold text-gray-900">
          Included as a gift
        </h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item.id}
            className="inline-flex items-center gap-2 rounded-full bg-[#F6EBD7] px-3.5 py-1.5 text-sm font-medium text-[#6B4A12]"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            {item.title}
          </span>
        ))}
      </div>
    </section>
  );
}
