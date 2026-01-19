import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import './StoresPage.css';
import '../../normalize/adaptive.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

export function StoresPage({ cart }) {

    const [stores, setStores] = useState([]);

    useEffect(() => {
        const getStoreData = async () => {
            try {
                const response = await axios.get("/api/stores?expand=stats");
                setStores(response.data);
            } catch (err) {
                console.log("не удалось загрузить магазины", err);
            }
        };
        getStoreData()
    })

    return (
        <div>
            <Header cart={cart} />
            <main className="page">
                <div className="container">
                    <h1 className="page__title">All Stores</h1>
                    <p className="page__sub">{stores.length} verified partner stores</p>

                    <div className="products-grid" style={{ marginTop: "18px" }}>
                        {stores.map((store) => {
                            return (
                                <a key={store.id} className="product-card underline" href="store.html" style={{ padding: "16px" }}>
                                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                        <div
                                            style={{ width: "64px", height: "64px", borderRadius: "16px", overflow: "hidden", background: "hsl(var(--secondary))" }}>
                                            <img src={store.logo} style={{ width: "64px", height: "64px" }} alt="" />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: 900, fontSize: "18px" }} className="underline">{store.name}</div>
                                            <div className="rating underline">
                                                <span className="rating__stars underline" style={{ "--rating": 4.7 }}></span>
                                                <span className="rating__value">{store.rating.stars}</span>
                                                <span className="rating__count">({((store.rating.count)/1000).toFixed(3)})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="muted line-clamp-2" style={{ marginTop: "10px" }}>
                                        {store.description}
                                    </p>

                                    <div
                                        style={{ marginTop: "12px", paddingTop: "12px", borderYop: "1px solid hsl(var(--border)/.6)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <span className="muted underline" style={{ fontWeight: 800 }}>📦 {store.catalogCount} products</span>
                                        <span style={{ color: "hsl(var(--primary))", fontWeight: 900 }}>View store →</span>
                                    </div>
                                </a>
                            )
                        })}

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}