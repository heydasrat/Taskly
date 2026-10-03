
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../../Pages/index.js";
import { useSelector } from "react-redux";
import {
  Search,
  MoonStar,
  ShieldCheck,
  KeyRound,
  CircleUserRound,
  RefreshCw,
  Menu,
  X,
  ArrowUpRight,
  Lock,
  Check,
} from "lucide-react";

const navLink =
  "rounded-sm text-[14px] font-medium text-[color:var(--fg-2)] transition-colors hover:text-[color:var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/50";

const primaryBtnSm =
  "rounded-[10px] bg-[color:var(--btn-bg)] px-4 py-2 text-[13.5px] font-medium text-[color:var(--btn-fg)] transition-colors duration-150 hover:bg-[color:var(--btn-hover)] active:bg-[color:var(--btn-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]";

const heroPrimaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-[10px] bg-[color:var(--btn-bg)] px-6 py-3 text-[15px] font-medium text-[color:var(--btn-fg)] shadow-[0_1px_2px_rgba(19,26,34,0.25)] transition-colors duration-150 hover:bg-[color:var(--btn-hover)] active:bg-[color:var(--btn-active)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--bg)]";

const heroSecondaryBtn =
  "inline-flex items-center justify-center gap-2 rounded-[10px] border border-[color:var(--border-2)] bg-[color:var(--surface)] px-6 py-3 text-[15px] font-medium text-[color:var(--fg)] transition-colors duration-150 hover:bg-[color:var(--surface-hover)]";

const ctaBtnLight =
  "inline-flex items-center justify-center gap-2 rounded-[10px] bg-white px-6 py-3 text-[15px] font-medium text-[#131A22] transition-colors duration-150 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131A22]";

const features = [
  {
    Icon: Search,
    title: "Search, filter, and sort",
    body: "Find anything by title or description, then filter by All, Pending, or Completed and sort newest, oldest, or completed first.",
  },
  {
    Icon: MoonStar,
    title: "Light and dark, your call",
    body: "Switch themes once in settings and Taskly keeps that choice on your account.",
  },
  {
    Icon: CircleUserRound,
    title: "A profile that's yours",
    body: "Set your name, choose a username, and add a photo so the workspace feels like yours.",
  },
  {
    Icon: ShieldCheck,
    title: "Signed in safely",
    body: "Sessions run on access and refresh tokens behind the scenes, not a password sitting in your browser.",
  },
  {
    Icon: KeyRound,
    title: "Never locked out",
    body: "Forgot your password? A six-digit code sent to your email gets you back in.",
  },
  {
    Icon: RefreshCw,
    title: "Follows you between devices",
    body: "Your list lives on your account, not one browser, so it's the same list wherever you sign in.",
  },
];

const steps = [
  {
    n: "1",
    title: "Create your account",
    body: "Add your name, email, username, and a password of at least eight characters.",
  },
  {
    n: "2",
    title: "Confirm your email",
    body: "Enter the six-digit code we send you, or ask for a new one.",
  },
  {
    n: "3",
    title: "Add what's on your plate",
    body: "Start today's list and check things off as the day goes.",
  },
];

const Wordmark = () => (
  <div className="flex items-center gap-2.5">
    <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[color:var(--mark-bg)] text-white ring-1 ring-inset ring-[color:var(--mark-ring)]">
      <Lock size={15} strokeWidth={2.2} />
    </div>

    <span className="text-[17px] font-semibold tracking-[-0.02em] text-[color:var(--fg)]">
      Taskly
    </span>
  </div>
);

const PreviewRow = ({ label, meta, done }) => (
  <li className="flex items-center gap-3 py-2.5">
    <span
      className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md ${
        done
          ? "bg-[#1F8A70] text-white"
          : "ring-1 ring-inset ring-[color:var(--border-2)]"
      }`}
    >
      {done && <Check size={12} strokeWidth={2.6} />}
    </span>

    <span
      className={`flex-1 text-[13.5px] leading-snug ${
        done
          ? "text-[color:var(--faint-2)] line-through"
          : "text-[color:var(--fg-2)]"
      }`}
    >
      {label}
    </span>

    <span className="text-[11.5px] tabular-nums text-[color:var(--faint-3)]">
      {meta}
    </span>
  </li>
);

const LandingCMP = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const isDark = user?.preferences?.theme === "dark";

  return (
    <div
      data-theme={isDark ? "dark" : "light"}
      style={{ colorScheme: isDark ? "dark" : "light" }}
      className="tk-root min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)] antialiased"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');

        html {
          scroll-behavior: smooth;
        }

        .tk-root {
          --bg: #EDEFF2;
          --bg-glass: rgba(237,239,242,.9);
          --surface: #FFFFFF;
          --surface-2: #F7F8F9;
          --surface-hover: #F5F6F8;
          --chip: #EDEFF2;
          --divider: #EDEFF2;
          --border: #E2E5E9;
          --border-2: #DCE0E5;
          --fg: #131A22;
          --fg-2: #3D4753;
          --muted: #6B7480;
          --faint: #8B939D;
          --faint-2: #9AA3AD;
          --faint-3: #B4BBC3;
          --btn-bg: #131A22;
          --btn-fg: #FFFFFF;
          --btn-hover: #1F2A38;
          --btn-active: #0D1621;
          --mark-bg: #131A22;
          --mark-ring: transparent;
          --accent-soft: rgba(31,138,112,.10);
          --accent-ink: #1F8A70;
          --band-border: transparent;
          --cta-ring: transparent;
          --shadow-hero: 0 1px 2px rgba(19,26,34,.04),0 24px 48px -20px rgba(19,26,34,.18);
          --shadow-hover: 0 8px 24px -12px rgba(19,26,34,.16);
          font-family: 'Instrument Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
          font-feature-settings: 'ss01','cv01';
        }

        .tk-root[data-theme="dark"] {
          --bg: #0B1015;
          --bg-glass: rgba(11,16,21,.85);
          --surface: #121A22;
          --surface-2: #0D141B;
          --surface-hover: #18222C;
          --chip: #1A232D;
          --divider: #1B242E;
          --border: #1F2933;
          --border-2: #2A3541;
          --fg: #EEF1F4;
          --fg-2: #C3CBD3;
          --muted: #9AA5B1;
          --faint: #7B8794;
          --faint-2: #66727F;
          --faint-3: #5F6B78;
          --btn-bg: #EEF1F4;
          --btn-fg: #0B1015;
          --btn-hover: #FFFFFF;
          --btn-active: #D9DEE3;
          --mark-bg: rgba(255,255,255,.10);
          --mark-ring: rgba(255,255,255,.15);
          --accent-soft: rgba(31,138,112,.18);
          --accent-ink: #45B79A;
          --band-border: #1F2933;
          --cta-ring: rgba(255,255,255,.08);
          --shadow-hero: 0 1px 2px rgba(0,0,0,.4),0 24px 48px -20px rgba(0,0,0,.6);
          --shadow-hover: 0 8px 24px -12px rgba(0,0,0,.6);
        }

        .tk-hero-shadow {
          box-shadow: var(--shadow-hero);
        }

        .tk-lift:hover {
          box-shadow: var(--shadow-hover);
        }

        @keyframes tk-rise {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .tk-rise {
          animation: tk-rise .6s cubic-bezier(.22,.68,.28,1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .tk-rise {
            animation: none !important;
          }
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-[color:var(--bg-glass)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            to={user ? "/dashboard" : "/"}
            className="flex items-center"
          >
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className={navLink}>
              Features
            </a>
            <a href="#how-it-works" className={navLink}>
              How it works
            </a>
          </nav>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-5 md:flex">
            {user ? (
              <Link to="/dashboard" className={primaryBtnSm}>
                Home
              </Link>
            ) : (
              <>
                <Link to="/login" className={navLink}>
                  Sign in
                </Link>

                <Link to="/register" className={primaryBtnSm}>
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="rounded-md p-1.5 text-[color:var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] md:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-[color:var(--border)] bg-[color:var(--bg)] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className={navLink}
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className={navLink}
              >
                How it works
              </a>

              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className={`${primaryBtnSm} text-center`}
                >
                  Home
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className={navLink}
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className={`${primaryBtnSm} text-center`}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero section */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
          <div>
            <h1 className="text-[38px] font-semibold leading-[1.12] tracking-[-0.03em] text-[color:var(--fg)] sm:text-[46px]">
              One list for the day, kept the way you like it.
            </h1>

            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[color:var(--muted)]">
              Taskly is a personal task manager. Sign in, add what's on your
              plate, and search, filter, or sort it back into view whenever you
              need to.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {user ? (
                <Link to="/dashboard" className={heroPrimaryBtn}>
                  Go to dashboard
                  <ArrowUpRight size={16} strokeWidth={2.2} />
                </Link>
              ) : (
                <Link to="/register" className={heroPrimaryBtn}>
                  Create your account
                  <ArrowUpRight size={16} strokeWidth={2.2} />
                </Link>
              )}

              <a href="#how-it-works" className={heroSecondaryBtn}>
                See how it works
              </a>
            </div>

            {!user && (
              <p className="mt-4 text-[13px] text-[color:var(--faint)]">
                No credit card. Verify your email and you're in.
              </p>
            )}
          </div>

          {/* Task preview */}
          <div className="tk-rise tk-hero-shadow rounded-[22px] border border-[color:var(--border)] bg-[color:var(--surface)] p-5 sm:p-6">
            <div className="flex items-baseline justify-between">
              <span className="text-[14px] font-semibold text-[color:var(--fg)]">
                Today
              </span>

              <span className="tabular-nums text-[12px] text-[color:var(--faint)]">
                2 of 4 done
              </span>
            </div>

            <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--chip)]">
              <div className="h-full w-1/2 rounded-full bg-[#1F8A70]" />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-[10px] border border-[color:var(--border-2)] bg-[color:var(--surface-2)] px-3 py-2">
              <Search size={15} className="text-[color:var(--faint-2)]" />

              <span className="text-[13px] text-[color:var(--faint-2)]">
                Search your tasks
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-[color:var(--btn-bg)] px-3 py-1 text-[12px] font-medium text-[color:var(--btn-fg)]">
                All
              </span>

              <span className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-[12px] text-[color:var(--muted)]">
                Pending
              </span>

              <span className="rounded-full bg-[color:var(--chip)] px-3 py-1 text-[12px] text-[color:var(--muted)]">
                Completed
              </span>
            </div>

            <ul className="mt-4 divide-y divide-[color:var(--divider)]">
              <PreviewRow
                label="Send the invoice to Ardent"
                meta="9:10"
                done
              />
              <PreviewRow
                label="Review Priya's pull request"
                meta="11:40"
                done
              />
              <PreviewRow label="Write the handover doc" meta="Today" />
              <PreviewRow label="Book the team offsite" meta="Thu" />
            </ul>
          </div>
        </section>

        {/* Features section */}
        <section
          id="features"
          className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24"
        >
          <div className="max-w-xl">
            <h2 className="text-[30px] font-semibold tracking-[-0.03em] text-[color:var(--fg)] sm:text-[34px]">
              Everything a personal list needs, nothing it doesn't.
            </h2>

            <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--muted)]">
              Taskly stays out of the way until you need it, then gives you
              exactly enough structure to find what you're looking for.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="tk-lift rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6 transition-shadow duration-150"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[color:var(--accent-soft)] text-[color:var(--accent-ink)]">
                  <Icon size={20} strokeWidth={2} />
                </div>

                <h3 className="mt-4 text-[15px] font-semibold text-[color:var(--fg)]">
                  {title}
                </h3>

                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[color:var(--muted)]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works section */}
        <section
          id="how-it-works"
          className="border-y border-[color:var(--band-border)] bg-[#131A22] py-16 lg:py-24"
        >
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="max-w-xl">
              <h2 className="text-[30px] font-semibold tracking-[-0.03em] text-white sm:text-[34px]">
                From nothing to your first list in three steps.
              </h2>

              <p className="mt-3 text-[15px] leading-relaxed text-white/50">
                No setup wizard, no onboarding tour. Just an account, a code,
                and a place to write things down.
              </p>
            </div>

            <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
              {steps.map(({ n, title, body }) => (
                <div key={n}>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1F8A70] text-[14px] font-semibold text-white">
                    {n}
                  </span>

                  <h3 className="mt-4 text-[15px] font-medium text-white">
                    {title}
                  </h3>

                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/45">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA section */}
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-[28px] bg-[#131A22] px-8 py-14 text-center ring-1 ring-inset ring-[color:var(--cta-ring)] sm:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(31,138,112,0.45) 0%, rgba(19,26,34,0) 70%)",
              }}
            />

            <div className="relative">
              <h2 className="text-[30px] font-semibold tracking-[-0.03em] text-white sm:text-[36px]">
                {user ? "Your list is waiting." : "Start today's list."}
              </h2>

              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/50">
                {user
                  ? "Head back to your dashboard and keep your day organized."
                  : "It takes about a minute to sign up, and one code from your inbox to confirm it's you."}
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {user ? (
                  <Link to="/dashboard" className={ctaBtnLight}>
                    Go to dashboard
                    <ArrowUpRight size={16} strokeWidth={2.2} />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className={ctaBtnLight}>
                      Create your account
                    </Link>

                    <Link
                      to="/login"
                      className="text-[14px] font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
                    >
                      Already have an account? Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingCMP;