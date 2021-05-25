import React from "react";
import { WbSunny, Brightness2 } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

interface Props {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const DarkModeToggle = ({ darkMode, setDarkMode }: Props) => {
  const icon = darkMode ? <WbSunny /> : <Brightness2 />;

  return (
    <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
      {icon}
    </IconButton>
  );
};

export default DarkModeToggle;