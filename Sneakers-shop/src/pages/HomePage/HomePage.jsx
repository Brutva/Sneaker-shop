import "./HomePage.css";
import "../../normalize/adaptive.css";
import { Header } from "../../components/Header";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { ProductsGrid } from "./ProductsGrid";
import { Footer } from "../../components/Footer";
import axios from "axios";
import { useEffect, useState } from "react";

export function HomePage({ cart }) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getHomeData = async () => {
            try {
                const response = await axios.get("/api/products", { params: { limit: 12 } });
                setProducts(response.data);
            } catch (err) {
                console.error("Не удалось загрузить товары", err);
            }
        };

        getHomeData();
    }, []);

    return (
        <div>
            <Header cart={cart} />

            <main>
                <HeroSection />
                <FeaturesSection />

                <section className="section">
                    <div className="container">
                        <h2 className="section__title">Trending now</h2>
                        <p className="section__desc">Hand-picked for you</p>
                        <ProductsGrid products={products} />
                    </div>
                </section>

                <section className="cta">
                    <div className="container" style={{ textAlign: "center" }}>
                        <h2 className="cta__title">Ready to compare prices?</h2>
                        <p className="cta__desc">Browse the full catalog and filter by your favorites.</p>
                        <a className="cta__btn" href="/catalog">Start Comparing →</a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
