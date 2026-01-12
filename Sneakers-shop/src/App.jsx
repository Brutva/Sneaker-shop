import { Routes, Route } from 'react-router'
import './App.css'
import { HomePage } from './pages/HomePage/HomePage'
import { CheckoutPage } from './pages/CheckoutPage/CheckoutPage'
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage'
import { CatalogPage } from './pages/CatalogPage/CatalogPage'
import { StoresPage } from './pages/StoresPage/StoresPage'
import { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchAppData = async () => {
      const response = await axios.get("/api/cart-items?expand=product");
      setCart(response.data);
    }
    fetchAppData()
  }, [])

  return (
    <Routes>
      <Route path='/' element={<HomePage cart={cart} />} />
      <Route path='/checkout' element={<CheckoutPage cart={cart} />} />
      <Route path='/favorites' element={<FavoritesPage cart={cart} />} />
      <Route path='/catalog' element={<CatalogPage cart={cart} />} />
      <Route path='/stores' element={<StoresPage cart={cart} />} />
    </Routes>
  )
}

export default App
