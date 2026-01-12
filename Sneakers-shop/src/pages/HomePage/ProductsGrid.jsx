import { formatMoney } from "../../utils/money"

export function ProductsGrid( {products} ) {
  return (
    <div className="grid-products">
      {products.map((product) => {
        return (
          <div key={product.id}>
            <article className="product-card">
              <a href="product.html" className="product-card__media">
                <img className="product-card__img" src={product.image} alt="Sneaker image" />
                <div className="product-card__actions">
                  <button className="icon-btn icon-btn--danger" type="button" aria-label="Favorite">♥</button>
                  <button className="icon-btn icon-btn--primary" type="button" aria-label="Compare">≋</button>
                </div>
                <div className="product-card__badge badge">
                  <span>{product.offers} offers</span>
                </div>
              </a>
              <div className="product-card__body">
                <div className="kicker">{product.brand}</div>
                <div className="product-card__name line-clamp-2">{product.name}</div>
                <div className="rating">
                  <span className="rating__stars" style={{ "--rating": product.rating.stars }}></span>
                  <span className="rating__value">{product.rating.stars}</span>
                  <span className="rating__count">({product.rating.count})</span>
                </div>
                <div className="product-card__footer">
                  <span className="price price--md price--primary"><span
                    className="price__prefix">from</span>{formatMoney(product.priceCents*10)}</span>
                </div>
              </div>
            </article>
          </div>
        )
      })}
    </div>
  )
}