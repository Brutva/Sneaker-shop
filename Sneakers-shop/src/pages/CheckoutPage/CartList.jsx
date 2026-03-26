import { formatMoney } from '../../utils/money';
import { DeliveryOptions } from './deliveryOptions';
import { useI18n } from '../../i18n.jsx';

export function CartList({ cart, deliveryOptions, removeFromCart, changeQty, changeDelivery }) {
  const { t } = useI18n();

  return (
    <div className="cart-list">
      {cart.map((cartItem) => (
        <div key={cartItem.id}>
          <article className="cart-item">
            <div className="cart-item__mediaCol">
              <div className="cart-item__imgWrap">
                <div className="cart-item__img">
                  <img src={cartItem.product.image} alt="" />
                </div>

                <div className="cart-item__mediaInfo">
                  <span className="cart-item__mediaTag">
                    {(cartItem.product.offers || 1) === 1
                      ? t('offerCount', { count: cartItem.product.offers || 1 })
                      : t('offersCount', { count: cartItem.product.offers || 1 })}
                  </span>
                  <span className="cart-item__mediaTag cart-item__mediaTag--muted">
                    {cartItem.offer?.condition || t('newCondition')}
                  </span>
                </div>
              </div>
            </div>

            <div className="cart-item__body">
              <div className="cart-item__top">
                <div className="cart-item__mainInfo">
                  <div className="kicker">{cartItem.product.brand}</div>
                  <div className="cart-item__name line-clamp-2">{cartItem.product.name}</div>
                  <div className="cart-item__store muted">
                    {t('storeLabel')} {cartItem.offer?.store?.name || cartItem.offer?.storeId || t('partnerStore')}
                  </div>
                </div>

                <div className="cart-item__price">
                  <div className="price price--md price--primary">{formatMoney(cartItem.offer.priceCents)}</div>
                  <div className="muted cart-item__priceNote">{t('item')} 1</div>
                </div>
              </div>

              <div className="cart-item__controls">
                <div className="cart-meta">
                  <label className="cart-meta__field">
                    <span className="cart-meta__label">Size (EU)</span>
                    <select className="select select--sm" defaultValue="42">
                      <option value="41">41</option>
                      <option value="42">42</option>
                      <option value="43">43</option>
                      <option value="44">44</option>
                    </select>
                  </label>

                  <label className="cart-meta__field">
                    <span className="cart-meta__label">{t('qty')}</span>
                    <div className="qty">
                      <button className="qty__btn" type="button" aria-label="Decrease" onClick={() => changeQty(cartItem.id, -1)}>−</button>
                      <input className="qty__input" type="text" value={cartItem.quantity} inputMode="numeric" readOnly />
                      <button className="qty__btn" type="button" aria-label="Increase" onClick={() => changeQty(cartItem.id, +1)}>+</button>
                    </div>
                  </label>
                </div>

                <div className="cart-actions">
                  <button className="btn btn--ghost btn--icon" type="button" title={t('favorite')}>♥</button>
                  <button className="btn btn--ghost btn--icon" type="button" title={t('remove')} onClick={() => removeFromCart(cartItem.id)}>🗑</button>
                </div>
              </div>

              <div className="delivery delivery--wide">
                <div className="delivery__title">{t('delivery')}</div>
                <DeliveryOptions deliveryOptions={deliveryOptions} cartItem={cartItem} changeDelivery={changeDelivery} />
              </div>

              <div className="cart-item__bottom">
                <div className="cart-item__summaryBlock">
                  <div className="cart-item__summaryRow">
                    <span className="muted">{t('price')}</span>
                    <span>{formatMoney(cartItem.offer.priceCents)}</span>
                  </div>
                  <div className="cart-item__summaryRow">
                    <span className="muted">{t('qty')}</span>
                    <span>{cartItem.quantity}</span>
                  </div>
                </div>

                <div className="cart-item__subtotal">
                  <span className="muted" style={{ fontWeight: 800 }}>{t('orderTotal')}</span>
                  <span className="price price--md">{formatMoney(cartItem.offer.priceCents * cartItem.quantity)}</span>
                </div>
              </div>
            </div>
          </article>

          <hr className="hr" style={{ marginTop: '12px' }} />
        </div>
      ))}
    </div>
  );
}
