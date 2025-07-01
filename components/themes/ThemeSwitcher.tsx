import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { MoonIcon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return null;
    return (
        <Button
            variant="outline"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {theme === "dark" || theme === "system" ? <MoonIcon /> : <Sun />}
        </Button>
    );
};

export default ThemeSwitcher;
