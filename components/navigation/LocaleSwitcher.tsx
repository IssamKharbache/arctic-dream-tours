import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";

const LocaleSwitcher = () => {
  const locale: string = useLocale();
  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <LocaleSwitcherSelect defaultValue={locale} label="Select a locale" />
    </div>
  );
};

export default LocaleSwitcher;
