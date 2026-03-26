import './HomePage.css';
import '../../normalize/adaptive.css';
import { Header } from '../../components/Header';
import { HeroSection } from './HeroSection';
import { FeaturesSection } from './FeaturesSection';
import { ProductsGrid } from './ProductsGrid';
import { Footer } from '../../components/Footer';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useI18n } from '../../i18n.jsx';

export function HomePage({ cart }) {
    const [products, setProducts] = useState([]);
    const { t } = useI18n();

    useEffect(() => {
        const getHomeData = async () => {
            try {
                const response = await axios.get('/api/products', { params: { limit: 4 } });
                setProducts(response.data);
            } catch (err) {
                console.error('Не удалось загрузить товары', err);
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
                        <h2 className="section__title">{t('trendingNow')}</h2>
                        <p className="section__desc">{t('handPicked')}</p>
                        <ProductsGrid products={products} />
                    </div>
                </section>

                <section className="cta">
                    <div className="container" style={{ textAlign: 'center' }}>
                        <h2 className="cta__title">{t('readyCompare')}</h2>
                        <p className="cta__desc">{t('readyCompareText')}</p>
                        <a className="cta__btn" href="/catalog">{t('startComparing')}</a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
