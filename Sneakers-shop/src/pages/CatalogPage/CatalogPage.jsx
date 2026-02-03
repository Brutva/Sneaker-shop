import './CatalogPage.css'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { ProductsGrid } from './ProductsGrig';
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function CatalogPage({ cart }) {

    const [searchParams, setSearchParams] = useSearchParams();

    const urlQuery = (searchParams.get('q') || searchParams.get('search') || '').trim();
    const sort = (searchParams.get("sort") || "default").trim();

    const BRAND_OPTIONS = ["Nike", "Adidas", "Jordan", "New Balance", "Vans", "Anta", "LiNing"];

    const TYPE_OPTIONS = [
        { value: "lifestyle", label: "lifestyle" },
        { value: "running", label: "running" },
        { value: "basketball", label: "basketball" },
    ];

    const [products, setProducts] = useState([]);

    const [selectedBrands, setSelectedBrands] = useState(new Set());
    const [selectedTypes, setSelectedTypes] = useState(new Set());

    const selectedBrandsKey = [...selectedBrands].sort().join(',');
    const selectedTypesKey = [...selectedTypes].sort().join(',');

    useEffect(() => {
        const load = async () => {
            try {
                const params = {};
                if (urlQuery) params.search = urlQuery;
                if (selectedBrands.size) params.brand = [...selectedBrands].join(',');
                if (selectedTypes.size) params.type = [...selectedTypes].join(',');
                if (sort !== "default") params.sort = sort;

                const response = await axios.get("/api/products", { params });
                setProducts(response.data);
            } catch (err) {
                console.error("Не удалось загрузить товары", err);
            }
        };

        load();
    }, [urlQuery, sort, selectedBrandsKey, selectedTypesKey]);

    const toggleBrand = (brand) => {
        setSelectedBrands(prev => {
            const next = new Set(prev);
            if (next.has(brand)) next.delete(brand);
            else next.add(brand);
            return next;
        });
    };

    const toggleType = (type) => {
        setSelectedTypes(prev => {
            const next = new Set(prev);
            if (next.has(type)) next.delete(type);
            else next.add(type);
            return next;
        });
    };

    const clearFilters = () => {
        setSelectedBrands(new Set());
        setSelectedTypes(new Set());
        setSearchParams({});
    };

    const onChangeSort = (e) => {
        const nextSort = e.target.value;
        const next = {};
        if (nextSort !== "default") next.sort = nextSort;
        if (urlQuery) next.search = urlQuery;
        setSearchParams(next);
    };

    const onSearch = (e) => {
        e.preventDefault();
        const value = (e.target.elements.search?.value || "").trim();
        const next = {};
        if (sort !== "default") next.sort = sort;
        if (value) next.search = value;
        setSearchParams(next);
    };

    return (
        <div>
            <Header cart={cart} />
            <main className="page">
                <div className="container">
                    <h1 className="page__title">All Sneakers</h1>
                    <p className="page__sub">{products.length} products found</p>

                    <div className="search-layout">
                        <aside className="sidebar">
                            <div className="card filters">
                                <div className="filters__head">
                                    <div className="filters__title">Filters</div>
                                    <button
                                        className="filters__clear"
                                        type="button"
                                        onClick={clearFilters}
                                    >
                                        Clear
                                    </button>
                                </div>

                                

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Brand</div>
                                    </div>
                                    {BRAND_OPTIONS.map((brand) => (
                                        <label key={brand} className="field">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.has(brand)}
                                                onChange={() => toggleBrand(brand)}
                                            />{" "}
                                            {brand}
                                        </label>
                                    ))}
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Type</div>
                                    </div>
                                    {TYPE_OPTIONS.map((t) => (
                                        <label key={t.value} className="field">
                                            <input
                                                type="checkbox"
                                                checked={selectedTypes.has(t.value)}
                                                onChange={() => toggleType(t.value)}
                                            />{" "}
                                            {t.label}
                                        </label>
                                    ))}
                                </div>

                            </div>
                        </aside>

                        <section style={{ flex: 1, minWidth: 0 }}>
                            <div className="controls">
                                <div className="controls__left">
                                    <button className="btn btn--outline" type="button">Filters</button>
                                </div>

                                <div className="controls__right">
                                    <span className="muted" style={{ fontSize: "14px", fontWeight: 700 }}>Sort by:</span>

                                    <select className="select" value={sort} onChange={onChangeSort}>
                                        <option value="default">Default</option>
                                        <option value="price_asc">Lowest Price</option>
                                        <option value="price_desc">Highest Price</option>
                                        <option value="rating_desc">Best Rating</option>
                                        <option value="offers_desc">Most Offers</option>
                                        <option value="name_asc">Name A-Z</option>
                                        <option value="name_desc">Name Z-A</option>
                                    </select>
                                </div>
                            </div>

                            <ProductsGrid products={products} />

                            <div style={{ margin: "26px 0 60px", textAlign: "center" }}>
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
