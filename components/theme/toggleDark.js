import React from 'react';
import "../theme/theme.css"

export default function ToggleDark(props) {
  return (
    <div>
      Dark Mode
      <div className="wrapper">
        <label className="switch">
          <input
            type="checkbox"
            id="checkbox-toggle"
            onClick={() => {
              props.toggleDark();
            }}
          />
          <span className="slider">
            
          </span>
          <span className="wave"> </span>
        
         
        </label>
      </div>

    </div>
  );
}