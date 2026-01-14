import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import '../../normalize/adaptive.css';
import './FavoritesPage.css'
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { formatMoney } from "../../utils/money";

export function FavoritesPage({ cart, products }) {

    const [favoriteProducts, setFavoriteProducts] = useState([])

    useEffect(() => {
        const getFavoriteData = async () => {
            const response = await axios.get("/api/favorites?expand=product");
            setFavoriteProducts(response.data)
        }
        getFavoriteData()
    }, []);

    return (
        <div> 
            <Header cart={cart} />
            <main className="page">
                <div className="container">
                    <h1 className="page__title">My Favorites</h1>
                    <p className="page__sub">2 saved sneakers</p>
                    <div className="grid-products" style={{ marginTop: "18px" }}>
                        {favoriteProducts.map((favoriteProduct) => {
                            return (
                                <article className="product-card" key={favoriteProduct.productId}>
                                    <a href="product.html" className="product-card__media">
                                        <img className="product-card__img" src={favoriteProduct.product.image} alt="Sneaker" />
                                        <div className="product-card__actions">
                                            <button className="icon-btn icon-btn--danger" type="button">♥</button>
                                        </div>
                                        <div className="product-card__badge badge">🛍 <span>{favoriteProduct.product.offers} offers</span></div>
                                    </a>
                                    <div className="product-card__body">
                                        <div className="kicker">{favoriteProduct.product.brand}</div>
                                        <div className="product-card__name line-clamp-2">{favoriteProduct.product.name}</div>
                                        <div className="rating">
                                            <span className="rating__stars" style={{ "--rating": 4.6 }}></span>
                                            <span className="rating__value">{favoriteProduct.product.rating.stars}</span>
                                            <span className="rating__count">({favoriteProduct.product.rating.count})</span>
                                        </div>
                                        <div className="product-card__footer">
                                            <span className="price price--md price--primary"><span
                                                className="price__prefix">from</span>{formatMoney(favoriteProduct.product.priceCents*10)}</span>
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                    <div style={{ height: "60px" }}></div>
                </div>
            </main>
            <Footer />
        </div>
    )
}