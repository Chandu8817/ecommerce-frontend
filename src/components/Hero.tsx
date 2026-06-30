import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBanners } from '../hooks/api/useBanners';

const FALLBACK_IMAGE =
  'https://github.com/Chandu8817/ecommerce-backend/blob/main/demo-images/navrarti-banner.jpg?raw=true';

const HighlightStrip: React.FC = () => (
  <div className="grid grid-cols-3 gap-3 border-t border-neutral-200 pt-6">
    {[
      { icon: <Truck className="h-5 w-5" />, label: 'Free shipping', sub: 'Over ₹999' },
      { icon: <RefreshCcw className="h-5 w-5" />, label: 'Easy returns', sub: '30 days' },
      { icon: <ShieldCheck className="h-5 w-5" />, label: 'Secure pay', sub: '100% safe' },
    ].map((f) => (
      <div key={f.label} className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-50 text-accent-600">
          {f.icon}
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-neutral-900">{f.label}</div>
          <div className="text-xs text-neutral-500">{f.sub}</div>
        </div>
      </div>
    ))}
  </div>
);

export const Hero: React.FC = () => {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const { getActiveBanners, loading, error } = useBanners();
  const [banners, setBanners] = useState<Array<{
    _id: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    mobileImageUrl?: string;
    linkUrl?: string;
    buttonText?: string;
  }>>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getActiveBanners('hero', 'top');
        if (response && response.data && response.data.length > 0) {
          setBanners(response.data);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
      }
    };
    fetchBanners();
  }, [getActiveBanners]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToNextBanner = () =>
    setCurrentBannerIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  const goToPrevBanner = () =>
    setCurrentBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  // Loading state
  if (loading && banners.length === 0) {
    return (
      <div className="flex h-[460px] items-center justify-center bg-neutral-100 lg:h-[560px]">
        <div className="animate-pulse space-y-4 text-center">
          <div className="mx-auto h-8 w-48 rounded bg-neutral-200" />
          <div className="mx-auto h-12 w-72 rounded bg-neutral-200" />
        </div>
      </div>
    );
  }

  // Error state
  if (error && banners.length === 0) {
    return (
      <div className="flex h-[360px] items-center justify-center bg-neutral-100">
        <p className="px-4 text-center text-neutral-600">
          Couldn’t load featured banners. Browse the collection below.
        </p>
      </div>
    );
  }

  // Default content (no banners configured)
  if (banners.length === 0) {
    return (
      <section className="relative overflow-hidden bg-neutral-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-7 animate-fade-in-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-400">
                <Sparkles className="h-4 w-4" />
                New Season · 2026
              </span>

              <h1 className="font-display text-4xl font-bold leading-[1.1] text-neutral-900 sm:text-5xl lg:text-6xl">
                Indian fashion,
                <span className="block text-accent-600">for everyone.</span>
              </h1>

              <p className="max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg">
                From everyday essentials to statement ethnic wear — discover curated styles for
                men, women and teens, all in one place.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-ink-800 hover:shadow-lg"
                >
                  Shop the collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-7 py-3.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-900"
                >
                  Explore new in
                </Link>
              </div>

              <HighlightStrip />
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[1.75rem] shadow-2xl">
                <img
                  src="/images/default-hero.jpg"
                  alt="RawBharat fashion"
                  className="h-80 w-full object-cover sm:h-[460px] lg:h-[560px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
              </div>
              <div className="absolute -left-4 bottom-6 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
                <div className="text-2xl font-bold text-neutral-900">4.8★</div>
                <div className="text-xs text-neutral-500">Rated by 10k+ shoppers</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Dynamic banners
  const currentBanner = banners[currentBannerIndex];
  const hasMultipleBanners = banners.length > 1;

  return (
    <section className="relative overflow-hidden bg-neutral-900">
      <div className="absolute inset-0">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.title}
          className="h-full w-full object-cover object-center opacity-30"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/90 via-neutral-950/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-28">
        {hasMultipleBanners && (
          <>
            <button
              onClick={goToPrevBanner}
              className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNextBanner}
              className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
              aria-label="Next banner"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="max-w-2xl space-y-6 text-white">
          {currentBanner.subtitle && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-400 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              {currentBanner.subtitle}
            </span>
          )}

          <h1 className="font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
            {currentBanner.title}
          </h1>

          {currentBanner.description && (
            <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {currentBanner.description}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              to={currentBanner.linkUrl || '/shop'}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-accent-400"
            >
              {currentBanner.buttonText || 'Shop now'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Browse all
            </Link>
          </div>
        </div>

        {hasMultipleBanners && (
          <div className="mt-10 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentBannerIndex(i)}
                aria-label={`Go to banner ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentBannerIndex ? 'w-8 bg-accent-400' : 'w-3 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
