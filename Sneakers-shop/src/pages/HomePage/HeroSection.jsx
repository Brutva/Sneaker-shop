import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n.jsx';

const QUICK_BRANDS = ['Nike', 'Adidas', 'New Balance', 'Puma', 'Jordan', 'ASICS'];

export function HeroSection() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const { t } = useI18n();

  const trimmed = useMemo(() => q.trim(), [q]);

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (trimmed) params.set('q', trimmed);
    navigate(`/catalog${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const goBrand = (brand) => {
    const params = new URLSearchParams();
    params.set('q', brand);
    navigate(`/catalog?${params.toString()}`);
  };

  return (
    <section className="hero">
      <div className="container hero__inner animate-fade-in">
        <h1 className="hero__title">{t('heroTitleBefore')} <span>{t('heroTitleAccent')}</span></h1>
        <p className="hero__subtitle">{t('heroSubtitle')}</p>

        <div className="hero__searchWrap">
          <form className="hero__search" onSubmit={submit}>
            <div className="searchbar searchbar--hero">
              <input
                className="searchbar__input"
                name="q"
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('searchPlaceholder')}
              />

              {q && (
                <button
                  className="searchbar__clear"
                  type="button"
                  aria-label={t('clear')}
                  onClick={() => setQ('')}
                >
                  ✕
                </button>
              )}
            </div>

            <button className="btn btn--primary btn--lg hero__searchBtn" type="submit">
              {t('search')}
            </button>
          </form>
        </div>

        <div className="chips">
          {QUICK_BRANDS.map((brand) => (
            <button key={brand} className="chip" type="button" onClick={() => goBrand(brand)}>
              {brand}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
