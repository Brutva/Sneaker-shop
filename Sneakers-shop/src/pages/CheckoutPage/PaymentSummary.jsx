import { formatMoney } from "../../utils/money";

export function PaymentSummary({ cart, paymentSummary }) {
  if (!paymentSummary) {
    return (
      <div style={{ padding: "0 16px 16px" }}>
        <p className="muted">Loading summary...</p>
      </div>
    );
  }

  const itemsCents = Number(
    paymentSummary.itemsTotalCents ??
    paymentSummary.itemsCents ??
    paymentSummary.productsCostCents ??
    paymentSummary.productCostCents ??
    0
  );

  const shippingCents = Number(
    paymentSummary.shippingCents ??
    paymentSummary.shippingCostCents ??
    0
  );

  const taxCents = Number(paymentSummary.taxCents ?? 0);

  const totalCents = Number(
    paymentSummary.totalCents ??
    paymentSummary.totalCostCents ??
    (itemsCents + shippingCents + taxCents)
  );

  return (
    <div style={{ padding: "0 16px 16px" }}>
      <div className="summary-row">
        <span className="muted">Items ({cart.length})</span>
        <span className="price">{formatMoney(itemsCents * 10)}</span>
      </div>

      <div className="summary-row">
        <span className="muted">Shipping</span>
        <span className="price">{formatMoney(shippingCents * 1)}</span>
      </div>

      <div className="summary-row">
        <span className="muted">Tax</span>
        <span className="price">{formatMoney(taxCents * 10)}</span>
      </div>

      <hr className="hr" style={{ margin: "12px 0" }} />

      <div className="summary-row summary-row--total">
        <span style={{ fontWeight: 900 }}>Order total</span>
        <span className="price price--md">{formatMoney(totalCents * 10)}</span>
      </div>

      <button className="btn btn--primary btn--lg" style={{ width: "100%", marginTop: "14px" }}>
        Checkout
      </button>
    </div>
  );
}