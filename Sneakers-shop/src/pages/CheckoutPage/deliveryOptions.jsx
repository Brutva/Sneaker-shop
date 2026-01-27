import dayjs from "dayjs";
import { formatMoney } from "../../utils/money";

export function DeliveryOptions({ deliveryOptions = [], cartItem, changeDelivery }) {
  if (!cartItem) return null;

  const selectedId = String(cartItem.deliveryOptionId ?? "");
  const groupName = `delivery-option-${cartItem.id}`; 

  return (
    <div className="delivery-options">
      {deliveryOptions.map((opt) => {
        const optId = String(opt.id);

        const priceString =
          opt.priceCents > 0 ? formatMoney(opt.priceCents * 1) : "FREE";

        return (
          <label key={optId} className="delivery-option">
            <input
              className="delivery-option__radio"
              type="radio"
              name={groupName}
              value={optId}
              checked={optId === selectedId}
              onChange={() => changeDelivery(cartItem.id, optId)} 
            />

            <div className="delivery-option__body">
              <div className="delivery-option__top">
                <span className="delivery-option__name">Standard</span>
                <span className="delivery-option__price">{priceString}</span>
              </div>
              <div className="muted" style={{ fontSize: 12, fontWeight: 800 }}>
                {dayjs(opt.estimatedDeliveryTimeMs).format("dddd, MMMM, D")}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}