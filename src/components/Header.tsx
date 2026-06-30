import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Search, ShoppingBag, Heart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartContext } from '../context/CartContext';
import AuthModal from './AuthModal';
import useAuth from '../hooks/api/useAuth';
import { User as UserType } from '../types';
import { CartItem } from '../types';
import { useCart } from '../hooks/api';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

const NAV_LINKS = [
  { label: 'Men', to: '/shop' },
  { label: 'Women', to: '/shop' },
  { label: 'Boys', to: '/shop' },
  { label: 'Girls', to: '/shop' },
  { label: 'New In', to: '/shop' },
];

export const Header: React.FC<HeaderProps> = ({ onSearchChange, searchQuery }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getCurrentUser, logout, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { getCart } = useCart();
  const [, setCart] = useState<CartItem>({ items: [], userId: '', _id: '', createdAt: '', updatedAt: '' });
  const { count, setCount } = useCartContext();
  const [user, setUser] = useState<UserType | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      getCurrentUser().then((u) => setUser(u as unknown as UserType));
    } else {
      setUser(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthModalOpen]);

  useEffect(() => {
    getCart().then((cart) => {
      setCart(cart);
      setCount(cart.items.length);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close the account dropdown on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur-md">
      {/* Announcement strip */}
      <div className="bg-ink-900 text-center text-[11px] font-medium tracking-wide text-white/80 sm:text-xs">
        <p className="py-1.5">Free shipping on orders over ₹999 · Easy 30-day returns</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 md:h-20">
          {/* Left: mobile menu + logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full text-neutral-700 hover:bg-neutral-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink-900 font-display text-xl font-bold text-accent-400">
                R
              </span>
              <div className="leading-none">
                <h1 className="font-display text-xl font-bold text-neutral-900 md:text-2xl">RawBharat</h1>
                <p className="mt-0.5 hidden text-[10px] uppercase tracking-[0.2em] text-neutral-400 sm:block">
                  Indian Fashion
                </p>
              </div>
            </Link>
          </div>

          {/* Center: desktop search */}
          <div className="mx-6 hidden flex-1 max-w-xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search for clothing, brands and more…"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2.5 pl-11 pr-4 text-sm transition-colors focus:border-ink-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink-900/10"
              />
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="hidden h-10 w-10 place-items-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100 sm:grid">
              <Heart className="h-5 w-5" />
            </button>

            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-neutral-700 transition-colors hover:bg-neutral-100"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen((v) => !v)}
                  className="flex items-center rounded-full p-0.5 ring-2 ring-transparent transition-all hover:ring-accent-200"
                  aria-label="Account"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-900 text-white">
                      <User className="h-5 w-5" />
                    </span>
                  )}
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-neutral-100 bg-white py-1 shadow-xl">
                    <div className="border-b border-neutral-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-neutral-900">{user.name}</p>
                      <p className="truncate text-xs text-neutral-500">{user.email}</p>
                    </div>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/profile'}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      {user.role === 'admin' ? (
                        <LayoutDashboard className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                      {user.role === 'admin' ? 'Dashboard' : 'My Profile'}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUser(null);
                        setIsDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-ink-800"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop category nav */}
        <nav className="hidden border-t border-neutral-100 lg:block">
          <ul className="flex items-center gap-8 py-3 text-sm font-medium text-neutral-600">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  className="relative transition-colors hover:text-neutral-900 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-accent-500 after:transition-all hover:after:w-full"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile search */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search clothing, brands…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-neutral-200 bg-neutral-50 py-2.5 pl-11 pr-4 text-sm focus:border-ink-900 focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mobile slide-over menu — portaled so the header's backdrop-blur
          doesn't create a containing block that traps the fixed overlay */}
      {isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <span className="font-display text-xl font-bold text-neutral-900">RawBharat</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full text-neutral-600 hover:bg-neutral-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="px-2 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>,
        document.body
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
