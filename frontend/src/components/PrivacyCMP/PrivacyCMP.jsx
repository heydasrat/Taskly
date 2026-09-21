
import { Link } from "react-router-dom";
import { ArrowUpRight, Lock } from "lucide-react";
import { useSelector } from "react-redux";

const CONTACT_EMAIL = "dashrahtproducts@gmail.com";
const LAST_UPDATED = "September 20, 2026";

const toc = [
    { id: "collect", title: "Information we collect" },
    { id: "use", title: "How we use it" },
    { id: "cookies", title: "Cookies and sessions" },
    { id: "sharing", title: "Who we share it with" },
    { id: "retention", title: "How long we keep it" },
    { id: "security", title: "How we protect it" },
    { id: "choices", title: "Your choices" },
    { id: "children", title: "Children" },
    { id: "changes", title: "Changes to this policy" },
    { id: "contact", title: "Contact" },
];

const summary = [
    "Your tasks are only visible to your account.",
    "We don't sell your data or show advertising.",
    "Passwords and email codes are stored hashed, never as plain text.",
    "You can edit most of your data yourself, and email us for the rest.",
];

const collected = [
    { label: "Account details", text: "Your username, full name and email address, which you give us when you register." },
    { label: "Password", text: "Stored only as a bcrypt hash. We can't read it, so if you forget it you reset it instead." },
    { label: "Tasks", text: "The title, optional description, completion status and timestamps of each task you create." },
    { label: "Profile photo", text: "An optional JPEG you upload. It's stored with Cloudinary, and we keep its link and ID on your profile so we can show and remove it." },
    { label: "Preferences", text: "Your light or dark theme choice." },
    { label: "Email codes", text: "One-time codes for verifying your email and resetting your password. They're stored hashed and deleted automatically once they expire." },
    { label: "Sign-in session", text: "Two cookies keep you signed in, and a copy of your refresh token is kept on your account so we can end the session when you sign out." },
    { label: "Network details", text: "Your IP address is used to rate-limit requests and protect Taskly from abuse." },
];

const uses = [
    "create your account and confirm that your email address is yours;",
    "send verification and password reset codes;",
    "sign you in, keep you signed in and sign you out;",
    "store, show and update your tasks and profile;",
    "apply your theme preference;",
    "limit repeated requests and keep the service secure.",
];

const providers = [
    { label: "Cloudinary", text: "Stores and serves your profile photo." },
    { label: "Google (Gmail)", text: "Delivers verification and password reset emails. Your email address and the code in the message pass through Google's mail systems." },
    { label: "MongoDB", text: "Stores your account, task and code records." },
    { label: "Google Fonts", text: "Our pages load the Instrument Sans typeface from Google Fonts, so your browser requests it directly from Google's servers." },
];

const retention = [
    { label: "Account", text: "Kept until you ask us to delete it. See your choices below." },
    { label: "Tasks", text: "Deleting a task removes it from your list and from our database." },
    { label: "Profile photo", text: "Deleting your photo removes it from Cloudinary and clears it from your profile." },
    { label: "Email codes", text: "Deleted automatically after they expire." },
    { label: "Refresh token", text: "Cleared when you sign out or change your password." },
];

const protections = [
    "Passwords and email codes are hashed with bcrypt before they're stored.",
    "Sign-in cookies are HttpOnly, Secure and SameSite=Strict.",
    "Every task request is checked against the signed-in account, so you can only reach your own tasks.",
    "Requests are rate-limited, with a stricter limit on sign-in and recovery routes, and responses carry security headers.",
    "Uploads are limited to 5 MB per file.",
];

const choices = [
    "Update your name and username in Settings.",
    "Upload or delete your profile photo.",
    "Change your password.",
    "Switch between light and dark themes.",
    "Edit or delete any task from your dashboard.",
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

const Code = ({ children, isDark }) => (
    <code
        className={`rounded-md px-1.5 py-0.5 font-mono text-[12.5px] ${
            isDark
                ? "bg-[#29313B] text-[#E5EAF0]"
                : "bg-[#F1F3F5] text-[#131A22]"
        }`}
    >
        {children}
    </code>
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

const PrivacyCMP = () => {
    const user = useSelector((state) => state.auth?.user);
    const isDark = user?.preferences?.theme === "dark";

    const textColor = isDark ? "text-[#A1AAB6]" : "text-[#5B6570]";
    const headingColor = isDark ? "text-white" : "text-[#131A22]";
    const borderColor = isDark ? "border-[#29313B]" : "border-[#EEF0F3]";

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
                        Privacy Policy
                    </h1>
                    <p className={`mt-3 max-w-[32rem] text-[15px] leading-relaxed ${textColor}`}>
                        What Taskly stores about you, why we store it, and the controls you have over it.
                    </p>
                    <p className={`mt-2 text-[13px] ${textColor}`}>
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
                                The full policy follows below. Everything here reflects how Taskly works today.
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
                                            className={`-ml-px block border-l border-transparent py-1.5 pl-4 text-[13.5px] transition-colors hover:border-[#1F8A70] ${textColor} ${
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
                        <Section id="collect" title="Information we collect" isDark={isDark}>
                            <p>
                                We only collect what Taskly needs to work. Here is everything we store and where it comes from.
                            </p>
                            <Rows items={collected} isDark={isDark} />
                        </Section>

                        <Section id="use" title="How we use your information" isDark={isDark}>
                            <p>We use your information to:</p>
                            <Bullets items={uses} />
                            <p>
                                We don&apos;t sell your information, use it for advertising, or build profiles about you.
                            </p>
                        </Section>

                        <Section id="cookies" title="Cookies and sessions" isDark={isDark}>
                            <p>
                                When you sign in, Taskly sets two cookies:{" "}
                                <Code isDark={isDark}>accessToken</Code> and{" "}
                                <Code isDark={isDark}>refreshToken</Code>. Both are HttpOnly, so scripts running on the page can&apos;t read them. They are also Secure, so they&apos;re only sent over HTTPS, and SameSite=Strict, so browsers don&apos;t attach them to requests that start on other sites. Signing out clears both.
                            </p>
                            <p>
                                These cookies are strictly necessary to keep you signed in. We don&apos;t use advertising or analytics cookies.
                            </p>
                        </Section>

                        <Section id="sharing" title="Who we share it with" isDark={isDark}>
                            <p>
                                We share information only with the services that help us run Taskly, and only what each one needs to do its job.
                            </p>
                            <Rows items={providers} isDark={isDark} />
                            <p>We may also disclose information when the law requires it.</p>
                        </Section>

                        <Section id="retention" title="How long we keep it" isDark={isDark}>
                            <p>
                                We keep information only as long as it&apos;s useful to you or needed to run Taskly.
                            </p>
                            <Rows items={retention} isDark={isDark} />
                        </Section>

                        <Section id="security" title="How we protect it" isDark={isDark}>
                            <Bullets items={protections} />
                            <p>
                                No system is perfectly secure, so we can&apos;t promise absolute protection. A strong, unique password and signing out on shared devices help keep your account safe.
                            </p>
                        </Section>

                        <Section id="choices" title="Your choices" isDark={isDark}>
                            <p>You can manage most of your information yourself:</p>
                            <Bullets items={choices} />
                            <p>
                                Account deletion isn&apos;t available inside the app yet. To have your account and everything attached to it removed, or to get a copy of your data, email{" "}
                                <MailLink isDark={isDark} /> from the address on your account.
                            </p>
                            <p>
                                Depending on where you live, you may have additional rights under local privacy laws. Get in touch and we&apos;ll do our best to help.
                            </p>
                        </Section>

                        <Section id="children" title="Children" isDark={isDark}>
                            <p>
                                Taskly isn&apos;t directed at children under 13, and we don&apos;t knowingly collect information from them. If you think a child has created an account, email us and we&apos;ll remove it.
                            </p>
                        </Section>

                        <Section id="changes" title="Changes to this policy" isDark={isDark}>
                            <p>
                                When we change how Taskly handles your information, we&apos;ll update this page and the &ldquo;Last updated&rdquo; date at the top.
                            </p>
                        </Section>

                        <Section id="contact" title="Contact" isDark={isDark}>
                            <p>
                                Questions about this policy or your data? Email{" "}
                                <MailLink isDark={isDark} />.
                            </p>
                        </Section>
                    </article>
                </div>
            </main>

            <footer className="mx-auto flex w-full max-w-[58rem] flex-col items-center gap-3 px-5 py-7 sm:flex-row sm:justify-between sm:px-8">
                <span className={`text-[12px] ${textColor}`}>
                    &copy; {new Date().getFullYear()} Taskly
                </span>
                <nav className={`flex items-center gap-5 text-[12px] ${textColor}`}>
                    <Link
                        to="/privacy"
                        aria-current="page"
                        className={`font-medium ${headingColor}`}
                    >
                        Privacy
                    </Link>
                    <Link
                        to="/terms"
                        className={`transition-colors ${
                            isDark ? "hover:text-white" : "hover:text-[#131A22]"
                        }`}
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

export default PrivacyCMP;