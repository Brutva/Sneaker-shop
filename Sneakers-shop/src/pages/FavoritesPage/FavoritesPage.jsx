import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import '../../normalize/adaptive.css';
import './FavoritesPage.css'
import { ProductsGrid } from "../HomePage/ProductsGrid";

export function FavoritesPage({cart, products}) {
    return (
        <div>
            <Header cart={cart}/>
            <main className="page">
                <div className="container">
                    <h1 className="page__title">My Favorites</h1>
                    <p className="page__sub">2 saved sneakers</p>

                    <div className="grid-products" style={{marginTop: "18px"}}>
                        {}
                        <article className="product-card">
                            <a href="product.html" className="product-card__media">
                                <img className="product-card__img" src="src/public/images/Nike-Air-Max-90-Infrared-2020.jpg" alt="Sneaker"/>
                                    <div className="product-card__actions">
                                        <button className="icon-btn icon-btn--danger" type="button">♥</button>
                                    </div>
                                    <div className="product-card__badge badge">🛍 <span>12 offers</span></div>
                            </a>
                            <div className="product-card__body">
                                <div className="kicker">Nike</div>
                                <div className="product-card__name line-clamp-2">Air Max 90 “Infrared”</div>
                                <div className="rating">
                                    <span className="rating__stars" style={{"--rating":4.6}}></span>
                                    <span className="rating__value">4.6</span>
                                    <span className="rating__count">(1,284)</span>
                                </div>
                                <div className="product-card__footer">
                                    <span className="price price--md price--primary"><span
                                        className="price__prefix">from</span>$149</span>
                                </div>
                            </div>
                        </article>

                        <article className="product-card">
                            <a href="product.html" className="product-card__media">
                                <img className="product-card__img" src="src/public/images/adidas-UltraBoost-1.0-DNA-White-Black-Grey.jpg" alt="Sneaker"/>
                                    <div className="product-card__actions">
                                        <button className="icon-btn icon-btn--danger" type="button">♥</button>
                                    </div>
                                    <div className="product-card__badge badge">🛍 <span>8 offers</span></div>
                            </a>
                            <div className="product-card__body">
                                <div className="kicker">Adidas</div>
                                <div className="product-card__name line-clamp-2">Ultraboost 1.0</div>
                                <div className="rating">
                                    <span className="rating__stars" style={{"--rating":4.3}}></span>
                                    <span className="rating__value">4.3</span>
                                    <span className="rating__count">(642)</span>
                                </div>
                                <div className="product-card__footer">
                                    <span className="price price--md price--primary"><span
                                        className="price__prefix">from</span>$169</span>
                                </div>
                            </div>
                        </article>
                    </div>

                    <div style={{height:"60px"}}></div>
                </div>
            </main>
            <Footer />
        </div>
    )
}