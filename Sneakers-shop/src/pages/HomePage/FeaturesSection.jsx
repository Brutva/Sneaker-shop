export function FeaturesSection() {
  return (
    <section className="features">
      <div className="container">
        <div className="features__grid">
          <div className="feature">
            <div className="feature__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M4 19V5M4 19h16M8 15l3-3 3 2 5-6" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>Best Prices</h3>
              <p className="muted">Compare prices across multiple stores to find the best deal.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>Trusted Stores</h3>
              <p className="muted">All our partner stores are verified and rated by real customers.</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M13 2 3 14h8l-1 8 11-14h-8l0-6Z" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>Real-time Updates</h3>
              <p className="muted">Prices and availability updated in real-time from all stores.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}