import { useState, useEffect } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Add transition styles to root element for smooth theme changes
    root.style.transition = "background-color 300ms ease-in-out, color 300ms ease-in-out";
    
    // Handle light/dark mode
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Add global transition styles for all elements
    const styleId = "theme-transition-styles";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      styleElement.textContent = `
        * {
          transition: background-color 300ms ease-in-out, 
                      color 300ms ease-in-out, 
                      border-color 300ms ease-in-out,
                      box-shadow 300ms ease-in-out;
        }
        
        /* Preserve existing transitions for specific properties */
        *[class*="duration-"],
        *[class*="transition-"] {
          transition: all 300ms ease-in-out;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
};
