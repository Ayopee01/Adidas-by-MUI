import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Component
import Navbar from './component/Navbar.jsx';
import Hero from './component/Hero.jsx';
import Product from './component/Product.jsx';
import ProductDetail from './component/ProductDetail';
import Contact from './component/Contact.jsx';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Product />
            <Contact />
          </>
        } />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </>
  );
};

export default App;
