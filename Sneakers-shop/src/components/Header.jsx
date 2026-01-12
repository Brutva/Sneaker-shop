import "./Header.css";
import '../normalize/adaptive.css';

export function Header({cart = []}) {

    let totalQuantity = 0;
    
    cart.forEach((cartItem) => {
        totalQuantity += cartItem.quantity;
    })

    return (
        <div>
            <header className="site-header sticky">
                <div className="container header__inner">
                    <a className="logo" href="/">
                        <span className="logo__mark">S</span>
                        <span className="logo__text">SneakerCompare</span>
                    </a>

                    <nav className="nav nav--desktop" aria-label="Primary navigation">
                        <a href="/" aria-current="page" style={{textDecoration: "none"}}>Home</a>
                        <a href="/catalog" style={{textDecoration: "none"}}>Catalog</a>
                        <a href="/stores" style={{textDecoration: "none"}}>Stores</a>
                    </nav>
                    <div className="header__actions">
                        <a className="btn btn--ghost btn--icon header-icon heart" href="/favorites" aria-label="Favorites">♥</a>

                        <a className="btn btn--ghost btn--icon header-icon" href="/checkout" aria-label="Cart">
                            🛒
                            <span className="header-badge">{totalQuantity}</span> 
                        </a>

                        <button className="btn btn--ghost btn--icon" type="button" aria-label="Menu">☰</button>
                    </div>

                </div>
            </header>
        </div>
    )
}