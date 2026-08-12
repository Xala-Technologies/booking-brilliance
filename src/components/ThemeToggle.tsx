import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocation } from "react-router-dom";
import { localeFromPath } from "@/lib/i18n";
import { t } from "@/lib/copy";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const label = t(localeFromPath(useLocation().pathname), "nav.toggleTheme");
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-center h-10 w-10 rounded-sm border border-hairline-strong text-ink hover:bg-paper-deep transition-colors duration-quick ease-editorial"
      aria-label={label}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-normal dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all duration-normal dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{label}</span>
    </button>
  );
};

export default ThemeToggle;
