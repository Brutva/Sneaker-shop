import { formatMoney } from '../../utils/money';
import { useI18n } from '../../i18n.jsx';

export function PaymentSummary({ cart, paymentSummary }) {
  const { t } = useI18n();

  if (!paymentSummary) {
    return (
      <div style={{ padding: '0 16px 16px' }}>
        <p className="muted">{t('loadingSummary')}</p>
      </div>
    );
  }

  const itemsCents = Number(paymentSummary.itemsTotalCents ?? paymentSummary.itemsCents ?? paymentSummary.productsCostCents ?? paymentSummary.productCostCents ?? 0);
  const shippingCents = Number(paymentSummary.shippingCents ?? paymentSummary.shippingCostCents ?? 0);
  const taxCents = Number(paymentSummary.taxCents ?? 0);
  const totalCents = Number(paymentSummary.totalCents ?? paymentSummary.totalCostCents ?? (itemsCents + shippingCents + taxCents));

  return (
    <div style={{ padding: '0 16px 16px' }}>
      <div className="summary-row">
        <span className="muted">{t('itemsCount', { count: cart.length })}</span>
        <span className="price">{formatMoney(itemsCents)}</span>
      </div>

      <div className="summary-row">
        <span className="muted">{t('shipping')}</span>
        <span className="price">{formatMoney(shippingCents * 1)}</span>
      </div>

      <div className="summary-row">
        <span className="muted">{t('tax')}</span>
        <span className="price">{formatMoney(taxCents)}</span>
      </div>

      <hr className="hr" style={{ margin: '12px 0' }} />

      <div className="summary-row summary-row--total">
        <span style={{ fontWeight: 900 }}>{t('orderTotal')}</span>
        <span className="price price--md">{formatMoney(totalCents)}</span>
      </div>

      <button className="btn btn--primary btn--lg" style={{ width: '100%', marginTop: '14px' }}>
        {t('checkout')}
      </button>
    </div>
  );
}
