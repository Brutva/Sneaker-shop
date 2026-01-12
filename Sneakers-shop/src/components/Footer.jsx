import './Footer.css'
import '../normalize/adaptive.css'

export function Footer() {
    return (
        <div>
            <footer className="footer">
                <div className="container">
                    <div className="footer__grid">
                        <div>
                            <a className="logo" href="index.html">
                                <span className="logo__mark">S</span>
                                <span className="logo__text">SneakerCompare</span>
                            </a>
                            <p className="muted" style={{marginTop: "12px", "lineHeight":1.5}}>
                                Find the best sneaker prices from trusted stores. Compare, save, and get the kicks you love.
                            </p>
                        </div>

                        <div>
                            <h4>Quick Links</h4>
                            <ul>
                                <li><a href="/" className='underline'>Home</a></li>
                                <li><a href="/catalog" className='underline'>Browse Sneakers</a></li>
                                <li><a href="/stores" className='underline'>All Stores</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4>Popular Brands</h4>
                            <ul>
                                <li><a href="" className='underline'>Nike</a></li>
                                <li><a href="" className='underline'>Adidas</a></li>
                                <li><a href="" className='underline'>New Balance</a></li>
                                <li><a href="" className='underline'>Puma</a></li>
                                <li><a href="" className='underline'>Jordan</a></li>
                                <li><a href="" className='underline'>ASICS</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4>Support</h4>
                            <ul>
                                <li><a href="#" className='underline' >Help Center</a></li>
                                <li><a href="#" className='underline' >Contact Us</a></li>
                                <li><a href="#" className='underline' >Privacy Policy</a></li>
                                <li><a href="#" className='underline' >Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer__bottom">© 2025 SneakerCompare. All rights reserved.</div>
                </div>
            </footer>
        </div>
    )
}