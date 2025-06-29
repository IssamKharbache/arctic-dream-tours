import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import {} from "react-dom";
import { MoonIcon, Sun } from "lucide-react";
const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

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
