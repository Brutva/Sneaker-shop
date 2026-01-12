import './CatalogPage.css'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

export function CatalogPage() {
    return (
        <div>
            <Header />
            <main className="page">
                <div className="container">
                    <h1 className="page__title">All Sneakers</h1>
                    <p className="page__sub">128 products found</p>

                    <div className="search-layout">
                        <aside className="sidebar">
                            <div className="card filters">
                                <div className="filters__head">
                                    <div className="filters__title">Filters</div>
                                    <button className="filters__clear" type="button">Clear</button>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Brand</div>
                                    </div>
                                    <label className="field"><input type="checkbox"/> Nike</label>
                                    <label className="field"><input type="checkbox"/> Adidas</label>
                                    <label className="field"><input type="checkbox"/> New Balance</label>
                                    <label className="field"><input type="checkbox"/> Puma</label>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Sizes (EU)</div>
                                    </div>
                                    <label className="field"><input type="checkbox"/> 41</label>
                                    <label className="field"><input type="checkbox"/> 42</label>
                                    <label className="field"><input type="checkbox"/> 43</label>
                                    <label className="field"><input type="checkbox"/> 44</label>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Price</div>
                                        <div className="muted" style={{fontWight:800}}>$0 — $500</div>
                                    </div>
                                    <div className="muted" style={{fontSize:"13px"}}>(range slider placeholder)</div>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Availability</div>
                                    </div>
                                    <label className="field"><input type="checkbox"/> In stock only</label>
                                </div>

                                <div className="filter-section">
                                    <div className="filter-section__row">
                                        <div className="filter-section__label">Delivery Speed</div>
                                    </div>
                                    <label className="field"><input type="radio" name="delivery"/> Any</label>
                                    <label className="field"><input type="radio" name="delivery"/> Within 2 days</label>
                                    <label className="field"><input type="radio" name="delivery"/> Within 5 days</label>
                                    <label className="field"><input type="radio" name="delivery"/> Within 7 days</label>
                                </div>
                            </div>
                        </aside>

                        <section style={{flex:1, minWidth:0}}>
                            <div className="controls">
                                <div className="controls__left">
                                    <button className="btn btn--outline" type="button">Filters</button>
                                </div>

                                <div className="controls__right">
                                    <span className="muted" style={{fontSize:"14px", fontWeight:700}}>Sort by:</span>
                                    <select className="select">
                                        <option>Lowest Price</option>
                                        <option>Highest Price</option>
                                        <option>Best Rating</option>
                                        <option>Most Offers</option>
                                        <option>Newest</option>
                                    </select>
                                </div>
                            </div>

                            <div className="products-grid">
                                <article className="product-card">
                                    <a href="product.html" className="product-card__media">
                                        <img className="product-card__img" src="src/public/images/Nike-Air-Max-90-Infrared-2020.jpg" alt="Sneaker"/>
                                            <div className="product-card__actions">
                                                <button className="icon-btn icon-btn--danger" type="button">♥</button>
                                                <button className="icon-btn icon-btn--primary" type="button">≋</button>
                                            </div>
                                            <div className="product-card__badge badge">🛍 <span>12 offers</span></div>
                                    </a>
                                    <div className="product-card__body">
                                        <div className="kicker">Nike</div>
                                        <div className="product-card__name line-clamp-2">Air Max 90 “Infrared”</div>
                                        <div className="rating">
                                            <span className="rating__stars" style={{"--rating":4.6}}></span>
                                            <span className="rating__value">4.6</span>
                                            <span className="rating__count">(1,284)</span>
                                        </div>
                                        <div className="product-card__footer">
                                            <span className="price price--md price--primary"><span className="price__prefix">from</span>$149</span>
                                        </div>
                                    </div>
                                </article>

                                <article className="product-card">
                                    <a href="product.html" className="product-card__media">
                                        <img className="product-card__img" src="src/public/images/adidas-UltraBoost-1.0-DNA-White-Black-Grey.jpg" alt="Sneaker"/>
                                            <div className="product-card__badge badge">🛍 <span>8 offers</span></div>
                                    </a>
                                    <div className="product-card__body">
                                        <div className="kicker">Adidas</div>
                                        <div className="product-card__name line-clamp-2">Ultraboost 1.0</div>
                                        <div className="rating">
                                            <span className="rating__stars" style={{"--rating":4.3}}></span>
                                            <span className="rating__value">4.3</span>
                                            <span className="rating__count">(642)</span>
                                        </div>
                                        <div className="product-card__footer">
                                            <span className="price price--md price--primary"><span className="price__prefix">from</span>$169</span>
                                        </div>
                                    </div>
                                </article>

                                <article className="product-card">
                                    <a href="product.html" className="product-card__media">
                                        <img className="product-card__img" src="src/public/images/New-Balance-990v6-Made-in-USA-Purple.jpg" alt="Sneaker"/>
                                            <div className="product-card__badge badge">🛍 <span>5 offers</span></div>
                                    </a>
                                    <div className="product-card__body">
                                        <div className="kicker">New Balance</div>
                                        <div className="product-card__name line-clamp-2">990v6 </div>
                                        <div className="rating">
                                            <span className="rating__stars" style={{"--rating":4.8}}></span>
                                            <span className="rating__value">4.8</span>
                                            <span className="rating__count">(1,102)</span>
                                        </div>
                                        <div className="product-card__footer">
                                            <span className="price price--md price--primary"><span className="price__prefix">from</span>$219</span>
                                        </div>
                                    </div>
                                </article>
                            </div>

                            <div style={{margin: "26px 0 60px", textAlign:"center"}}>
                                <button className="btn btn--outline btn--lg" type="button">Load More</button>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}