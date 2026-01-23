import './CatalogPage.css'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ProductsGrid } from './ProductsGrig';
import axios from "axios";
import { useEffect, useState } from "react";

export function CatalogPage({cart}) {
      
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getHomeData = async () => {
            try {
                const response = await axios.get("/api/products");
                setProducts(response.data);
            } catch (err) {
                console.error("Не удалось загрузить товары", err);
            }
        };
        getHomeData();
    }, []);

    return (
        <div>
            <Header cart={cart}/>
            <main className="page">
                <div className="container">
                    <h1 className="page__title">All Sneakers</h1>
                    <p className="page__sub">128 products found</p>

                    <div className="search-layout">
                        <aside className="sidebar">
                            <div className="card filters">
                                <div className="filters__head">
                                    <div className="filters__title">Filters</div>
                                    <button className="filters__clear" type="button">Clear</button>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Brand</div>
                                    </div>
                                    <label className="field"><input type="checkbox"/> Nike</label>
                                    <label className="field"><input type="checkbox"/> Adidas</label>
                                    <label className="field"><input type="checkbox"/> New Balance</label>
                                    <label className="field"><input type="checkbox"/> Puma</label>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Sizes (EU)</div>
                                    </div>
                                    <label className="field"><input type="checkbox"/> 41</label>
                                    <label className="field"><input type="checkbox"/> 42</label>
                                    <label className="field"><input type="checkbox"/> 43</label>
                                    <label className="field"><input type="checkbox"/> 44</label>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Price</div>
                                        <div className="muted" style={{fontWight:800}}>$0 — $500</div>
                                    </div>
                                    <div className="muted" style={{fontSize:"13px"}}>(range slider placeholder)</div>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Availability</div>
                                    </div>
                                    <label className="field"><input type="checkbox"/> In stock only</label>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Delivery Speed</div>
                                    </div>
                                    <label className="field"><input type="radio" name="delivery"/> Any</label>
                                    <label className="field"><input type="radio" name="delivery"/> Within 2 days</label>
                                    <label className="field"><input type="radio" name="delivery"/> Within 5 days</label>
                                    <label className="field"><input type="radio" name="delivery"/> Within 7 days</label>
                                </div>
                            </div>
                        </aside>

                        <section style={{flex:1, minWidth:0}}>
                            <div className="controls">
                                <div className="controls__left">
                                    <button className="btn btn--outline" type="button">Filters</button>
                                </div>

                                <div className="controls__right">
                                    <span className="muted" style={{fontSize:"14px", fontWeight:700}}>Sort by:</span>
                                    <select className="select">
                                        <option>Lowest Price</option>
                                        <option>Highest Price</option>
                                        <option>Best Rating</option>
                                        <option>Most Offers</option>
                                        <option>Newest</option>
                                    </select>
                                </div>
                            </div>

                            <ProductsGrid products={products}/>

                            <div style={{margin: "26px 0 60px", textAlign:"center"}}>
                                <button className="btn btn--outline btn--lg" type="button">Load More</button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}