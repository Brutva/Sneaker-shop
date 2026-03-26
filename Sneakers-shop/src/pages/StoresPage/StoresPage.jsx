import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import './StoresPage.css';
import '../../normalize/adaptive.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useI18n } from '../../i18n.jsx';

export function StoresPage({ cart }) {
    const [stores, setStores] = useState([]);
    const { t } = useI18n();

    useEffect(() => {
        const getStoreData = async () => {
            try {
                const response = await axios.get('/api/stores?expand=stats');
                setStores(response.data);
            } catch (err) {
                console.log('не удалось загрузить магазины', err);
            }
        };
        getStoreData();
    }, []);

    return (
        <div>
            <Header cart={cart} />
            <main className="page">
                <div className="container">
                    <h1 className="page__title">{t('allStores')}</h1>
                    <p className="page__sub">{t('allPartnerStores', { count: stores.length })}</p>

                    <div className="products-grid">
                        {stores.map((store) => {
                            return (
                                <a key={store.id} className="product-card underline store-card" href="store.html">
                                    <div className="store-card__head">
                                        <div className="store-card__logo">
                                            <img src={store.logo} alt="" />
                                        </div>
                                        <div className="store-card__body">
                                            <div className="underline store-card__name">{store.name}</div>
                                            <div className="rating underline">
                                                <span className="rating__stars underline" style={{ '--rating': 4.7 }}></span>
                                                <span className="rating__value">{store.rating.stars}</span>
                                                <span className="rating__count">({((store.rating.count) / 1000).toFixed(3)})</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="muted line-clamp-2" style={{ marginTop: '10px' }}>
                                        {store.description}
                                    </p>

                                    <div className="store-card__footer">
                                        <span className="muted underline" style={{ fontWeight: 800 }}>{t('productsAmount', { count: store.catalogCount })}</span>
                                        <span style={{ color: 'hsl(var(--primary))', fontWeight: 900 }}>{t('viewStore')}</span>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
