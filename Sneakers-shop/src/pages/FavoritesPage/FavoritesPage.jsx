import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import './FavoritesPage.css';
import '../../normalize/adaptive.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatMoney } from '../../utils/money';
import { useI18n } from '../../i18n.jsx';

export function FavoritesPage({ cart }) {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const { t } = useI18n();

    const loadFavoriteData = async () => {
        const response = await axios.get('/api/favorites?expand=product');
        setFavoriteProducts(response.data);
    };

    useEffect(() => {
        loadFavoriteData();
    }, []);

    const removeFavorite = async (productId) => {
        try {
            await axios.delete(`/api/favorites/${productId}`);
            await loadFavoriteData();
        } catch (e) {
            console.error('Failed to remove favorite', e);
        }
    };

    const products = favoriteProducts.map((f) => f.product).filter(Boolean);

    return (
        <div>
            <Header cart={cart} />
            <main className="page">
                <div className="container">
                    <h1 className="page__title">{t('favoritesTitle')}</h1>
                    <p className="page__sub">
                        {products.length === 1 ? t('savedSneaker', { count: products.length }) : t('savedSneakers', { count: products.length })}
                    </p>

                    <div className="grid-products gridCatalog" style={{ marginTop: '18px' }}>
                        {products.map((product) => (
                            <div className="containerProducts" key={product.id}>
                                <article className="product-card">
                                    <a href={`/product/${product.id}`} className="product-card__media">
                                        <div className="product-card__actions">
                                            <button
                                                className="icon-btn"
                                                type="button"
                                                aria-label={t('removeFromFavorites')}
                                                title={t('remove')}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeFavorite(product.id);
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <img className="product-card__img" src={product.image} alt={product.name} />

                                        <span className="badge">
                                            {product.offers === 1 ? t('offerCount', { count: product.offers }) : t('offersCount', { count: product.offers })}
                                        </span>
                                    </a>

                                    <div className="product-card__body">
                                        <p className="kicker">{product.brand}</p>

                                        <div className="productInfBtns">
                                            <div className="product-inf">
                                                <h3 className="product-card__name">{product.name}</h3>

                                                <div className="rating">
                                                    <span className="rating__stars" style={{ '--rating': product.rating?.stars ?? 0 }} />
                                                    <span className="rating__value">{product.rating?.stars ?? '-'}</span>
                                                    <span className="rating__count">({product.rating?.count ?? 0})</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="product-card__footer">
                                            <span className="price price--md price--primary"><span className="price__prefix">{t('from')}</span>{formatMoney(product.priceCents)}</span>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
