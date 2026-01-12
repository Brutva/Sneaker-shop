import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";

export function DeliveryOptions({deliveryOptions = [], cartItem}) {

  if (!cartItem) return null;
  
  return (
    <div className="delivery-options">

      {deliveryOptions.map((deliveryOption) => {
        let priceString = 'FREE';

        if (deliveryOption.priceCents > 0) {
          priceString = `${formatMoney(deliveryOption.priceCents * 10)}`
        }

        return (
          <label key={deliveryOption.id} className="delivery-option">
            <input
              className="delivery-option__radio"
              type="radio"
              checked={deliveryOption.id === cartItem.deliveryOptionId}
              name={`delivery-option-${cartItem.productId}`}
              readOnly
            />
            <div className="delivery-option__body">
              <div className="delivery-option__top">
                <span className="delivery-option__name">Standard</span>
                <span className="delivery-option__price">{priceString}</span>
              </div>
              <div className="muted" style={{ fontSize: 12, fontWeight: 800 }}>
                {dayjs(deliveryOption.estimatedDeliveryTimeMs)
                  .format('dddd, MMMM, D')}
              </div>
            </div>
          </label>
        )
      })}

    </div>
  )
}