import './CatalogPage.css';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { ProductsGrid } from './ProductsGrig';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '../../i18n.jsx';

export function CatalogPage({ cart }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { t } = useI18n();

    const urlQuery = (searchParams.get('q') || searchParams.get('search') || '').trim();
    const sort = (searchParams.get('sort') || 'default').trim();

    const BRAND_OPTIONS = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Vans', 'Anta', 'LiNing'];
    const TYPE_OPTIONS = [
        { value: 'lifestyle', label: t('typeLifestyle') },
        { value: 'running', label: t('typeRunning') },
        { value: 'basketball', label: t('typeBasketball') },
    ];

    const [products, setProducts] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState(new Set());
    const [selectedTypes, setSelectedTypes] = useState(new Set());
    const [filtersOpen, setFiltersOpen] = useState(false);

    const selectedBrandsKey = [...selectedBrands].sort().join(',');
    const selectedTypesKey = [...selectedTypes].sort().join(',');

    const activeFiltersCount = useMemo(
        () => selectedBrands.size + selectedTypes.size,
        [selectedBrandsKey, selectedTypesKey]
    );

    const INITIAL_COUNT = 10;
    const LOAD_STEP = 9;
    const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

    useEffect(() => {
        document.body.style.overflow = filtersOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [filtersOpen]);

    useEffect(() => {
        const load = async () => {
            try {
                const params = {};
                if (urlQuery) params.search = urlQuery;
                if (selectedBrands.size) params.brand = [...selectedBrands].join(',');
                if (selectedTypes.size) params.type = [...selectedTypes].join(',');
                if (sort !== 'default') params.sort = sort;

                const response = await axios.get('/api/products', { params });
                const data = response.data || [];
                setProducts(data);
                setVisibleCount(Math.min(INITIAL_COUNT, data.length));
            } catch (err) {
                console.error('Не удалось загрузить товары', err);
            }
        };

        load();
    }, [urlQuery, sort, selectedBrandsKey, selectedTypesKey]);

    const toggleBrand = (brand) => {
        setSelectedBrands((prev) => {
            const next = new Set(prev);
            if (next.has(brand)) next.delete(brand);
            else next.add(brand);
            return next;
        });
    };

    const toggleType = (type) => {
        setSelectedTypes((prev) => {
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
        if (nextSort !== 'default') next.sort = nextSort;
        if (urlQuery) next.search = urlQuery;
        setSearchParams(next);
    };

    const FiltersContent = ({ onClose }) => (
        <div className="card filters">
            <div className="filters__head">
                <div className="filters__title">{t('filters')}</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button className="filters__clear" type="button" onClick={clearFilters}>{t('clearFilters')}</button>
                    {onClose && (
                        <button className="filters__clear" type="button" onClick={onClose}>{t('close')}</button>
                    )}
                </div>
            </div>

            <div className="filter-section">
                <div className="filter-section__row">
                    <div className="filter-section__label">{t('filterBrand')}</div>
                </div>
                {BRAND_OPTIONS.map((brand) => (
                    <label key={brand} className="field">
                        <input type="checkbox" checked={selectedBrands.has(brand)} onChange={() => toggleBrand(brand)} /> {brand}
                    </label>
                ))}
            </div>

            <div className="filter-section">
                <div className="filter-section__row">
                    <div className="filter-section__label">{t('filterType')}</div>
                </div>
                {TYPE_OPTIONS.map((typeItem) => (
                    <label key={typeItem.value} className="field">
                        <input type="checkbox" checked={selectedTypes.has(typeItem.value)} onChange={() => toggleType(typeItem.value)} /> {typeItem.label}
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <Header cart={cart} />
            <main className="page">
                <div className="container">
                    <h1 className="page__title">{t('allSneakers')}</h1>
                    <p className="page__sub">{t('productsFound', { count: products.length })}</p>

                    <div className="search-layout">
                        <section className="catalog-main">
                            <div className="controls">
                                <div className="controls__left">
                                    <button className="btn btn--outline btn--filters" type="button" onClick={() => setFiltersOpen(true)}>
                                        {t('filters')}
                                        {activeFiltersCount > 0 && <span className="filters-trigger__count">{activeFiltersCount}</span>}
                                    </button>
                                </div>

                                <div className="controls__right">
                                    <span className="muted" style={{ fontSize: '14px', fontWeight: 700 }}>{t('sortBy')}</span>

                                    <select className="select" value={sort} onChange={onChangeSort}>
                                        <option value="default">{t('defaultSort')}</option>
                                        <option value="price_asc">{t('lowestPrice')}</option>
                                        <option value="price_desc">{t('highestPrice')}</option>
                                        <option value="rating_desc">{t('bestRating')}</option>
                                        <option value="offers_desc">{t('mostOffers')}</option>
                                        <option value="name_asc">{t('nameAZ')}</option>
                                        <option value="name_desc">{t('nameZA')}</option>
                                    </select>
                                </div>
                            </div>

                            <ProductsGrid products={products.slice(0, visibleCount)} />

                            <div style={{ margin: '26px 0 60px', textAlign: 'center' }}>
                                {visibleCount < products.length && (
                                    <div style={{ margin: '26px 0 60px', textAlign: 'center' }}>
                                        <button
                                            className="btn btn--outline btn--lg"
                                            type="button"
                                            onClick={() => setVisibleCount((v) => Math.min(v + LOAD_STEP, products.length))}
                                        >
                                            {t('showMore')} ({Math.min(LOAD_STEP, products.length - visibleCount)})
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {filtersOpen && (
                <div className="mobile-filters__backdrop" onClick={() => setFiltersOpen(false)}>
                    <div className="mobile-filters" onClick={(e) => e.stopPropagation()}>
                        <FiltersContent onClose={() => setFiltersOpen(false)} />
                        <div className="mobile-filters__footer">
                            <button className="btn btn--primary btn--lg" type="button" onClick={() => setFiltersOpen(false)}>
                                {t('applyFilters')} ({products.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
