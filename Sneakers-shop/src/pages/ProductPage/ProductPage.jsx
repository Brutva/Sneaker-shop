import './ProductPage.css';
import '../../normalize/adaptive.css';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { formatMoney } from '../../utils/money';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useI18n } from '../../i18n.jsx';

export function ProductPage({ cart, onCartChanged }) {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const pricesRef = useRef(null);
  const { t } = useI18n();

  const scrollToPrice = () => {
    pricesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const load = async () => {
      const response = await axios.get(`/api/products/${productId}?expand=all`);
      setProduct(response.data);
      setActiveImg(0);
    };
    load();
  }, [productId]);

  if (!product) {
    return (
      <div>
        <Header cart={cart} />
        <main className="page">
          <div className="container">
            <p>{t('loading')}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = [product.image, product.image2, product.image3, product.image4].filter(Boolean);
  while (images.length < 4) images.push(product.image);
  const offers = product.offersList || [];

  function getStoreName(offer) {
    if (offer.store && offer.store.name) return offer.store.name;
    if (offer.storeId) return offer.storeId;
    return t('stores');
  }

  return (
    <div>
      <Header cart={cart} />
      <main className="page">
        <div className="container">
          <div className="breadcrumbs">
            <a className="breadcrumbs__link" href="/catalog">{t('backToCatalog')}</a>
            <span className="breadcrumbs__sep">/</span>
            <span className="breadcrumbs__current">{product.brand}</span>
          </div>

          <div className="product-top">
            <section className="card product-gallery">
              <div className="product-gallery__main">
                <img className="product-gallery__img" src={images[activeImg]} alt={product.name} />
                <div className="product-gallery__badge badge">
                  <span>{product.offers === 1 ? t('offerCount', { count: product.offers }) : t('offersCount', { count: product.offers })}</span>
                </div>
              </div>

              <div className="product-gallery__thumbs" aria-label={t('galleryThumbs')}>
                {images.map((img, idx) => (
                  <button key={idx} className={`thumb ${idx === activeImg ? 'is-active' : ''}`} type="button" aria-label={t('thumbnail', { count: idx + 1 })} onClick={() => setActiveImg(idx)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            </section>

            <aside className="card product-summary">
              <div className="kicker">{product.brand}</div>
              <h1 className="product-title">{product.name}</h1>

              <div className="rating product-rating">
                <span className="rating__stars" style={{ '--rating': product.rating.stars }} />
                <span className="rating__value">{product.rating.stars}</span>
                <span className="rating__count">({product.rating.count})</span>
              </div>

              <div className="product-price">
                <span className="price price--xl price--primary">
                  <span className="price__prefix">{t('from')}</span>
                  {formatMoney(product.priceCents)}
                </span>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>{t('pricesMayVary')}</div>
              </div>

              <div className="product-actions">
                <button className="btn btn--primary btn--lg" type="button" onClick={scrollToPrice}>{t('comparePrices')}</button>
                <button
                  className="btn btn--outline btn--lg"
                  type="button"
                  aria-label={t('favorite')}
                  onClick={async () => {
                    await axios.post('/api/favorites/', { productId: product.id });
                  }}
                >
                  ♥ {t('favorite')}
                </button>
              </div>

              <div className="product-meta">
                <div className="meta-row"><div className="meta-label">{t('category')}</div><div className="meta-value">{product.category}</div></div>
                <div className="meta-row"><div className="meta-label">{t('colorway')}</div><div className="meta-value">{product.colorway}</div></div>
                <div className="meta-row"><div className="meta-label">{t('release')}</div><div className="meta-value">{product.releaseDate}</div></div>
              </div>

              <div className="product-sizes">
                <div className="product-sizes__head">
                  <div className="product-sizes__title">{t('sizesEu')}</div>
                  <div className="muted" style={{ fontSize: 13, fontWeight: 700 }}>{t('selectLater')}</div>
                </div>

                <div className="sizes-grid">
                  {product.sizes && product.sizes.map((s) => <button key={s} className="size-btn" type="button">{s}</button>)}
                </div>
                <section className="card about-card">
                  <h2 className="about-title">{t('aboutSneaker')}</h2>
                  <p className="muted about-text">{product.description}</p>
                </section>
              </div>
            </aside>
          </div>

          <section ref={pricesRef} className="card offers-card">
            <div className="offers-head">
              <h2 className="offers-title">{t('priceComparison')}</h2>
              <div className="offers-actions">
                <button className="btn btn--outline" type="button">{t('sortLowestPrice')}</button>
                <button className="btn btn--ghost" type="button">{t('filters')}</button>
              </div>
            </div>

            <div className="offers-table" role="table" aria-label="Offers table">
              <div className="offers-row offers-row--head" role="row">
                <div className="offers-cell" role="columnheader">{t('stores')}</div>
                <div className="offers-cell" role="columnheader">{t('delivery')}</div>
                <div className="offers-cell" role="columnheader">{t('condition')}</div>
                <div className="offers-cell offers-cell--right" role="columnheader">{t('price')}</div>
                <div className="offers-cell offers-cell--right" role="columnheader"></div>
              </div>

              {offers.map((offer) => {
                const store = offer.store ?? { name: getStoreName(offer), logo: null };

                return (
                  <div key={offer.id} className="offers-row" role="row">
                    <div className="offers-cell" role="cell">
                      <div className="store">
                        <div className="store__logo">{store.logo ? <img src={store.logo} alt={store.name} /> : store.name?.[0] || 'S'}</div>
                        <div className="store__meta">
                          <div className="store__name">{store.name}</div>
                          <div className="store__sub">{t('partnerStore')}</div>
                        </div>
                      </div>
                    </div>

                    <div className="offers-cell offers-cell--stack muted" role="cell"><span className="offers-cell__label">{t('delivery')}</span>{offer.deliveryMinDays && offer.deliveryMaxDays ? `${offer.deliveryMinDays}-${offer.deliveryMaxDays} days` : offer.delivery || '2-5 days'}</div>
                    <div className="offers-cell offers-cell--stack" role="cell"><span className="offers-cell__label">{t('condition')}</span><span className="pill">{offer.condition || t('newCondition')}</span></div>
                    <div className="offers-cell offers-cell--stack offers-cell--right" role="cell"><span className="offers-cell__label">{t('price')}</span><span className="price price--md price--primary">{formatMoney(offer.priceCents || 0)}</span></div>
                    <div className="offers-cell offers-cell--stack offers-cell--right" role="cell"><span className="offers-cell__label">Action</span><button
                      className="btn btn--primary"
                      type="button"
                      onClick={async () => {
                        await axios.post('/api/cart-items', { offerId: offer.id, quantity: 1 });
                        onCartChanged();
                      }}
                    >
                      {t('cart')}
                    </button></div>
                  </div>
                );
              })}
            </div>
          </section>

          <div style={{ height: '60px' }} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
