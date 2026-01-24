import axios from "axios";
import { formatMoney } from "../../utils/money";
import { DeliveryOptions } from "./deliveryOptions";

export function CartList({ cart, deliveryOptions, removeFromCart, changeQty}) {
  return (
    <div className="cart-list">
      {cart.map((cartItem) => {
        return (
          <div key={cartItem.id} >
            <article className="cart-item">
              <div className="cart-item__img">
                <img src={cartItem.product.image} />
              </div>

              <div className="cart-item__body">
                <div className="cart-item__top">
                  <div style={{ minWidth: 0 }}>
                    <div className="kicker">{cartItem.product.brand}</div>
                    <div className="cart-item__name line-clamp-2">{cartItem.product.name}</div>
                  </div>

                  <div className="cart-item__price">
                    <div className="price price--md price--primary">{formatMoney(cartItem.offer.priceCents * 10)}</div>
                    <div className="muted" style={{ fontSize: "12px" }}>Best store offer</div>
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
                      <span className="cart-meta__label">Quantity</span>
                      <div className="qty">
                        <button 
                          className="qty__btn" 
                          type="button"
                          aria-label="Decrease"
                          onClick={() => changeQty(cartItem.id, -1)}
                        >−</button>
                        <input className="qty__input"
                          type="text"
                          value={cartItem.quantity}
                          inputMode="numeric"
                          readOnly
                        />
                        <button 
                          className="qty__btn" 
                          type="button"
                          aria-label="Increase"
                          onClick={() => changeQty(cartItem.id, +1)}
                        >+</button>
                      </div>
                    </label>
                  </div>

                  <div className="cart-actions">
                    <button className="btn btn--ghost btn--icon" type="button"
                      title="Move to favorites">♥</button>
                    <button 
                      className="btn btn--ghost btn--icon" 
                      type="button"
                      title="Remove"
                      onClick={() => removeFromCart(cartItem.id)}
                      >
                        🗑
                      </button>
                  </div>
                </div>

                <div className="cart-item__bottom">
                  <div className="delivery">
                    <div className="delivery__title">Delivery options</div>

                    <DeliveryOptions deliveryOptions={deliveryOptions} cartItem={cartItem}/>
                  </div>
                  <div className="cart-item__subtotal">
                    <span className="muted" style={{ fontWeight: 800 }}>Item total</span>
                    <span className="price price--md">{formatMoney(cartItem.offer.priceCents * 10)}</span>
                  </div>
                </div>
              </div>
            </article>

            <hr className="hr" style={{ marginTop: "12px" }} />
          </div>
        )
      })}
    </div>
  )
}