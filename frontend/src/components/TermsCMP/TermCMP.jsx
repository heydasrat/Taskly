
import { Link } from "react-router-dom";
import { ArrowUpRight, Lock } from "lucide-react";
import { useSelector } from "react-redux";

const CONTACT_EMAIL = "dashrathproduct@gmail.com";
const LAST_UPDATED = "September 20, 2026";

const toc = [
    { id: "agreement", title: "Agreeing to these terms" },
    { id: "service", title: "What Taskly is" },
    { id: "account", title: "Your account" },
    { id: "content", title: "Your content" },
    { id: "acceptable", title: "Acceptable use" },
    { id: "availability", title: "Availability and changes" },
    { id: "ending", title: "Ending your account" },
    { id: "warranty", title: "No warranties" },
    { id: "liability", title: "Limit of liability" },
    { id: "changes", title: "Changes to these terms" },
    { id: "contact", title: "Contact" },
];

const summary = [
    "Taskly is a personal task manager, with one account per person.",
    "Keep your password and codes to yourself. You're responsible for your account.",
    "Your tasks and photo stay yours. We only use them to run Taskly for you.",
    "Taskly is provided as is, so keep a copy of anything you can't afford to lose.",
];

const accountRules = [
    {
        label: "Accurate details",
        text: "Use a real email address and keep your details up to date. Usernames are 3 to 20 characters long: lowercase letters, numbers and underscores.",
    },
    {
        label: "Verification",
        text: "Confirm your email with the 6-digit code we send you before you start using your account.",
    },
    {
        label: "Password",
        text: "Choose one with at least 8 characters and keep it to yourself.",
    },
    {
        label: "Codes",
        text: "Don't share verification or reset codes. Anyone who has one can act on your account.",
    },
    {
        label: "Responsibility",
        text: "You're responsible for what happens under your account. Tell us straight away if you think someone else has access.",
    },
    {
        label: "Age and use",
        text: "Each account is for one person, and you must be at least 13 to have one.",
    },
];

const dontDo = [
    "break the law or infringe someone else's rights;",
    "try to reach another person's account, tasks or data;",
    "probe, overload or attack Taskly, including by getting around its rate limits or sending automated requests at scale;",
    "upload files that contain malware or unlawful material;",
    "use the verification or reset flows to send emails to addresses you don't own;",
    "pretend to be someone else when you create an account.",
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

const Point = ({ children, delay }) => (
    <li
        className="tk-rise flex items-start gap-3 py-3"
        style={{ animationDelay: `${delay}ms` }}
    >
        <span className="mt-px grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md bg-[#1F8A70] text-white">
            <svg
                viewBox="0 0 16 16"
                className="tk-check h-3 w-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animationDelay: `${delay + 260}ms` }}
            >
                <path d="M3.5 8.4 6.4 11.3 12.5 4.9" />
            </svg>
        </span>
        <span className="text-[14px] leading-snug text-white/80">
            {children}
        </span>
    </li>
);

const Section = ({ id, title, children, isDark }) => (
    <section
        id={id}
        aria-labelledby={`${id}-title`}
        className="scroll-mt-8 py-9 first:pt-0 last:pb-0"
    >
        <h2
            id={`${id}-title`}
            className={`text-[19px] font-semibold tracking-[-0.02em] ${
                isDark ? "text-white" : "text-[#131A22]"
            }`}
        >
            {title}
        </h2>
        <div
            className={`mt-3 space-y-4 text-[14.5px] leading-[1.7] ${
                isDark ? "text-[#A1AAB6]" : "text-[#4A5561]"
            }`}
        >
            {children}
        </div>
    </section>
);

const Rows = ({ items, isDark }) => (
    <dl
        className={`divide-y rounded-xl border ${
            isDark
                ? "divide-[#29313B] border-[#29313B]"
                : "divide-[#EEF0F3] border-[#E9ECEF]"
        }`}
    >
        {items.map(({ label, text }) => (
            <div
                key={label}
                className="grid gap-1 px-4 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
                <dt
                    className={`text-[13.5px] font-medium ${
                        isDark ? "text-white" : "text-[#131A22]"
                    }`}
                >
                    {label}
                </dt>
                <dd
                    className={`text-[14px] leading-relaxed ${
                        isDark ? "text-[#A1AAB6]" : "text-[#4A5561]"
                    }`}
                >
                    {text}
                </dd>
            </div>
        ))}
    </dl>
);

const Bullets = ({ items }) => (
    <ul className="space-y-2">
        {items.map((item) => (
            <li key={item} className="flex gap-3">
                <span className="mt-[0.65rem] h-1 w-1 shrink-0 rounded-full bg-[#1F8A70]" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const InlineLink = ({ to, children, isDark }) => (
    <Link
        to={to}
        className={`font-medium underline decoration-[#1F8A70] decoration-2 underline-offset-4 ${
            isDark ? "text-white" : "text-[#131A22]"
        }`}
    >
        {children}
    </Link>
);

const MailLink = ({ isDark }) => (
    <a
        href={`mailto:${CONTACT_EMAIL}`}
        className={`font-medium underline decoration-[#1F8A70] decoration-2 underline-offset-4 ${
            isDark ? "text-white" : "text-[#131A22]"
        }`}
    >
        {CONTACT_EMAIL}
    </a>
);

const TermCMP = () => {
    const user = useSelector((state) => state.auth?.user);
    const isDark = user?.preferences?.theme === "dark";

    const headingColor = isDark ? "text-white" : "text-[#131A22]";
    const mutedColor = isDark ? "text-[#A1AAB6]" : "text-[#5B6570]";

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
                .tk-root{font-family:'Instrument Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-feature-settings:'ss01','cv01';}
                @media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
                @keyframes tk-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
                .tk-rise{animation:tk-rise .6s cubic-bezier(.22,.68,.28,1) both}
                @keyframes tk-draw{to{stroke-dashoffset:0}}
                .tk-check path{stroke-dasharray:22;stroke-dashoffset:22;animation:tk-draw .45s ease-out both}
                @media (prefers-reduced-motion:reduce){
                    .tk-rise,.tk-check path{animation:none!important}
                    .tk-check path{stroke-dashoffset:0}
                }
            `}</style>

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

            <main className="mx-auto w-full max-w-[58rem] flex-1 px-5 pb-16 sm:px-8">
                <div className="pt-4 sm:pt-8">
                    <h1
                        className={`text-[34px] font-semibold leading-[1.14] tracking-[-0.03em] sm:text-[40px] ${headingColor}`}
                    >
                        Terms of Service
                    </h1>

                    <p className={`mt-3 max-w-[32rem] text-[15px] leading-relaxed ${mutedColor}`}>
                        The ground rules for using Taskly: what you can expect from us and what we expect from you.
                    </p>

                    <p className={`mt-2 text-[13px] ${mutedColor}`}>
                        Last updated {LAST_UPDATED}
                    </p>
                </div>

                <div className="relative mt-8 overflow-hidden rounded-[20px] bg-[#131A22] p-7 sm:p-9">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-24 -top-40 h-[420px] w-[420px] rounded-full opacity-[0.55] blur-3xl"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(31,138,112,0.45) 0%, rgba(19,26,34,0) 70%)",
                        }}
                    />

                    <div className="relative grid gap-6 md:grid-cols-[1fr_1.5fr] md:gap-10">
                        <div>
                            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-white">
                                The short version
                            </h2>
                            <p className="mt-2 text-[14px] leading-relaxed text-white/45">
                                The full terms follow below. They apply to everyone who uses Taskly.
                            </p>
                        </div>

                        <ul className="divide-y divide-white/[0.06]">
                            {summary.map((item, index) => (
                                <Point key={item} delay={160 + index * 120}>
                                    {item}
                                </Point>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
                    <nav aria-label="On this page" className="hidden lg:block">
                        <div className="sticky top-8">
                            <p className={`text-[13px] font-medium ${headingColor}`}>
                                On this page
                            </p>

                            <ul
                                className={`mt-3 border-l ${
                                    isDark ? "border-[#29313B]" : "border-[#D3D8DE]"
                                }`}
                            >
                                {toc.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            className={`-ml-px block border-l border-transparent py-1.5 pl-4 text-[13.5px] transition-colors hover:border-[#1F8A70] ${mutedColor} ${
                                                isDark
                                                    ? "hover:text-white"
                                                    : "hover:text-[#131A22]"
                                            }`}
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>

                    <article
                        className={`min-w-0 max-w-[42rem] divide-y rounded-[20px] p-7 shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)] sm:p-10 ${
                            isDark
                                ? "divide-[#29313B] border border-[#29313B] bg-[#151B23]"
                                : "divide-[#EEF0F3] border border-[#E2E5E9] bg-white"
                        }`}
                    >
                        <Section id="agreement" title="Agreeing to these terms" isDark={isDark}>
                            <p>
                                By creating a Taskly account or using the service, you agree to these terms and to our{" "}
                                <InlineLink to="/privacy" isDark={isDark}>
                                    Privacy Policy
                                </InlineLink>
                                , which explains what we store and why.
                            </p>
                            <p>If you don&apos;t agree, please don&apos;t use Taskly.</p>
                        </Section>

                        <Section id="service" title="What Taskly is" isDark={isDark}>
                            <p>
                                Taskly is a personal task manager. You can create tasks with a title and an optional description, edit them, mark them complete, delete them, and manage your profile and theme.
                            </p>
                            <p>
                                Every account is for one person. Taskly doesn&apos;t offer shared tasks, teams or admin roles.
                            </p>
                        </Section>

                        <Section id="account" title="Your account" isDark={isDark}>
                            <p>To use Taskly you need an account, and we ask that you:</p>
                            <Rows items={accountRules} isDark={isDark} />
                        </Section>

                        <Section id="content" title="Your content" isDark={isDark}>
                            <p>
                                Your tasks, descriptions and profile photo belong to you. By adding them to Taskly you give us permission to store, process and display them to you, and only as far as we need to in order to run the service.
                            </p>
                            <p>
                                Only add content you have the right to use. Profile photos must be JPEG files of up to 5 MB.
                            </p>
                        </Section>

                        <Section id="acceptable" title="Acceptable use" isDark={isDark}>
                            <p>Please don&apos;t use Taskly to:</p>
                            <Bullets items={dontDo} />
                            <p>
                                If we see activity that breaks these rules, we may limit or suspend the account involved.
                            </p>
                        </Section>

                        <Section id="availability" title="Availability and changes" isDark={isDark}>
                            <p>
                                We work to keep Taskly running smoothly, but we can&apos;t promise it will always be uninterrupted or free of errors.
                            </p>
                            <p>
                                To protect the service we rate-limit requests, with a stricter limit on sign-in and recovery, so unusually fast or repeated activity may be blocked for a while. We may also add, change or remove features as Taskly evolves.
                            </p>
                        </Section>

                        <Section id="ending" title="Ending your account" isDark={isDark}>
                            <p>
                                You can stop using Taskly whenever you like. To have your account deleted, email{" "}
                                <MailLink isDark={isDark} />. The{" "}
                                <InlineLink to="/privacy" isDark={isDark}>
                                    Privacy Policy
                                </InlineLink>{" "}
                                explains what is removed.
                            </p>
                            <p>
                                We may suspend or close an account that breaks these terms or puts Taskly or other people at risk. Sections that are meant to outlast your account, such as No warranties and Limit of liability, keep applying after it ends.
                            </p>
                        </Section>

                        <Section id="warranty" title="No warranties" isDark={isDark}>
                            <p>
                                Taskly is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;, without warranties of any kind, express or implied, to the extent the law allows. We don&apos;t promise that it will meet every need or that it will be free of errors.
                            </p>
                            <p>
                                Keep a separate copy of any information you can&apos;t afford to lose.
                            </p>
                        </Section>

                        <Section id="liability" title="Limit of liability" isDark={isDark}>
                            <p>
                                To the extent the law allows, Taskly and the people who run it aren&apos;t liable for indirect, incidental or consequential losses, or for lost data, that arise from your use of Taskly.
                            </p>
                            <p>
                                Nothing in these terms limits any right you have under the law that can&apos;t be limited.
                            </p>
                        </Section>

                        <Section id="changes" title="Changes to these terms" isDark={isDark}>
                            <p>
                                When we change these terms, we&apos;ll update this page and the &ldquo;Last updated&rdquo; date at the top. If you keep using Taskly after a change, you accept the updated terms.
                            </p>
                        </Section>

                        <Section id="contact" title="Contact" isDark={isDark}>
                            <p>
                                Questions about these terms? Email{" "}
                                <MailLink isDark={isDark} />.
                            </p>
                        </Section>
                    </article>
                </div>
            </main>

            <footer className="mx-auto flex w-full max-w-[58rem] flex-col items-center gap-3 px-5 py-7 sm:flex-row sm:justify-between sm:px-8">
                <span className={`text-[12px] ${mutedColor}`}>
                    &copy; {new Date().getFullYear()} Taskly
                </span>

                <nav className={`flex items-center gap-5 text-[12px] ${mutedColor}`}>
                    <Link
                        to="/privacy"
                        className={`transition-colors ${
                            isDark ? "hover:text-white" : "hover:text-[#131A22]"
                        }`}
                    >
                        Privacy
                    </Link>

                    <Link
                        to="/terms"
                        aria-current="page"
                        className={`font-medium ${headingColor}`}
                    >
                        Terms
                    </Link>

                    <Link
                        to="/help"
                        className={`transition-colors ${
                            isDark ? "hover:text-white" : "hover:text-[#131A22]"
                        }`}
                    >
                        Help
                    </Link>
                </nav>
            </footer>
        </div>
    );
};

export default TermCMP;