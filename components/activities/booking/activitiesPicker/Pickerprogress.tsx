
type Props = {
  pickedCount: number;
  pickCount: number;
  total: number;
  adults: number;
  children: number;
  infants: number;
};

export default function PickerProgress({
  pickedCount,
  pickCount,
  total,
  adults,
  children,
  infants,
}: Props) {
  const remaining = pickCount - pickedCount;
  const progress =
    pickCount > 0 ? (pickedCount / pickCount) * 100 : 0;

  return (
    <div className="flex-shrink-0 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {pickedCount} of {pickCount} chosen
          </p>

          <p className="text-xs text-gray-500">
            {remaining === 0
              ? "Your selection is complete"
              : `${remaining} more to go`}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-gray-400">
            Estimated group total
          </p>

          <p className="text-xl font-semibold tabular-nums text-gray-900">
            €{total.toLocaleString()}
          </p>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {adults} {adults === 1 ? "adult" : "adults"}
        {" · "}
        {children} {children === 1 ? "child" : "children"}
        {" · "}
        {infants} {infants === 1 ? "infant" : "infants"}
      </p>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#E8A94A] to-[#F2BE6B] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
