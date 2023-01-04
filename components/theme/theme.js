import { createContext } from "react";
import "../theme/theme.css"

export const themes = {
    dark: "",
    light: "white-content",
};

export const ThemeContext = createContext({
    theme: themes.dark,
    changeTheme: () => { },
});