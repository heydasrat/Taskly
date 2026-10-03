import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowUp, ChevronRight, Lock } from "lucide-react";

const CONTACT_EMAIL = "your-email@example.com";

const productColumn = {
    title: "Product",
    links: [
        { label: "Features", href: "/#features" },
        { label: "How it works", href: "/#how-it-works" },
        { label: "About", to: "/about" },
    ],
};

const supportColumn = {
    title: "Support",
    links: [
        { label: "Help center", to: "/help" },
        { label: "Contact us", href: `mailto:${CONTACT_EMAIL}` },
    ],
};

const legalColumn = {
    title: "Legal",
    links: [
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Terms of Service", to: "/terms" },
    ],
};

const signedInColumns = [
    {
        title: "Workspace",
        links: [
            { label: "Dashboard", to: "/dashboard" },
            { label: "Settings", to: "/setting" },
        ],
    },
    productColumn,
    supportColumn,
    legalColumn,
];

const signedOutColumns = [
    productColumn,
    {
        title: "Account",
        links: [
            { label: "Sign in", to: "/login" },
            { label: "Create an account", to: "/register" },
            { label: "Reset password", to: "/request-password-reset" },
        ],
    },
    supportColumn,
    legalColumn,
];

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--f-bg)]";

const Wordmark = () => (
    <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-[10px] bg-[color:var(--f-mark-bg)] text-white ring-1 ring-inset ring-[color:var(--f-mark-ring)]">
            <Lock size={15} strokeWidth={2.2} />
        </div>
        <span className="text-[17px] font-semibold tracking-[-0.02em] text-[color:var(--f-fg)]">Taskly</span>
    </div>
);

const FooterLink = ({ link }) => {
    const className = `rounded text-[13.5px] text-[color:var(--f-link)] transition-colors hover:text-[color:var(--f-fg)] ${focusRing}`;

    if (link.to) {
        return (
            <Link to={link.to} className={className}>
                {link.label}
            </Link>
        );
    }

    return (
        <a href={link.href} className={className}>
            {link.label}
        </a>
    );
};

const AccountChip = ({ user }) => {
    const displayName = user.fullName || user.username || "Your account";
    const handle = user.fullName && user.username ? `@${user.username}` : "Signed in";
    const avatarUrl = user.avatar?.url;

    return (
        <Link
            to="/setting"
            aria-label={`Account settings for ${displayName}`}
            className={`mt-6 flex max-w-[20rem] items-center gap-3 rounded-2xl bg-[color:var(--f-surface)] p-3 ring-1 ring-inset ring-[color:var(--f-ring)] transition-colors hover:bg-[color:var(--f-surface-hover)] ${focusRing}`}
        >
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt=""
                    loading="lazy"
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
            ) : (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1F8A70] text-[15px] font-semibold text-white">
                    {displayName.charAt(0).toUpperCase()}
                </span>
            )}
            <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium text-[color:var(--f-fg)]">{displayName}</span>
                <span className="block truncate text-[12.5px] text-[color:var(--f-faint)]">{handle}</span>
            </span>
            <ChevronRight size={16} strokeWidth={2} className="shrink-0 text-[color:var(--f-chevron)]" />
        </Link>
    );
};

const FooterCMP = () => {
    const user = useSelector((state) => state.auth?.user);

    const isDark = user?.preferences?.theme === "dark";

    const columns = user ? signedInColumns : signedOutColumns;

    const scrollToTop = () => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    };

    return (
        <footer
            data-theme={isDark ? "dark" : "light"}
            style={{ colorScheme: isDark ? "dark" : "light" }}
            className="tk-footer relative mt-auto overflow-hidden border-t border-[color:var(--f-border)] bg-[color:var(--f-bg)] text-[color:var(--f-fg)] antialiased"
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
                .tk-footer{
                    --f-bg:#FFFFFF;
                    --f-border:#E2E5E9;
                    --f-fg:#131A22;
                    --f-link:#5B6570;
                    --f-faint:#6B7480;
                    --f-surface:#F7F8F9;
                    --f-surface-hover:#F0F2F4;
                    --f-ring:#E2E5E9;
                    --f-mark-bg:#131A22;
                    --f-mark-ring:transparent;
                    --f-btn-bg:#131A22;
                    --f-btn-fg:#FFFFFF;
                    --f-btn-hover:#1F2A38;
                    --f-chevron:#9AA3AD;
                    --f-glow:0;
                    font-family:'Instrument Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
                    font-feature-settings:'ss01','cv01';
                }
                .tk-footer[data-theme="dark"]{
                    --f-bg:#131A22;
                    --f-border:rgba(255,255,255,.10);
                    --f-fg:#FFFFFF;
                    --f-link:rgba(255,255,255,.60);
                    --f-faint:rgba(255,255,255,.50);
                    --f-surface:rgba(255,255,255,.04);
                    --f-surface-hover:rgba(255,255,255,.07);
                    --f-ring:rgba(255,255,255,.10);
                    --f-mark-bg:rgba(255,255,255,.10);
                    --f-mark-ring:rgba(255,255,255,.15);
                    --f-btn-bg:#FFFFFF;
                    --f-btn-fg:#131A22;
                    --f-btn-hover:rgba(255,255,255,.90);
                    --f-chevron:rgba(255,255,255,.40);
                    --f-glow:.55;
                }
            `}</style>

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-40 -left-24 h-[420px] w-[420px] rounded-full opacity-[var(--f-glow)] blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(31,138,112,0.45) 0%, rgba(19,26,34,0) 70%)" }}
            />

            <div className="relative mx-auto w-full max-w-[72rem] px-5 pb-8 pt-14 sm:px-8">
                <div className="grid gap-12 xl:grid-cols-[1.2fr_2.8fr] xl:gap-16">
                    <div>
                        <Link
                            to={user ? "/dashboard" : "/"}
                            aria-label="Taskly home"
                            className={`inline-block rounded-lg ${focusRing}`}
                        >
                            <Wordmark />
                        </Link>
                        <p className="mt-4 max-w-[19rem] text-[14px] leading-relaxed text-[color:var(--f-link)]">
                            Built for keeping one list, well.
                        </p>

                        {user ? (
                            <AccountChip user={user} />
                        ) : (
                            <div className="mt-6">
                                <Link
                                    to="/register"
                                    className={`inline-flex items-center justify-center rounded-[10px] bg-[color:var(--f-btn-bg)] px-5 py-2.5 text-[14px] font-medium text-[color:var(--f-btn-fg)] transition-colors duration-150 hover:bg-[color:var(--f-btn-hover)] ${focusRing}`}
                                >
                                    Create your account
                                </Link>
                                <p className="mt-3 text-[12.5px] text-[color:var(--f-faint)]">
                                    Signing up takes about a minute.
                                </p>
                            </div>
                        )}
                    </div>

                    <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
                        {columns.map((column) => (
                            <div key={column.title}>
                                <h2 className="text-[13px] font-medium text-[color:var(--f-fg)]">{column.title}</h2>
                                <ul className="mt-4 space-y-3">
                                    {column.links.map((link) => (
                                        <li key={link.label}>
                                            <FooterLink link={link} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </div>

                <div className="mt-14 flex flex-col gap-4 border-t border-[color:var(--f-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[12.5px] text-[color:var(--f-faint)]">
                        &copy; {new Date().getFullYear()} Taskly. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--f-surface)] px-3 py-1.5 ring-1 ring-inset ring-[color:var(--f-ring)]">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1F8A70] opacity-60 motion-reduce:animate-none" />
                                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#1F8A70]" />
                            </span>
                            <span className="text-[12px] text-[color:var(--f-link)]">All systems operational</span>
                        </div>
                        <button
                            type="button"
                            onClick={scrollToTop}
                            className={`inline-flex items-center gap-1.5 rounded-md text-[12.5px] text-[color:var(--f-link)] transition-colors hover:text-[color:var(--f-fg)] ${focusRing}`}
                        >
                            <ArrowUp size={13} strokeWidth={2.2} />
                            Back to top
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterCMP;