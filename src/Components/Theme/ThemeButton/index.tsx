import React from "react";
import "./styles.scss";

export const ThemeButton: React.FC<Props> = props => {
  return (
    <button
      className="theme-buttons"
      onClick={() => props.onThemeChange(props.theme)}
    >
      <div
        className="theme-colors"
        style={{ background: props.topBackground }}
      ></div>
      <div
        className="theme-colors"
        style={{ background: props.bottomBackground }}
      ></div>
    </button>
  );
};

interface Props {
  topBackground: string;
  bottomBackground: string;
  onThemeChange: Function;
  theme: string;
}
