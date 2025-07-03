import React, { useEffect } from "react";
import CurrencyConverter from "./pages/Index";
import { forceDarkMode } from "./forceDarkMode";

const App = () => {
  useEffect(() => {
    forceDarkMode();
  }, []);
  return <CurrencyConverter />;
};

export default App;