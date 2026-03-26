import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import './CheckoutPage.css';
import '../../normalize/adaptive.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CartList } from './CartList';
import { PaymentSummary } from './PaymentSummary';
import { useI18n } from '../../i18n.jsx';

export function CheckoutPage({ cart, removeFromCart, changeQty, changeDelivery, paymentSummary, clearCart }) {
    const [deliveryOptions, setDeliveryOptions] = useState([]);
    const { t } = useI18n();

    const loadDeliveryOptions = async () => {
        const response = await axios.get('/api/delivery-options?expand=estimatedDeliveryTime');
        setDeliveryOptions(response.data);
    };

    useEffect(() => {
        loadDeliveryOptions();
    }, []);

    return (
        <div>
            <Header cart={cart} />
            <main className="page">
                <div className="container">
                    <div className="cart-head">
                        <div>
                            <h1 className="page__title">{t('yourCart')}</h1>
                            <p className="page__sub">{cart.length} {cart.length === 1 ? t('item') : t('items')}</p>
                        </div>
                        <a className="btn btn--outline" href="/catalog">{t('continueShopping')}</a>
                    </div>

                    <div className="cart-layout">
                        <section className="cart-items">
                            <div className="card cart-panel">
                                <div className="cart-panel__head">
                                    <h2 className="cart-panel__title">{t('cartItems')}</h2>
                                    <button
                                        className="btn btn--ghost"
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                await clearCart();
                                            } catch (e) {
                                                console.error('Clear cart failed', e);
                                                alert('Не удалось очистить корзину');
                                            }
                                        }}
                                    >
                                        {t('clearCart')}
                                    </button>
                                </div>

                                {cart.length === 0 ? (
                                    <section className="cart-empty card" style={{ marginTop: '18px' }}>
                                        <div style={{ padding: '26px', textAlign: 'center' }}>
                                            <h2 style={{ fontWeight: 900, marginBottom: '10px' }}>{t('cartEmpty')}</h2>
                                            <p className="muted" style={{ marginBottom: '16px' }}>{t('cartEmptyText')}</p>
                                            <a className="btn btn--primary btn--lg" href="/catalog">{t('browseCatalog')}</a>
                                        </div>
                                    </section>
                                ) : (
                                    <CartList
                                        cart={cart}
                                        deliveryOptions={deliveryOptions}
                                        removeFromCart={removeFromCart}
                                        changeQty={changeQty}
                                        changeDelivery={changeDelivery}
                                    />
                                )}
                            </div>
                        </section>

                        <aside className="cart-summary">
                            <div className="card cart-panel">
                                <div className="cart-panel__head">
                                    <h2 className="cart-panel__title">{t('orderSummary')}</h2>
                                </div>

                                <PaymentSummary paymentSummary={paymentSummary} cart={cart} deliveryOptions={deliveryOptions} />
                            </div>

                            <div className="card cart-panel" style={{ marginTop: '14px' }}>
                                <div className="cart-panel__head">
                                    <h2 className="cart-panel__title">{t('needHelp')}</h2>
                                </div>
                                <div style={{ padding: '0 16px 16px' }}>
                                    <p className="muted" style={{ lineHeight: 1.6 }}>{t('needHelpText')}</p>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                        <button className="btn btn--outline" type="button">{t('supportBtn')}</button>
                                        <button className="btn btn--ghost" type="button" style={{ color: 'hsl(var(--primary))', fontWeight: 900 }}>{t('faqBtn')}</button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>

                    <div style={{ height: '60px' }} />
                </div>
            </main>
            <Footer />
        </div>
    );
}
