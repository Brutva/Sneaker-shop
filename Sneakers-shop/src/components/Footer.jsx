import './Footer.css';
import '../normalize/adaptive.css';
import { useI18n } from '../i18n.jsx';

export function Footer() {
    const { t } = useI18n();

    return (
        <div>
            <footer className="footer">
                <div className="container">
                    <div className="footer__grid">
                        <div>
                            <a className="logo" href="/">
                                <span className="logo__mark">S</span>
                                <span className="logo__text">{t('siteNameFooter')}</span>
                            </a>
                            <p className="muted" style={{ marginTop: '12px', lineHeight: 1.5 }}>
                                {t('footerText')}
                            </p>
                        </div>

                        <div>
                            <h4>{t('quickLinks')}</h4>
                            <ul>
                                <li><a href="/" className="underline">{t('home')}</a></li>
                                <li><a href="/catalog" className="underline">{t('browseSneakers')}</a></li>
                                <li><a href="/stores" className="underline">{t('allStores')}</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4>{t('popularBrands')}</h4>
                            <ul>
                                <li><a href="" className="underline">Nike</a></li>
                                <li><a href="" className="underline">Adidas</a></li>
                                <li><a href="" className="underline">New Balance</a></li>
                                <li><a href="" className="underline">Puma</a></li>
                                <li><a href="" className="underline">Jordan</a></li>
                                <li><a href="" className="underline">ASICS</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4>{t('support')}</h4>
                            <ul>
                                <li><a href="#" className="underline">{t('helpCenter')}</a></li>
                                <li><a href="#" className="underline">{t('contactUs')}</a></li>
                                <li><a href="#" className="underline">{t('privacyPolicy')}</a></li>
                                <li><a href="#" className="underline">{t('termsOfService')}</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer__bottom">© 2025 {t('siteNameFooter')}. {t('rightsReserved')}</div>
                </div>
            </footer>
        </div>
    );
}
