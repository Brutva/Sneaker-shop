import { formatMoney } from "../../utils/money"

export function PaymentSummary({paymentSummary}) {
  return (
    <div className="summary">

      {paymentSummary && (
        <>
          <div className="summary-row">
            <span className="muted">Subtotal </span>
            <span style={{ fontWeight: 700 }}>{formatMoney(paymentSummary.productCostCents * 10)}</span>
          </div>
          <div className="summary-row">
            <span className="muted">Shipping </span>
            <span style={{ fontWeight: 700 }}>{formatMoney(paymentSummary.shippingCostCents * 10)}</span>
          </div>
          <div className="summary-row">
            <span className="muted">Tax </span>
            <span style={{ fontWeight: 700 }}>{formatMoney(paymentSummary.taxCents * 10)}</span>
          </div>

          <hr className="hr" style={{ margin: "12px 0" }} />

          <div className="summary-row summary-total">
            <span>Total: </span>
            <span className="price price--lg price--primary">{formatMoney(paymentSummary.totalCostCents * 10)}</span>
          </div>

          <div className="promo">
            <label className="promo__label" htmlFor="promo">Promo code</label>
            <div className="promo__row">
              <input id="promo" className="input" type="text" placeholder="Enter code" />
              <button className="btn btn--outline" type="button">Apply</button>
            </div>
          </div>

          <div className="shipping">
            <div className="shipping__title">Estimated delivery</div>
            <p className="muted" style={{ lineHeight: 1.55 }}>
              Between <b>2</b> and <b>7</b> days depending on store and shipping option.
            </p>
          </div>

          <button className="btn btn--primary btn--lg" type="button" style={{ width: "100%" }}>Checkout
            →</button>
          <button className="btn btn--outline btn--lg" type="button" style={{ width: "100%" }}>Save payment
            methods</button>

          <div className="secure">
            <span className="badge">🔒 Secure checkout</span>
            <span className="badge">💳 Cards & wallets</span>
            <span className="badge">↩ Easy returns</span>
          </div>
        </>
      )}


    </div>
  )
}