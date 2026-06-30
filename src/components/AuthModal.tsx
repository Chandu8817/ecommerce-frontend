import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { GoogleLogin } from '@react-oauth/google';
import { ShieldCheck, Truck, Sparkles, X } from 'lucide-react';
import { useAuth } from '../hooks/api/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Mount/entrance animation + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    const id = requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const handleGoogleSuccess = async (credential?: string) => {
    if (!credential) {
      setError('Could not get a Google credential. Please try again.');
      return;
    }
    setError(null);
    try {
      await loginWithGoogle(credential);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed. Please try again.');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in"
    >
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Sheet / Card */}
      <div
        className={`relative w-full sm:max-w-md bg-white shadow-2xl
          rounded-t-3xl sm:rounded-3xl overflow-hidden
          transition-all duration-300 ease-out
          ${visible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:translate-y-0 sm:scale-95'}`}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden flex justify-center pt-3">
          <span className="h-1.5 w-12 rounded-full bg-neutral-300" />
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand header */}
        <div className="relative overflow-hidden bg-ink-900 px-6 pb-12 pt-9 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/20 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 font-display text-2xl font-bold text-accent-400 ring-1 ring-white/15">
              R
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight">RawBharat</h2>
              <p className="text-sm text-white/60">Indian fashion · Men · Women · Teens</p>
            </div>
          </div>
        </div>

        {/* Body — layered card lifted over the header */}
        <div className="-mt-6 rounded-t-3xl bg-white px-6 pb-8 pt-7">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-neutral-900">Sign in to continue</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Use your Google account — fast, secure, no passwords.
            </p>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Google button */}
          <div className="mt-6 flex flex-col items-center">
            {GOOGLE_CLIENT_ID ? (
              <div className={loading ? 'pointer-events-none opacity-60' : ''}>
                <GoogleLogin
                  onSuccess={(res) => handleGoogleSuccess(res.credential)}
                  onError={() => setError('Google sign-in was cancelled or failed.')}
                  shape="pill"
                  size="large"
                  width="320"
                  text="continue_with"
                  useOneTap={false}
                />
              </div>
            ) : (
              <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-800">
                Google sign-in isn’t configured yet. Set{' '}
                <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code> to enable it.
              </div>
            )}

            {loading && <p className="mt-4 text-sm text-neutral-500">Signing you in…</p>}
          </div>

          {/* Trust / benefit strip */}
          <div className="mt-7 grid grid-cols-3 gap-2 border-t border-neutral-100 pt-5">
            <Benefit icon={<ShieldCheck className="h-5 w-5" />} label="Secure sign-in" />
            <Benefit icon={<Truck className="h-5 w-5" />} label="Track orders" />
            <Benefit icon={<Sparkles className="h-5 w-5" />} label="Faster checkout" />
          </div>

          <p className="mt-6 text-center text-xs leading-relaxed text-neutral-400">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

const Benefit: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex flex-col items-center gap-1.5 text-center">
    <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-50 text-accent-600">
      {icon}
    </span>
    <span className="text-[11px] font-medium leading-tight text-neutral-600">{label}</span>
  </div>
);

export default AuthModal;
