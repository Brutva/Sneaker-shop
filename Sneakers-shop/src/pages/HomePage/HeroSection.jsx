export function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero__inner animate-fade-in">
        <h1 className="hero__title">Find the Best <span>Sneaker Prices</span></h1>
        <p className="hero__subtitle">
          Compare prices from trusted stores. Save money on your favorite kicks.
        </p>

        <div className="hero__search">
          <form className="searchbar" action="search.html" method="get">
            <svg className="searchbar__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" fill="none" stroke="currentColor"
                strokeWidth="2" />
              <path d="M16.5 16.5 21 21" fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" />
            </svg>
            <input className="searchbar__input" name="q" type="text"
              placeholder="Search sneakers by model, brand, or SKU..." />
            <button className="searchbar__clear" type="button" aria-label="Clear">✕</button>
          </form>
        </div>

        <div className="chips">
          <a className="chip" href="search.html?q=Nike">Nike</a>
          <a className="chip" href="search.html?q=Adidas">Adidas</a>
          <a className="chip" href="search.html?q=New%20Balance">New Balance</a>
          <a className="chip" href="search.html?q=Puma">Puma</a>
          <a className="chip" href="search.html?q=Jordan">Jordan</a>
          <a className="chip" href="search.html?q=ASICS">ASICS</a>
        </div>
      </div>
    </section>
  )
}