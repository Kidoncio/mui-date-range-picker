import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { DateRangePicker } from "./components/DateRangePicker";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider as MaterialThemeProvider,
} from "@mui/material/styles";

export const materialTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: "light",
    },
    typography: {
      fontSize: 14,
    },
  })
);

function App() {
  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <MaterialThemeProvider theme={materialTheme}>
        <DateRangePicker />
      </MaterialThemeProvider>
    </div>
  );
}

export default App;
