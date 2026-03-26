import './Header.css';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '../i18n.jsx';

export function Header({ cart }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { t, toggleLanguage, language } = useI18n();

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };

        if (menuOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', onKeyDown);
        }

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);
    const cartCount = cart?.length || 0;

    return (
        <>
            <header className="site-header">
                <div className="container">
                    <div className="header__inner">
                        <NavLink className="logo" to="/">
                            <div className="logo__mark">S</div>
                            <div className="logo__text">{t('siteName')}</div>
                        </NavLink>

                        <nav className="nav nav--desktop">
                            <NavLink to="/">{t('home')}</NavLink>
                            <NavLink to="/catalog">{t('catalog')}</NavLink>
                            <NavLink to="/stores">{t('stores')}</NavLink>
                            <NavLink to="/favorites">{t('favorites')}</NavLink>
                        </nav>

                        <div className="header__actions">
                            <button
                                className="btn btn--outline header__langBtn"
                                type="button"
                                onClick={toggleLanguage}
                                aria-label={language === 'en' ? 'Switch language to Russian' : 'Switch language to English'}
                            >
                                {t('langShort')}
                            </button>

                            <NavLink className="btn btn--outline header__cart" to="/checkout">
                                <span className="header__cartLabel">{t('cart')}</span>
                                <span className="header__cartCount">{cartCount}</span>
                            </NavLink>

                            <button
                                className="btn btn--ghost btn--icon header__menuBtn"
                                type="button"
                                aria-label={t('openMenu')}
                                aria-expanded={menuOpen}
                                onClick={() => setMenuOpen((v) => !v)}
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {menuOpen && (
                <div className="mobile-menu__backdrop" onClick={closeMenu}>
                    <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
                        <div className="mobile-menu__head">
                            <div className="mobile-menu__title">{t('menu')}</div>
                            <button
                                className="btn btn--ghost btn--icon"
                                type="button"
                                aria-label={t('closeMenu')}
                                onClick={closeMenu}
                            >
                                ✕
                            </button>
                        </div>

                        <button
                            className="btn btn--outline mobile-lang-btn"
                            type="button"
                            onClick={toggleLanguage}
                        >
                            {t('langShort')}
                        </button>

                        <nav className="mobile-nav">
                            <NavLink to="/" onClick={closeMenu}>{t('home')}</NavLink>
                            <NavLink to="/catalog" onClick={closeMenu}>{t('catalog')}</NavLink>
                            <NavLink to="/stores" onClick={closeMenu}>{t('stores')}</NavLink>
                            <NavLink to="/favorites" onClick={closeMenu}>{t('favorites')}</NavLink>
                            <NavLink className="btn btn--primary" to="/checkout" onClick={closeMenu}>
                                {t('goToCart', { count: cartCount })}
                            </NavLink>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}
