import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import api from "../Axios/Axios.js";
import ErrorMessage from "../Error/Error.jsx";

const Wordmark = ({ tone = "dark" }) => (
    <div className="flex items-center gap-2.5">
        <div
            className={`w-8 h-8 rounded-[10px] grid place-items-center ${
                tone === "dark"
                    ? "bg-white/10 text-white ring-1 ring-inset ring-white/15"
                    : "bg-[#131A22] text-white"
            }`}
        >
            <Lock size={15} strokeWidth={2.2} />
        </div>
        <span
            className={`text-[17px] font-semibold tracking-[-0.02em] ${
                tone === "dark" ? "text-white" : "text-[#131A22]"
            }`}
        >
            Taskly
        </span>
    </div>
);

const Step = ({ label, meta, state, delay }) => (
    <li
        className="tk-rise flex items-center gap-3 py-2.5"
        style={{ animationDelay: `${delay}ms` }}
    >
        <span
            className={`w-[18px] h-[18px] shrink-0 rounded-md grid place-items-center ${
                state === "upcoming"
                    ? "ring-1 ring-inset ring-white/25"
                    : "bg-[#1F8A70] text-white"
            }`}
        >
            {state === "done" && (
                <svg
                    viewBox="0 0 16 16"
                    className="tk-check w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animationDelay: `${delay + 260}ms` }}
                >
                    <path d="M3.5 8.4 6.4 11.3 12.5 4.9" />
                </svg>
            )}
            {state === "active" && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
        </span>
        <span
            className={`flex-1 text-[13.5px] leading-snug ${
                state === "done"
                    ? "text-white/35 line-through decoration-white/25"
                    : state === "active"
                    ? "text-white/90"
                    : "text-white/50"
            }`}
        >
            {label}
        </span>
        <span className="text-[11.5px] text-white/35 tabular-nums">{meta}</span>
    </li>
);

const ResetPasswordCMP = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const resetToken = location.state?.resetToken;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!resetToken) {
            setError("Password reset session is invalid. Please request a new reset code.");
            return;
        }

        if (!newPassword.trim()) {
            setError("Please enter a new password.");
            return;
        }

        if (!confirmPassword.trim()) {
            setError("Please confirm your new password.");
            return;
        }

        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        try {
            setFetching(true);
            const response = await api.patch("/auth/reset-password", {
                resetToken,
                newPassword,
                confirmPassword,
            });
            if (response.data.success) {
                navigate("/login");
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setFetching(false);
        }
    };

    const inputBase =
        "w-full rounded-[10px] bg-white py-3 pl-3.5 pr-11 text-[14.5px] text-[#131A22] placeholder:text-[#9AA3AD] " +
        "border border-[#DCE0E5] outline-none transition-[border-color,box-shadow] duration-150 " +
        "focus:border-[#1F8A70] focus:shadow-[0_0_0_3.5px_rgba(31,138,112,0.14)]";

    const toggleBase =
        "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#9AA3AD] transition-colors hover:text-[#3D4753]";

    return (
        <div className="tk-root min-h-screen bg-[#EDEFF2] text-[#131A22] antialiased">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
                .tk-root{font-family:'Instrument Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-feature-settings:'ss01','cv01';}
                @keyframes tk-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
                .tk-rise{animation:tk-rise .6s cubic-bezier(.22,.68,.28,1) both}
                @keyframes tk-draw{to{stroke-dashoffset:0}}
                .tk-check path{stroke-dasharray:22;stroke-dashoffset:22;animation:tk-draw .45s ease-out both}
                @keyframes tk-grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}
                .tk-bar{transform-origin:left;animation:tk-grow 1s cubic-bezier(.22,.68,.28,1) .55s both}
                @media (prefers-reduced-motion:reduce){
                    .tk-rise,.tk-bar,.tk-check path{animation:none!important}
                    .tk-check path{stroke-dashoffset:0}
                }
            `}</style>

            <div className="min-h-screen lg:grid lg:grid-cols-[1.02fr_1fr]">
                <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#131A22] px-14 py-12">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-40 -left-24 h-[460px] w-[460px] rounded-full opacity-[0.55] blur-3xl"
                        style={{ background: "radial-gradient(circle, rgba(31,138,112,0.45) 0%, rgba(19,26,34,0) 70%)" }}
                    />

                    <div className="relative">
                        <Wordmark tone="dark" />
                    </div>

                    <div className="relative max-w-[26rem]">
                        <h2 className="text-[34px] leading-[1.14] font-semibold tracking-[-0.03em] text-white">
                            Last step. Pick a password you&apos;ll remember.
                        </h2>
                        <p className="mt-4 text-[14.5px] leading-relaxed text-white/45">
                            Once it&apos;s saved, you can sign in with it straight away and
                            get back to today&apos;s list.
                        </p>

                        <div className="tk-rise mt-9 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
                            <div className="flex items-baseline justify-between">
                                <span className="text-[13px] font-medium text-white/85">Account recovery</span>
                                <span className="text-[12px] text-white/40 tabular-nums">Step 3 of 3</span>
                            </div>

                            <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                                <div className="tk-bar h-full w-full rounded-full bg-[#1F8A70]" />
                            </div>

                            <ul className="mt-2 divide-y divide-white/[0.06]">
                                <Step label="Enter your account email" meta="Done" state="done" delay={220} />
                                <Step label="Enter the verification code" meta="Done" state="done" delay={340} />
                                <Step label="Choose a new password" meta="Now" state="active" delay={460} />
                            </ul>
                        </div>
                    </div>

                    <div className="relative flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1F8A70] opacity-60" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#1F8A70]" />
                        </span>
                        <span className="text-[12px] text-white/40">All systems operational</span>
                    </div>
                </aside>

                <div className="flex min-h-screen flex-col px-5 sm:px-8">
                    <header className="flex items-center justify-between py-6 lg:hidden">
                        <Wordmark tone="light" />
                        <span className="flex items-center gap-1.5 text-[12px] text-[#6B7480]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#1F8A70]" />
                            Operational
                        </span>
                    </header>

                    <main className="flex flex-1 items-center justify-center py-6 lg:py-10">
                        <div className="w-full max-w-[26rem]">
                            <div className="rounded-[20px] border border-[#E2E5E9] bg-white p-7 sm:p-9 shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)]">
                                <div className="mb-6 flex justify-center">
                                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[#1F8A70]/10 text-[#1F8A70]">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.8}
                                            stroke="currentColor"
                                            className="h-7 w-7"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 0h10.5A1.75 1.75 0 0 1 19 12.25v7A1.75 1.75 0 0 1 17.25 21h-10.5A1.75 1.75 0 0 1 5 19.25v-7a1.75 1.75 0 0 1 1.75-1.75Z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h1 className="text-[27px] font-semibold tracking-[-0.03em] text-[#131A22]">
                                        Create a new password
                                    </h1>
                                    <p className="mt-1.5 text-[14px] text-[#6B7480]">
                                        Choose a strong password for your account.
                                    </p>
                                </div>

                                {error && (
                                    <div className="mt-5">
                                        <ErrorMessage message={error} />
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                                    <div>
                                        <label
                                            htmlFor="newPassword"
                                            className="mb-1.5 block text-[13px] font-medium text-[#3D4753]"
                                        >
                                            New password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                autoFocus
                                                autoComplete="new-password"
                                                placeholder="Enter your new password"
                                                value={newPassword}
                                                onChange={(e) => {
                                                    setNewPassword(e.target.value);
                                                    setError("");
                                                }}
                                                className={inputBase}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className={toggleBase}
                                                tabIndex={-1}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                                            </button>
                                        </div>
                                        <p className="mt-1.5 text-[12.5px] text-[#8B939D]">
                                            Password must be at least 8 characters.
                                        </p>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="confirmPassword"
                                            className="mb-1.5 block text-[13px] font-medium text-[#3D4753]"
                                        >
                                            Confirm password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                autoComplete="new-password"
                                                placeholder="Confirm your new password"
                                                value={confirmPassword}
                                                onChange={(e) => {
                                                    setConfirmPassword(e.target.value);
                                                    setError("");
                                                }}
                                                className={inputBase}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                className={toggleBase}
                                                tabIndex={-1}
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={fetching}
                                        className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#131A22] py-3 text-[14.5px] font-medium text-white
                                            shadow-[0_1px_2px_rgba(19,26,34,0.25)] transition-colors duration-150
                                            hover:bg-[#1F2A38] active:bg-[#0D1621]
                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2
                                            disabled:cursor-not-allowed disabled:opacity-55"
                                    >
                                        {fetching && (
                                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
                                            </svg>
                                        )}
                                        {fetching ? "Updating..." : "Reset Password"}
                                    </button>
                                </form>
                            </div>

                            <div className="mt-6 flex flex-col items-center gap-3">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#131A22] underline-offset-4 hover:underline"
                                >
                                    <ArrowLeft size={14} strokeWidth={2.2} />
                                    Back to Login
                                </Link>
                                <p className="text-center text-[12.5px] text-[#8B939D]">
                                    Make sure you remember your new password.
                                </p>
                            </div>
                        </div>
                    </main>

                    <footer className="flex flex-col items-center gap-3 py-7 sm:flex-row sm:justify-between">
                        <span className="flex items-center gap-1.5 text-[12px] text-[#8B939D]">
                            <Lock size={12} strokeWidth={2.2} />
                            Secure account recovery
                        </span>
                        <nav className="flex items-center gap-5 text-[12px] text-[#8B939D]">
                            <Link to="/privacy" className="transition-colors hover:text-[#131A22]">Privacy</Link>
                            <Link to="/terms" className="transition-colors hover:text-[#131A22]">Terms</Link>
                            <Link to="/help" className="transition-colors hover:text-[#131A22]">Help</Link>
                        </nav>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordCMP;