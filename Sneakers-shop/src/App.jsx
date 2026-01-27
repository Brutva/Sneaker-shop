import { Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage/HomePage";
import { CheckoutPage } from "./pages/CheckoutPage/CheckoutPage";
import { FavoritesPage } from "./pages/FavoritesPage/FavoritesPage";
import { CatalogPage } from "./pages/CatalogPage/CatalogPage";
import { StoresPage } from "./pages/StoresPage/StoresPage";
import { ProductPage } from "./pages/ProductPage/ProductPage";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [cart, setCart] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState(null);

  const refreshCart = async () => {
    const [cartRes, summaryRes] = await Promise.all([
      axios.get("/api/cart-items?expand=product"), // ВАЖНО: product (не products)
      axios.get("/api/payment-summary"),
    ]);

    setCart(cartRes.data);
    setPaymentSummary(summaryRes.data);
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const removeFromCart = async (id) => {
    await axios.delete(`/api/cart-items/${id}`);
    await refreshCart();
  };

  const changeQty = async (id, delta) => {
    const item = cart.find((x) => x.id === id);
    if (!item) return;

    const nextQty = Math.min(10, Math.max(1, item.quantity + delta));
    await axios.put(`/api/cart-items/${id}`, { quantity: nextQty });
    await refreshCart();
  };

  const changeDelivery = async (cartItemId, deliveryOptionId) => {
    await axios.put(`/api/cart-items/${cartItemId}`, { deliveryOptionId });
    await refreshCart();
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage cart={cart} />} />
      <Route
        path="/checkout"
        element={
          <CheckoutPage
            cart={cart}
            paymentSummary={paymentSummary}
            removeFromCart={removeFromCart}
            changeQty={changeQty}
            changeDelivery={changeDelivery}
          />
        }
      />
      <Route path="/favorites" element={<FavoritesPage cart={cart} />} />
      <Route path="/catalog" element={<CatalogPage cart={cart} />} />
      <Route path="/stores" element={<StoresPage cart={cart} />} />
      <Route
        path="/product/:productId"
        element={<ProductPage cart={cart} onCartChanged={refreshCart} />}
      />
    </Routes>
  );
}

export default App;