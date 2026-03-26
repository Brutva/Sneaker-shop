import axios from 'axios';
import { formatMoney } from '../../utils/money';
import { useI18n } from '../../i18n.jsx';

export function ProductsGrid({ products }) {
  const { t } = useI18n();

  return (
    <div className="grid-products">
      {products.map((product) => {
        const offersText = product.offers === 1
          ? t('offerCount', { count: product.offers })
          : t('offersCount', { count: product.offers });

        return (
          <div className="containerProducts" key={product.id}>
            <article className="product-card">
              <a href={`/product/${product.id}`} className="product-card__media">
                <img className="product-card__img" src={product.image} alt={t('sneakerImage')} />
                <div className="product-card__badge badge">
                  <span>{offersText}</span>
                </div>
              </a>
              <div className="product-card__body">
                <div className="productInfBtns">
                  <div className="product-inf">
                    <div className="kicker">{product.brand}</div>
                    <div className="product-card__name line-clamp-2">{product.name}</div>
                    <div className="rating">
                      <span className="rating__stars" style={{ '--rating': product.rating.stars }}></span>
                      <span className="rating__value">{product.rating.stars}</span>
                      <span className="rating__count">({product.rating.count})</span>
                    </div>
                  </div>
                  <div className="btns">
                    <button
                      className="icon-btn icon-btn--danger favoriteBtn"
                      type="button"
                      aria-label={t('favorite')}
                      onClick={async () => {
                        await axios.post('/api/favorites', {
                          productId: product.id,
                        });
                      }}>
                      ♥
                    </button>
                  </div>
                </div>
                <div className="product-card__footer">
                  <span className="price price--md price--primary"><span className="price__prefix">{t('from')}</span>{formatMoney(product.priceCents)}</span>
                </div>
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
}
