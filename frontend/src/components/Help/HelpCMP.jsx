
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowUpRight, ChevronDown, Lock, Search, X } from "lucide-react";

const CONTACT_EMAIL = "dashrathproducts@gmail.com";

const groups = [
    {
        id: "getting-started",
        title: "Getting started",
        items: [
            {
                q: "How do I create an account?",
                a: "Choose Create an account on the sign-in page, then enter your full name, a username, your email address and a password of at least 8 characters. Usernames are 3 to 20 characters and can use letters, numbers and underscores.",
                link: { to: "/register", label: "Create an account" },
            },
            {
                q: "Why do I need to verify my email?",
                a: "We send a 6-digit code to the address you register with so we know it's really yours. Enter the code and you're signed in automatically.",
            },
            {
                q: "I didn't get my verification code.",
                a: "Give it a minute and check your spam folder. If it still hasn't arrived, choose Resend code on the verification page. If you typed the wrong address, choose Go back and register again with the right one.",
            },
        ],
    },
    {
        id: "signing-in",
        title: "Signing in and passwords",
        items: [
            {
                q: "Can I sign in with my username?",
                a: "Yes. The first field on the sign-in page accepts either your username or your email address.",
            },
            {
                q: "I forgot my password.",
                a: "Choose Forgot password? on the sign-in page and enter your email. We'll send you a 6-digit code. Enter it, choose a new password of at least 8 characters, then sign in as usual.",
                link: {
                    to: "/request-password-reset",
                    label: "Reset your password",
                },
            },
            {
                q: "My reset code didn't arrive.",
                a: "Check your spam folder first. Reset codes are only sent to accounts with a verified email address, so if you never finished verifying yours, contact us and we'll help.",
            },
            {
                q: "My code expired or won't work.",
                a: "Codes expire after 10 minutes. Request a new one from the Forgot password page and use the newest email. If the last step says your reset session is invalid, start again from the beginning.",
            },
        ],
    },
    {
        id: "tasks",
        title: "Working with tasks",
        items: [
            {
                q: "How do I add a task?",
                a: "On your dashboard, create a task with a title and an optional description. It's saved to your account and shows up in your list.",
            },
            {
                q: "How do I edit or delete a task?",
                a: "Use the actions on the task's card to change its title or description, or to delete it. Deleted tasks can't be restored.",
            },
            {
                q: "How do I mark a task as done?",
                a: "Toggle its completion status from the task card. You can toggle it back at any time.",
            },
            {
                q: "Can I search, filter or sort my tasks?",
                a: "Yes. Your dashboard lets you search, filter and sort your list. This happens in your browser, so results update instantly.",
            },
            {
                q: "Can I share tasks with other people?",
                a: "Not yet. Taskly is built for personal lists, and every task belongs to a single account that only you can see.",
            },
        ],
    },
    {
        id: "settings",
        title: "Profile and settings",
        items: [
            {
                q: "How do I change my name or username?",
                a: "Open Settings and edit your profile. Usernames are 3 to 20 characters, can use letters, numbers and underscores, and must be unique.",
            },
            {
                q: "How do I add or remove a profile photo?",
                a: "In Settings, upload a JPEG up to 5 MB, or delete your current photo. Other file types aren't supported.",
            },
            {
                q: "How do I change my password?",
                a: "In Settings, enter your current password and choose a new one of at least 8 characters.",
            },
            {
                q: "How do I switch between light and dark mode?",
                a: "Use the theme toggle in Settings. Your choice is saved to your account, so it follows you across devices.",
            },
            {
                q: "Can I change my email address?",
                a: "Not inside the app yet. Contact us from the address on your account and we'll help.",
            },
            {
                q: "How do I delete my account?",
                a: "Account deletion isn't available inside the app yet. Email us from the address on your account and we'll remove it along with your tasks.",
                link: {
                    to: "/privacy",
                    label: "Read the privacy policy",
                },
            },
        ],
    },
    {
        id: "troubleshooting",
        title: "Troubleshooting",
        items: [
            {
                q: "I keep getting signed out.",
                a: "Sign-in sessions expire after a while for security, and signing out clears them. Sign in again to pick up where you left off. If it happens straight away, make sure your browser allows cookies for Taskly.",
            },
            {
                q: "It says I've made too many requests.",
                a: "Taskly limits how quickly requests can be made to protect accounts from abuse, and the sign-in and recovery pages have stricter limits. Wait a few minutes and try again.",
            },
            {
                q: "My photo won't upload.",
                a: "Photos must be JPEG files under 5 MB. Convert or resize the image and try again.",
            },
            {
                q: "A page won't load or shows an error.",
                a: "Refresh the page and try again. If it keeps happening, email us with what you were doing and any message you saw.",
            },
        ],
    },
];

const Wordmark = ({ isDark }) => (
    <div className="flex items-center gap-2.5">
        <div
            className={`grid h-8 w-8 place-items-center rounded-[10px] ${
                isDark
                    ? "bg-white/10 text-white ring-1 ring-inset ring-white/15"
                    : "bg-[#131A22] text-white"
            }`}
        >
            <Lock size={15} strokeWidth={2.2} />
        </div>

        <span
            className={`text-[17px] font-semibold tracking-[-0.02em] ${
                isDark ? "text-white" : "text-[#131A22]"
            }`}
        >
            Taskly
        </span>
    </div>
);

const Faq = ({ item, open, isDark }) => (
    <details
        open={open}
        className={`tk-faq-item border-b last:border-b-0 ${
            isDark ? "border-[#29313B]" : "border-[#EEF0F3]"
        }`}
    >
        <summary
            className={`flex cursor-pointer items-center justify-between gap-4 rounded-md py-4 text-[15px] font-medium leading-snug outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40 ${
                isDark ? "text-white" : "text-[#131A22]"
            }`}
        >
            <span>{item.q}</span>

            <ChevronDown
                size={17}
                strokeWidth={2}
                className={`tk-chev shrink-0 transition-transform duration-200 ${
                    isDark ? "text-[#7F8A98]" : "text-[#8B939D]"
                }`}
            />
        </summary>

        <div
            className={`pb-5 pr-9 text-[14.5px] leading-[1.7] ${
                isDark ? "text-[#A1AAB6]" : "text-[#4A5561]"
            }`}
        >
            <p>{item.a}</p>

            {item.link && (
                <Link
                    to={item.link.to}
                    className={`mt-3 inline-block font-medium underline decoration-[#1F8A70] decoration-2 underline-offset-4 ${
                        isDark ? "text-white" : "text-[#131A22]"
                    }`}
                >
                    {item.link.label}
                </Link>
            )}
        </div>
    </details>
);

const HelpCMP = () => {
    const user = useSelector((state) => state.auth?.user);

    const isDark = user?.preferences?.theme === "dark";

    const [query, setQuery] = useState("");

    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const isSearching = terms.length > 0;

    const visibleGroups = groups
        .map((group) => ({
            ...group,
            items: isSearching
                ? group.items.filter((item) => {
                      const haystack =
                          `${item.q} ${item.a}`.toLowerCase();

                      return terms.every((term) =>
                          haystack.includes(term)
                      );
                  })
                : group.items,
        }))
        .filter((group) => group.items.length > 0);

    const resultCount = visibleGroups.reduce(
        (sum, group) => sum + group.items.length,
        0
    );

    const headingColor = isDark ? "text-white" : "text-[#131A22]";
    const textColor = isDark ? "text-[#A1AAB6]" : "text-[#5B6570]";

    const borderColor = isDark
        ? "border-[#29313B]"
        : "border-[#E2E5E9]";

    const cardColor = isDark ? "bg-[#151B23]" : "bg-white";

    const mutedBackground = isDark ? "bg-[#0B0F14]" : "bg-[#EDEFF2]";

    return (
        <div
            className={`tk-root flex min-h-screen flex-col antialiased transition-colors duration-200 ${
                isDark
                    ? "bg-[#0B0F14] text-white"
                    : "bg-[#EDEFF2] text-[#131A22]"
            }`}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');

                .tk-root {
                    font-family: 'Instrument Sans', ui-sans-serif, system-ui,
                    -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                    font-feature-settings: 'ss01', 'cv01';
                }

                @media (prefers-reduced-motion: no-preference) {
                    html {
                        scroll-behavior: smooth;
                    }
                }

                .tk-faq-item summary {
                    list-style: none;
                }

                .tk-faq-item summary::-webkit-details-marker {
                    display: none;
                }

                .tk-faq-item[open] .tk-chev {
                    transform: rotate(180deg);
                }

                @media (prefers-reduced-motion: reduce) {
                    .tk-chev {
                        transition: none !important;
                    }
                }
            `}</style>

            {/* Header */}
            <header className="mx-auto flex w-full max-w-[58rem] items-center justify-between px-5 py-6 sm:px-8">
                <Link
                    to="/"
                    aria-label="Taskly home"
                    className={`rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2 ${
                        isDark
                            ? "focus-visible:ring-offset-[#0B0F14]"
                            : "focus-visible:ring-offset-[#EDEFF2]"
                    }`}
                >
                    <Wordmark isDark={isDark} />
                </Link>

                {user ? (
                    <Link
                        to="/"
                        className={`inline-flex items-center gap-1 text-[14px] font-medium underline-offset-4 hover:underline ${headingColor}`}
                    >
                        Home
                        <ArrowUpRight size={14} strokeWidth={2.2} />
                    </Link>
                ) : (
                    <Link
                        to="/login"
                        className={`inline-flex items-center gap-1 text-[14px] font-medium underline-offset-4 hover:underline ${headingColor}`}
                    >
                        Sign in
                        <ArrowUpRight size={14} strokeWidth={2.2} />
                    </Link>
                )}
            </header>

            {/* Main content */}
            <main className="mx-auto w-full max-w-[58rem] flex-1 px-5 pb-16 sm:px-8">
                <div className="pt-4 sm:pt-8">
                    <h1
                        className={`text-[34px] font-semibold leading-[1.14] tracking-[-0.03em] sm:text-[40px] ${headingColor}`}
                    >
                        How can we help?
                    </h1>

                    <p
                        className={`mt-3 max-w-[32rem] text-[15px] leading-relaxed ${textColor}`}
                    >
                        Answers about your account, your tasks and your settings.
                    </p>

                    {/* Search */}
                    <div className="relative mt-6 max-w-[32rem]">
                        <label htmlFor="help-search" className="sr-only">
                            Search help
                        </label>

                        <Search
                            size={17}
                            strokeWidth={2}
                            className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${
                                isDark ? "text-[#7F8A98]" : "text-[#9AA3AD]"
                            }`}
                        />

                        <input
                            id="help-search"
                            type="text"
                            autoComplete="off"
                            placeholder="Search for an answer"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className={`w-full rounded-[10px] border py-3 pl-10 pr-10 text-[14.5px] outline-none transition-[border-color,box-shadow] duration-150 focus:border-[#1F8A70] focus:shadow-[0_0_0_3.5px_rgba(31,138,112,0.14)] ${
                                isDark
                                    ? "border-[#29313B] bg-[#151B23] text-white placeholder:text-[#697585]"
                                    : "border-[#DCE0E5] bg-white text-[#131A22] placeholder:text-[#9AA3AD]"
                            }`}
                        />

                        {isSearching && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                aria-label="Clear search"
                                className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 transition-colors ${
                                    isDark
                                        ? "text-[#7F8A98] hover:text-white"
                                        : "text-[#9AA3AD] hover:text-[#3D4753]"
                                }`}
                            >
                                <X size={16} />
                            </button>
                        )}

                        <p className="sr-only" aria-live="polite">
                            {isSearching
                                ? `${resultCount} ${
                                      resultCount === 1 ? "answer" : "answers"
                                  } found`
                                : ""}
                        </p>
                    </div>
                </div>

                {/* Topics and FAQs */}
                <div className="mt-10 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
                    <div className="hidden lg:block">
                        {visibleGroups.length > 0 && (
                            <nav
                                aria-label="Help topics"
                                className="sticky top-8"
                            >
                                <p
                                    className={`text-[13px] font-medium ${headingColor}`}
                                >
                                    Topics
                                </p>

                                <ul
                                    className={`mt-3 border-l ${
                                        isDark
                                            ? "border-[#29313B]"
                                            : "border-[#D3D8DE]"
                                    }`}
                                >
                                    {visibleGroups.map((group) => (
                                        <li key={group.id}>
                                            <a
                                                href={`#${group.id}`}
                                                className={`-ml-px block border-l border-transparent py-1.5 pl-4 text-[13.5px] transition-colors hover:border-[#1F8A70] ${
                                                    isDark
                                                        ? "text-[#A1AAB6] hover:text-white"
                                                        : "text-[#5B6570] hover:text-[#131A22]"
                                                }`}
                                            >
                                                {group.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        )}
                    </div>

                    {visibleGroups.length === 0 ? (
                        <div
                            className={`min-w-0 max-w-[42rem] rounded-[20px] border p-7 shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)] sm:p-10 ${borderColor} ${cardColor}`}
                        >
                            <h2
                                className={`text-[19px] font-semibold tracking-[-0.02em] ${headingColor}`}
                            >
                                No answers match &ldquo;{query.trim()}&rdquo;
                            </h2>

                            <p
                                className={`mt-2 text-[14.5px] leading-[1.7] ${textColor}`}
                            >
                                Try a different word, or email us and we&apos;ll
                                help.
                            </p>

                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className={`mt-5 rounded-[10px] border px-4 py-2.5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2 ${
                                    isDark
                                        ? "border-[#29313B] bg-[#1C242E] text-white hover:bg-[#252F3B] focus-visible:ring-offset-[#151B23]"
                                        : "border-[#DCE0E5] bg-white text-[#131A22] hover:bg-[#F6F7F9] focus-visible:ring-offset-white"
                                }`}
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <article
                            className={`min-w-0 max-w-[42rem] space-y-10 rounded-[20px] border p-7 shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)] sm:p-10 ${borderColor} ${cardColor}`}
                        >
                            {visibleGroups.map((group) => (
                                <section
                                    key={group.id}
                                    id={group.id}
                                    aria-labelledby={`${group.id}-title`}
                                    className="scroll-mt-8"
                                >
                                    <h2
                                        id={`${group.id}-title`}
                                        className={`text-[19px] font-semibold tracking-[-0.02em] ${headingColor}`}
                                    >
                                        {group.title}
                                    </h2>

                                    <div className="mt-2">
                                        {group.items.map((item) => (
                                            <Faq
                                                key={item.q}
                                                item={item}
                                                open={isSearching}
                                                isDark={isDark}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </article>
                    )}
                </div>

                {/* Support section */}
                <div className="relative mt-12 overflow-hidden rounded-[20px] bg-[#131A22] p-7 sm:p-9">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-24 -top-40 h-[420px] w-[420px] rounded-full opacity-[0.55] blur-3xl"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(31,138,112,0.45) 0%, rgba(19,26,34,0) 70%)",
                        }}
                    />

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-white">
                                Still stuck?
                            </h2>

                            <p className="mt-2 max-w-[28rem] text-[14px] leading-relaxed text-white/65">
                                Email us from the address on your account and
                                tell us what happened. Screenshots and any
                                error message help us fix it faster.
                            </p>
                        </div>

                        <a
                            href={`mailto:${CONTACT_EMAIL}?subject=Taskly%20help`}
                            className="inline-flex shrink-0 items-center justify-center rounded-[10px] bg-white px-5 py-3 text-[14.5px] font-medium text-[#131A22] transition-colors duration-150 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2 focus-visible:ring-offset-[#131A22]"
                        >
                            Email support
                        </a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mx-auto flex w-full max-w-[58rem] flex-col items-center gap-3 px-5 py-7 sm:flex-row sm:justify-between sm:px-8">
                <span className={`text-[12px] ${textColor}`}>
                    &copy; {new Date().getFullYear()} Taskly
                </span>

                <nav
                    className={`flex items-center gap-5 text-[12px] ${textColor}`}
                >
                    <Link
                        to="/privacy"
                        className={`transition-colors ${
                            isDark
                                ? "hover:text-white"
                                : "hover:text-[#131A22]"
                        }`}
                    >
                        Privacy
                    </Link>

                    <Link
                        to="/terms"
                        className={`transition-colors ${
                            isDark
                                ? "hover:text-white"
                                : "hover:text-[#131A22]"
                        }`}
                    >
                        Terms
                    </Link>

                    <Link
                        to="/help"
                        aria-current="page"
                        className={`font-medium ${headingColor}`}
                    >
                        Help
                    </Link>
                </nav>
            </footer>
        </div>
    );
};

export default HelpCMP;