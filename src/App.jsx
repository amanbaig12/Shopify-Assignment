import { useState } from "react";
import { Route, Routes } from 'react-router-dom';
import "./App.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Cart from "./pages/Cart";


function App() {
  return (
    <>
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
  <Navbar />
        <Routes>
          <Route path="/" element={<Collection />} />
          <Route path="/collection" element={<Collection />} />
           <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
        </Routes> 
        <Footer />
    </div>
 
  
    </>
  );
}

export default App;
