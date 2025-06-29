import React, { useState, useMemo, useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Import Component
import Navbar from './component/Navbar.jsx';
import Hero from './component/Hero.jsx';
import Product from './component/Product.jsx';
import ProductDetail from './component/ProductDetail';
import Contact from './component/Contact.jsx';
import DarkModeToggle from "./component/DarkModeToggle";

const App = () => {
  // โหลด darkMode จาก localStorage ถ้ามี
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored ? stored === "true" : false;
  });

  // ทุกครั้งที่ darkMode เปลี่ยน จะบันทึกลง localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const handleToggle = () => setDarkMode((prev) => !prev);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DarkModeToggle darkMode={darkMode} onToggle={handleToggle} /> {/* ปุ่มลอย */}
      <Navbar darkMode={darkMode} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Product />
              <Contact />
            </>
          }
        />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
