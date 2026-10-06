import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Check, KeyRound } from "lucide-react";
import api from "../Axios/Axios.js";
import ErrorMessage from "../Error/Error.jsx";

const recoverySteps = [
    { label: "Enter your account email", meta: "Done", state: "done" },
    { label: "Enter the verification code", meta: "Done", state: "done" },
    { label: "Choose a new password", meta: "Now", state: "active" },
];

const inputClass =
    "h-12 w-full rounded-lg border border-[#dadce0] bg-white pl-3.5 pr-12 text-[15px] text-[#202124] outline-none transition-colors " +
    "placeholder:text-[#80868b] hover:border-[#80868b] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]";

const toggleClass =
    "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#5f6368] transition-colors hover:bg-[#f1f3f4]";

const labelClass = "mb-1.5 block text-[13px] font-medium text-[#5f6368]";

const Wordmark = () => (
    <div className="flex items-center gap-2.5">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#1a73e8] text-white">
            <Check size={16} strokeWidth={3} />
        </div>
        <span className="text-[22px] font-medium tracking-[-0.01em] text-[#5f6368]">
            Taskly
        </span>
    </div>
);

const Step = ({ label, meta, state }) => (
    <li className="flex items-center gap-3.5 py-3">
        <span
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                state === "done"
                    ? "border-[#1a73e8] bg-[#1a73e8] text-white"
                    : state === "active"
                    ? "border-[#1a73e8] bg-white"
                    : "border-[#dadce0]"
            }`}
        >
            {state === "done" && <Check size={12} strokeWidth={3} />}
            {state === "active" && <span className="h-2 w-2 rounded-full bg-[#1a73e8]" />}
        </span>
        <span
            className={`flex-1 text-[14px] ${
                state === "done"
                    ? "text-[#80868b] line-through"
                    : state === "active"
                    ? "text-[#202124]"
                    : "text-[#5f6368]"
            }`}
        >
            {label}
        </span>
        <span className="text-[12px] tabular-nums text-[#80868b]">{meta}</span>
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

    const doneCount = recoverySteps.filter((s) => s.state === "done").length;

    return (
        <div className="min-h-screen bg-white font-['Google_Sans',Roboto,system-ui,-apple-system,'Segoe_UI',Arial,sans-serif] text-[#202124] antialiased">
            <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1fr]">

                {/* ---------------- Brand panel ---------------- */}
                <aside className="hidden flex-col justify-between bg-[#e8f0fe] px-14 py-12 lg:flex">
                    <Wordmark />

                    <div className="max-w-[28rem]">
                        <h2 className="text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
                            Last step. Pick a password you&apos;ll remember.
                        </h2>
                        <p className="mt-4 text-[16px] leading-relaxed text-[#5f6368]">
                            Once it&apos;s saved, you can sign in with it straight away and
                            get back to today&apos;s list.
                        </p>

                        <div
                            aria-hidden="true"
                            className="mt-9 rounded-[28px] bg-white p-6 shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]"
                        >
                            <div className="flex items-baseline justify-between">
                                <span className="text-[20px] font-medium">Account recovery</span>
                                <span className="text-[13px] tabular-nums text-[#5f6368]">
                                    Step {doneCount + 1} of {recoverySteps.length}
                                </span>
                            </div>

                            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#f1f3f4]">
                                <div
                                    className="h-full rounded-full bg-[#1a73e8]"
                                    style={{ width: `${((doneCount + 1) / recoverySteps.length) * 100}%` }}
                                />
                            </div>

                            <ul className="mt-2 divide-y divide-[#dadce0]">
                                {recoverySteps.map((step) => (
                                    <Step key={step.label} {...step} />
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1e8e3e] opacity-60" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1e8e3e]" />
                        </span>
                        <span className="text-[13px] text-[#5f6368]">
                            All systems operational
                        </span>
                    </div>
                </aside>

                {/* ---------------- Form column ---------------- */}
                <div className="flex min-h-screen flex-col px-5 sm:px-8">
                    <header className="flex items-center justify-between py-6 lg:hidden">
                        <Wordmark />
                        <span className="flex items-center gap-1.5 text-[12px] text-[#5f6368]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#1e8e3e]" />
                            Operational
                        </span>
                    </header>

                    <main className="flex flex-1 items-center justify-center py-6 lg:py-10">
                        <div className="w-full max-w-[26rem]">
                            <div className="rounded-[28px] border border-[#dadce0] bg-white p-7 sm:p-10">
                                <div className="mb-6 flex justify-center">
                                    <div className="grid h-14 w-14 place-items-center rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                                        <KeyRound size={26} strokeWidth={1.8} />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h1 className="text-[28px] font-normal tracking-[-0.01em]">
                                        Create a new password
                                    </h1>
                                    <p className="mt-2 text-[15px] text-[#5f6368]">
                                        Choose a strong password for your account.
                                    </p>
                                </div>

                                {error && (
                                    <div className="mt-5">
                                        <ErrorMessage message={error} />
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                    <div>
                                        <label htmlFor="newPassword" className={labelClass}>
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
                                                className={inputClass}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className={toggleClass}
                                                tabIndex={-1}
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </div>
                                        <p className="mt-1.5 text-[12.5px] text-[#80868b]">
                                            Password must be at least 8 characters.
                                        </p>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className={labelClass}>
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
                                                className={inputClass}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                className={toggleClass}
                                                tabIndex={-1}
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={fetching}
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] text-[15px] font-medium text-white transition-colors hover:bg-[#1765cc] hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
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
                                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1a73e8] hover:underline"
                                >
                                    <ArrowLeft size={14} strokeWidth={2.2} />
                                    Back to Login
                                </Link>
                                <p className="text-center text-[12.5px] text-[#80868b]">
                                    Make sure you remember your new password.
                                </p>
                            </div>
                        </div>
                    </main>

                    <footer className="flex flex-col items-center gap-3 py-7 sm:flex-row sm:justify-between">
                        <span className="flex items-center gap-1.5 text-[12px] text-[#5f6368]">
                            <Lock size={12} strokeWidth={2.2} />
                            Secure account recovery
                        </span>
                        <nav className="flex items-center gap-5 text-[12px] text-[#5f6368]">
                            <Link to="/privacy" className="transition-colors hover:text-[#202124]">Privacy</Link>
                            <Link to="/terms" className="transition-colors hover:text-[#202124]">Terms</Link>
                            <Link to="/help" className="transition-colors hover:text-[#202124]">Help</Link>
                        </nav>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordCMP;