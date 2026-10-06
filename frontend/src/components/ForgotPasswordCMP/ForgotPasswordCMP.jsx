import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Check } from "lucide-react";
import api from "../Axios/Axios.js";
import ErrorMessage from "../Error/Error.jsx";

const recoverySteps = [
    { label: "Enter your account email", meta: "Now", active: true },
    { label: "Enter the verification code", meta: "Next", active: false },
    { label: "Choose a new password", meta: "Then", active: false },
];

const inputClass =
    "h-12 w-full rounded-lg border border-[#dadce0] bg-white px-3.5 text-[15px] text-[#202124] outline-none transition-colors " +
    "placeholder:text-[#80868b] hover:border-[#80868b] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]";

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

const Step = ({ label, meta, active }) => (
    <li className="flex items-center gap-3.5 py-3">
        <span
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                active ? "border-[#1a73e8] bg-white" : "border-[#dadce0]"
            }`}
        >
            {active && <span className="h-2 w-2 rounded-full bg-[#1a73e8]" />}
        </span>
        <span
            className={`flex-1 text-[14px] ${
                active ? "text-[#202124]" : "text-[#5f6368]"
            }`}
        >
            {label}
        </span>
        <span className="text-[12px] tabular-nums text-[#80868b]">{meta}</span>
    </li>
);

const ForgotPasswordCMP = () => {
    const [email, setEmail] = useState("");
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setFetching(true);
            const response = await api.post("/auth/request-password-reset", { email });
            if (response.data.success) {
                navigate("/verify-otp", { state: { email } });
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setFetching(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-['Google_Sans',Roboto,system-ui,-apple-system,'Segoe_UI',Arial,sans-serif] text-[#202124] antialiased">
            <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1fr]">

                {/* ---------------- Brand panel ---------------- */}
                <aside className="hidden flex-col justify-between bg-[#e8f0fe] px-14 py-12 lg:flex">
                    <Wordmark />

                    <div className="max-w-[28rem]">
                        <h2 className="text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
                            Lost your password? You&apos;ll be back in under a minute.
                        </h2>
                        <p className="mt-4 text-[16px] leading-relaxed text-[#5f6368]">
                            We&apos;ll email you a one-time code to confirm it&apos;s really you.
                            Your tasks, handovers and deadlines are right where you left them.
                        </p>

                        <div
                            aria-hidden="true"
                            className="mt-9 rounded-[28px] bg-white p-6 shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]"
                        >
                            <div className="flex items-baseline justify-between">
                                <span className="text-[20px] font-medium">Account recovery</span>
                                <span className="text-[13px] tabular-nums text-[#5f6368]">
                                    Step 1 of {recoverySteps.length}
                                </span>
                            </div>

                            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#f1f3f4]">
                                <div
                                    className="h-full rounded-full bg-[#1a73e8]"
                                    style={{ width: `${(1 / recoverySteps.length) * 100}%` }}
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
                                <h1 className="text-[28px] font-normal tracking-[-0.01em]">
                                    Forgot your password?
                                </h1>
                                <p className="mt-2 text-[15px] leading-relaxed text-[#5f6368]">
                                    Enter the email address associated with your account and we&apos;ll send you a verification code.
                                </p>

                                {error && (
                                    <div className="mt-5">
                                        <ErrorMessage message={error} />
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-1.5 block text-[13px] font-medium text-[#5f6368]"
                                        >
                                            Email address
                                        </label>
                                        <input
                                            required
                                            autoFocus
                                            id="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={inputClass}
                                        />
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
                                        {fetching ? "Sending..." : "Send Reset Code"}
                                    </button>
                                </form>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1a73e8] hover:underline"
                                >
                                    <ArrowLeft size={14} strokeWidth={2.2} />
                                    Back to Login
                                </Link>
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

export default ForgotPasswordCMP;