"use client";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Locale } from "next-intl";
import { useParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { routing, localeMeta, LocaleType } from "@/i18n/routing";
import { useState } from "react";

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
                className="w-[120px] h-8 border-none bg-transparent focus:ring-0 focus:ring-offset-0"
                aria-label={label}
            >
                <SelectValue
                    placeholder={`${localeMeta[selectedLocale].flag} ${localeMeta[selectedLocale].label}`}
                />
            </SelectTrigger>

            <SelectContent>
                {routing.locales.map((locale) => (
                    <SelectItem key={locale} value={locale}>
                        {localeMeta[locale].flag} {localeMeta[locale].label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
