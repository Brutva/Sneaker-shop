import { Routes, Route } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/HomePage/HomePage';
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { CatalogPage } from './pages/CatalogPage/CatalogPage';
import { StoresPage } from './pages/StoresPage/StoresPage';
import { useEffect, useState } from "react";
import { ProductPage } from './pages/ProductPage/ProductPage';
import axios from "axios";

function App() {
  const [cart, setCart] = useState([]);

  const removeFromCart = async (id) => {
    setCart(cart.filter((item) => item.id !== id));
    await axios.delete(`/api/cart-items/${id}`);

    onCartChanged();
  };

  const reloadCart = async () => {
    const response = await axios.get("/api/cart-items?expand=product");
    setCart(response.data);
  };

  useEffect(() => {
    reloadCart();
  }, []);

  const changeQty = async (id, delta) => {
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    const nextQty = Math.max(1, item.quantity + delta);

    await axios.put(`/api/cart-items/${id}`, { quantity: nextQty });
    await reloadCart();
  };



  return (
    <Routes>
      <Route path='/' element={<HomePage cart={cart} />} />
      <Route 
        path='/checkout' 
        element={<CheckoutPage 
                  cart={cart} 
                  onCartChanged={reloadCart} 
                  removeFromCart={removeFromCart}
                  changeQty={changeQty} />} />
      <Route path='/favorites' element={<FavoritesPage cart={cart} />} />
      <Route path='/catalog' element={<CatalogPage cart={cart}/>} />
      <Route path='/stores' element={<StoresPage cart={cart} />} />
      <Route path="/product/:productId" element={<ProductPage cart={cart} onCartChanged={reloadCart} />} />
    </Routes>
  );
}

export default App;
