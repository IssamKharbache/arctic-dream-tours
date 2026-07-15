"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Locale } from "next-intl";
import { useParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { routing, localeMeta, LocaleType } from "@/i18n/routing";
import { useState } from "react";
import Image from "next/image";

interface LocaleSwitcherSelectProps {
  defaultValue: string;
  label: string;
}

export default function LocaleSwitcherSelect({
  defaultValue,
  label,
}: LocaleSwitcherSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const [selectedLocale, setSelectedLocale] = useState<LocaleType>(
    defaultValue as LocaleType,
  );
  function onSelectChange(nextLocale: LocaleType) {
    setSelectedLocale(nextLocale);
    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: nextLocale as Locale },
    );
  }

  return (
    <Select value={selectedLocale} onValueChange={onSelectChange}>
      <SelectTrigger
        className="w-[130px] h-10 border border-gray-300 bg-white rounded-md px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
        aria-label={label}
      >
        <span className="flex items-center gap-2">
          <Image
            src={`https://flagcdn.com/24x18/${localeMeta[selectedLocale].country}.png`}
            alt=""
            width={24}
            height={18}
          />
          <span className="text-sm">{localeMeta[selectedLocale].label}</span>
        </span>
      </SelectTrigger>

      <SelectContent>
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            <div className="flex items-center gap-2">
              <Image
                src={`https://flagcdn.com/24x18/${localeMeta[locale].country}.png`}
                alt=""
                width={24}
                height={18}
              />
              <span className="text-sm">{localeMeta[locale].label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
