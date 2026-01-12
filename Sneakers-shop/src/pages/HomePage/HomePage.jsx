import axios from "axios";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import "./HomePage.css";
import '../../normalize/adaptive.css'
import { useEffect, useState } from "react";
import { ProductsGrid } from "./ProductsGrid";

export function HomePage({ cart }) {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getHomeData = async () => {
            const response = await axios.get("/api/products");
            setProducts(response.data)
                .catch((err) => console.error("Не удалость загрузить товары", err))
        }
        getHomeData()
    }, []);


    return (
        <div>
            <Header cart={cart} />
            <section className="hero">
                <div className="container hero__inner animate-fade-in">
                    <h1 className="hero__title">Find the Best <span>Sneaker Prices</span></h1>
                    <p className="hero__subtitle">
                        Compare prices from trusted stores. Save money on your favorite kicks.
                    </p>

                    <div className="hero__search">
                        <form className="searchbar" action="search.html" method="get">
                            <svg className="searchbar__icon" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" fill="none" stroke="currentColor"
                                    strokeWidth="2" />
                                <path d="M16.5 16.5 21 21" fill="none" stroke="currentColor" strokeWidth="2"
                                    strokeLinecap="round" />
                            </svg>
                            <input className="searchbar__input" name="q" type="text"
                                placeholder="Search sneakers by model, brand, or SKU..." />
                            <button className="searchbar__clear" type="button" aria-label="Clear">✕</button>
                        </form>
                    </div>

                    <div className="chips">
                        <a className="chip" href="search.html?q=Nike">Nike</a>
                        <a className="chip" href="search.html?q=Adidas">Adidas</a>
                        <a className="chip" href="search.html?q=New%20Balance">New Balance</a>
                        <a className="chip" href="search.html?q=Puma">Puma</a>
                        <a className="chip" href="search.html?q=Jordan">Jordan</a>
                        <a className="chip" href="search.html?q=ASICS">ASICS</a>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <div className="features__grid">
                        <div className="feature">
                            <div className="feature__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M4 19V5M4 19h16M8 15l3-3 3 2 5-6" />
                                </svg>
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>Best Prices</h3>
                                <p className="muted">Compare prices across multiple stores to find the best deal.</p>
                            </div>
                        </div>

                        <div className="feature">
                            <div className="feature__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z" />
                                </svg>
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>Trusted Stores</h3>
                                <p className="muted">All our partner stores are verified and rated by real customers.</p>
                            </div>
                        </div>

                        <div className="feature">
                            <div className="feature__icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <path d="M13 2 3 14h8l-1 8 11-14h-8l0-6Z" />
                                </svg>
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>Real-time Updates</h3>
                                <p className="muted">Prices and availability updated in real-time from all stores.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section__head">
                        <div>
                            <h2 className="section__title">Trending Now</h2>
                            <p className="section__desc">Most searched sneakers this week</p>
                        </div>
                        <a href="/catalog" className="btn btn--ghost" style={{ color: "hsl(var(--primary))", fontWeight: 900 }}>View
                            all →</a>
                    </div>

                    <ProductsGrid products={products} />
                </div>
            </section>

            <section className="cta">
                <div className="container" style={{ textAlign: "center" }}>
                    <h2 className="cta__title">Never Overpay for Sneakers Again</h2>
                    <p className="cta__text">Join thousands of sneaker enthusiasts who save money every day with SneakerCompare.</p>
                    <a className="cta__btn" href="search.html">Start Comparing →</a>
                </div>
            </section>
            <Footer />
        </div>
    )
}