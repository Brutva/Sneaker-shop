import "./ProductPage.css";
import "../../normalize/adaptive.css";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { formatMoney } from "../../utils/money";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export function ProductPage({ cart, onCartChanged }) {

  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const pricesRef = useRef(null);

  const scrollToPrice = () => {
    pricesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  useEffect(() => {
    const load = async () => {
      const response = await axios.get(`/api/products/${productId}?expand=all`);
      setProduct(response.data)
      setActiveImg(0)
    }
    load()
  }, [productId])

  if (!product) {
    return (
      <div>
        <Header cart={cart} />
        <main className="page">
          <div className="container">
            <p>Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  let images = [];

  if (product.image) images.push(product.image);
  if (product.image2) images.push(product.image2);
  if (product.image3) images.push(product.image3);
  if (product.image4) images.push(product.image4);

  while (images.length < 4) {
    images.push(product.image);
  }

  let offers = [];
  if (product.offersList) {
    offers = product.offersList;
  }

  function getStoreName(offer) {
    if (offer.store && offer.store.name) {
      return offer.store.name;
    }
    if (offer.storeId) {
      return offer.storeId;
    }
    return "Store";
  }

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
                <img className="product-gallery__img" src={images[activeImg]} alt={product.name} />
                <div className="product-gallery__badge badge">
                  <span>{product.offers} offers</span>
                </div>
              </div>

              <div className="product-gallery__thumbs" aria-label="Gallery thumbnails">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb ${idx === activeImg ? "is-active" : ""}`}
                    type="button"
                    aria-label={`Thumbnail ${idx + 1}`}
                    onClick={() => setActiveImg(idx)}
                  >
                    <img src={img} style={{ "height": 230 }} alt="" />
                  </button>
                ))}
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
                  {formatMoney(product.priceCents)}
                </span>
                <div className="muted" style={{ fontSize: 12, fontWeight: 700 }}>
                  Prices may vary by size & store
                </div>
              </div>

              <div className="product-actions">
                <button
                  className="btn btn--primary btn--lg"
                  type="button"
                  onClick={scrollToPrice}
                >
                  Compare prices
                </button>
                <button
                  className="btn btn--outline btn--lg"
                  type="button"
                  aria-label="Favorite"
                  onClick={async () => {
                    await axios.post("/api/favorites/", {
                      productId: product.id
                    })
                  }}
                >
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
                  {product.sizes && product.sizes.map((s) => (
                    <button key={s} className="size-btn" type="button">{s}</button>
                  ))}

                </div>
                <section className="card about-card">
                  <h2 className="about-title">About this sneaker</h2>
                  <p className="muted about-text">
                    {product.description}
                  </p>
                </section>
              </div>
            </aside>
          </div>

          <section ref={pricesRef} className="card offers-card">
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

              {offers.map((o) => {

                const store = o.store ?? { name: getStoreName(o), logo: null };
                
                return(
                  <div key={o.id} className="offers-row" role="row">
                    <div className="offers-cell" role="cell">
                      <div className="store">
                        <div className="store__logo">
                          {store.logo ? (
                            <img src={store.logo} alt={store.name} />
                          ) : (
                            store.name?.[0] || "S"
                          )}
                        </div>

                        <div className="store__name">
                          {store.name}
                        </div>
                      </div>
                    </div>

                    <div className="offers-cell muted" role="cell">
                      {o.delivery ? o.delivery : "-"}
                    </div>

                    <div className="offers-cell" role="cell">
                      <span className="pill">
                        {o.condition ? o.condition : "New"}
                      </span>
                    </div>

                    <div className="offers-cell offers-cell--right" role="cell">
                      <span className="price price--md price--primary">
                        {formatMoney((o.priceCents ? o.priceCents : 0))}
                      </span>
                    </div>

                    <div className="offers-cell offers-cell--right" role="cell">
                      <button
                        className="btn btn--primary"
                        type="button"
                        onClick={async () => {
                          await axios.post("/api/cart-items", {
                            offerId: o.id,
                            quantity: 1
                          });

                          onCartChanged()
                        }}>
                        Add to cart
                      </button>
                    </div>
                  </div>
                )
              })}

            </div>
          </section>

          <div style={{ height: "60px" }} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
