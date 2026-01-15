import "./ProductPage.css";
import "../../normalize/adaptive.css";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { formatMoney } from "../../utils/money";

export function ProductPage({ cart }) {
  const product = {
    id: "00000000-0000-0000-000000000001",
    brand: "Nike",
    name: "Air Max 90 “Infrared”",
    image: "src/public/images/Nike-Air-Max-90-Infrared-2020.jpg",
    rating: { stars: 4.6, count: 1284 },
    priceCents: 1490,
    offers: 12,
    category: "Lifestyle",
    colorway: "Infrared / Black / Grey",
    releaseDate: "2020",
    sizes: ["40", "41", "42", "43", "44", "45"]
  };

  const offers = [
    { store: "SneakerHub", priceCents: 1490, delivery: "2–4 days", note: "New" },
    { store: "Kicks Market", priceCents: 1590, delivery: "1–3 days", note: "New" },
    { store: "Urban Store", priceCents: 1690, delivery: "3–7 days", note: "New" }
  ];

  return (
    <div>
      <Header cart={cart} />

      <main className="page">
        <div className="container">
          <div className="breadcrumbs">
            <a className="breadcrumbs__link" href="/catalog">← Back to catalog</a>
            <span className="breadcrumbs__sep">/</span>
            <span className="breadcrumbs__current">{product.brand}</span>
          </div>

          <div className="product-top">
            <section className="card product-gallery">
              <div className="product-gallery__main">
                <img className="product-gallery__img" src={product.image} alt={product.name} />
                <div className="product-gallery__badge badge">
                  <span>{product.offers} offers</span>
                </div>
              </div>

              <div className="product-gallery__thumbs" aria-label="Gallery thumbnails">
                <button className="thumb is-active" type="button" aria-label="Thumbnail 1">
                  <img src={product.image} alt="" />
                </button>
                <button className="thumb" type="button" aria-label="Thumbnail 2">
                  <img src="src/public/images/adidas-UltraBoost-1.0-DNA-White-Black-Grey.jpg" alt="" />
                </button>
                <button className="thumb" type="button" aria-label="Thumbnail 3">
                  <img src="src/public/images/New-Balance-990v6-Made-in-USA-Purple.jpg" alt="" />
                </button>
                <button className="thumb" type="button" aria-label="Thumbnail 4">
                  <img src={product.image} alt="" />
                </button>
              </div>
            </section>

            <aside className="card product-summary">
              <div className="kicker">{product.brand}</div>
              <h1 className="product-title">{product.name}</h1>

              <div className="rating product-rating">
                <span className="rating__stars" style={{ "--rating": product.rating.stars }} />
                <span className="rating__value">{product.rating.stars}</span>
                <span className="rating__count">({product.rating.count})</span>
              </div>

              <div className="product-price">
                <span className="price price--xl price--primary">
                  <span className="price__prefix">from</span>
                  {formatMoney(product.priceCents * 10)}
                </span>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>
                  Prices may vary by size & store
                </div>
              </div>

              <div className="product-actions">
                <button className="btn btn--primary btn--lg" type="button">
                  Compare prices
                </button>
                <button className="btn btn--outline btn--lg" type="button" aria-label="Favorite">
                  ♥ Favorite
                </button>
              </div>

              <div className="product-meta">
                <div className="meta-row">
                  <div className="meta-label">Category</div>
                  <div className="meta-value">{product.category}</div>
                </div>
                <div className="meta-row">
                  <div className="meta-label">Colorway</div>
                  <div className="meta-value">{product.colorway}</div>
                </div>
                <div className="meta-row">
                  <div className="meta-label">Release</div>
                  <div className="meta-value">{product.releaseDate}</div>
                </div>
              </div>

              <div className="product-sizes">
                <div className="product-sizes__head">
                  <div className="product-sizes__title">Sizes (EU)</div>
                  <div className="muted" style={{ fontSize: 13, fontWeight: 700 }}>select later</div>
                </div>

                <div className="sizes-grid">
                  {product.sizes.map((s) => (
                    <button key={s} className="size-btn" type="button">{s}</button>
                  ))}
                </div>
                <section className="card about-card">
                  <h2 className="about-title">About this sneaker</h2>
                  <p className="muted about-text">
                    Placeholder description. Тут ты потом подставишь реальные данные: описание, материалы, история релиза,
                    состав, ссылки на магазины и т.д.
                  </p>
                </section>
              </div>
            </aside>
          </div>

          <section className="card offers-card">
            <div className="offers-head">
              <h2 className="offers-title">Price comparison</h2>
              <div className="offers-actions">
                <button className="btn btn--outline" type="button">Sort: Lowest price</button>
                <button className="btn btn--ghost" type="button">Filters</button>
              </div>
            </div>

            <div className="offers-table" role="table" aria-label="Offers table">
              <div className="offers-row offers-row--head" role="row">
                <div className="offers-cell" role="columnheader">Store</div>
                <div className="offers-cell" role="columnheader">Delivery</div>
                <div className="offers-cell" role="columnheader">Condition</div>
                <div className="offers-cell offers-cell--right" role="columnheader">Price</div>
                <div className="offers-cell offers-cell--right" role="columnheader"></div>
              </div>

              {offers.map((o) => (
                <div key={o.store} className="offers-row" role="row">
                  <div className="offers-cell" role="cell">
                    <div className="store">
                      <div className="store__logo">{o.store.slice(0, 1)}</div>
                      <div className="store__name">{o.store}</div>
                    </div>
                  </div>

                  <div className="offers-cell muted" role="cell">{o.delivery}</div>
                  <div className="offers-cell" role="cell">
                    <span className="pill">{o.note}</span>
                  </div>

                  <div className="offers-cell offers-cell--right" role="cell">
                    <span className="price price--md price--primary">
                      {formatMoney(o.priceCents * 10)}
                    </span>
                  </div>

                  <div className="offers-cell offers-cell--right" role="cell">
                    <button className="btn btn--primary" type="button">Go</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ height: "60px" }} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
