window.onload = event => {
    const toggleThemeButton = document.createElement("button");
    toggleThemeButton.id = "toggle-theme-button";
    toggleThemeButton.className = "theme-toggle-btn";
    document.body.append(toggleThemeButton);

    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const preferredTheme = prefersDarkMode ? "dark" : "light";
    const storedTheme = localStorage.getItem("color-theme") || preferredTheme;
    setMode(storedTheme);

    // Add a listener that updates the website color scheme if the browser's theme changes.
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const newColorScheme = event.matches ? "dark" : "light";
        setMode(newColorScheme);
    });

    // Add a listener for the toggle theme button.
    toggleThemeButton.addEventListener("click", () => {
        if (document.documentElement.className === "light") {
            setMode("dark");
        } else {
            setMode("light");
        }
    });
};

function setMode(mode) {
    document.documentElement.className = mode;
    const toggleButton = document.getElementById("toggle-theme-button");
    if (mode === "light") {
        toggleButton.innerText = "Dark Mode";
    } else {
        toggleButton.innerText = "Light Mode";
    }
    localStorage.setItem("color-theme", mode);
}