import axios from "axios";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import "./HomePage.css";
import '../../normalize/adaptive.css'
import { useEffect, useState } from "react";
import { ProductsGrid } from "./ProductsGrid";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";

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
            <HeroSection />
            <FeaturesSection />
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