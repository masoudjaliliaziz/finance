import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };
  return (
    <button
      className="text-sm p3 rounded-full fixed top-3 right-3  border-2 border-accent  bg-base-300 text-primary-content hover:bg-base-200 transition-colors w-8 h-8 flex items-center justify-center"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? "🌞 " : "🌙 "}
    </button>
  );
};

export default ThemeToggle;
