import React, { useState } from 'react';
import { ThemeContext,themes } from './theme';
import ToggleDark from './toggleDark';

const Toggle = () =>{
const[darkMode,setDarkMode] = useState(true);

    return(
        <ThemeContext.Consumer>
        {({ changeTheme }) => (
          <ToggleDark
            toggleDark={() => {
              setDarkMode(!darkMode);
              changeTheme(darkMode ? themes.light : themes.dark);
            }}
          />
        )}
      </ThemeContext.Consumer>
    )
}

export default Toggle;
