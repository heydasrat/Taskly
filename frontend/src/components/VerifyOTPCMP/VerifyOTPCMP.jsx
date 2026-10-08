import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Check, ShieldCheck } from "lucide-react";
import api from "../Axios/Axios.js";
import ErrorMessage from "../Error/Error.jsx";

const recoverySteps = [
    { label: "Enter your account email", meta: "Done", state: "done" },
    { label: "Enter the verification code", meta: "Now", state: "active" },
    { label: "Choose a new password", meta: "Then", state: "upcoming" },
];

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

const VerifyOTPCMP = () => {
    const [otp, setOtp] = useState("");
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState("");

    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email) {
            setError("Email information is missing. Please request a new OTP.");
            return;
        }

        if (!otp.trim()) {
            setError("Please enter the OTP.");
            return;
        }

        if (!/^\d+$/.test(otp.trim())) {
            setError("OTP must contain only numbers.");
            return;
        }

        if (otp.trim().length !== 6) {
            setError("OTP must be exactly 6 digits.");
            return;
        }

        try {
            setFetching(true);
            const response = await api.post("/auth/verify-otp", { otp, email });
            if (response.data.success) {
                navigate("/reset-password", { state: { resetToken: response.data.data } });
            }
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setFetching(false);
        }
    };

    const handleOtpChange = (e) => {
        const value = e.target.value;

        if (!/^\d*$/.test(value)) {
            return;
        }

        if (value.length > 6) {
            return;
        }

        setOtp(value);
        setError("");
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
                            Check your inbox. One code to go.
                        </h2>
                        <p className="mt-4 text-[16px] leading-relaxed text-[#5f6368]">
                            We emailed you a 6-digit code to confirm it&apos;s really you.
                            Enter it and you&apos;ll be able to set a new password.
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
                            Check spam if it takes a minute to arrive.
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
                                        <ShieldCheck size={26} strokeWidth={1.8} />
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h1 className="text-[28px] font-normal tracking-[-0.01em]">
                                        Verify your email
                                    </h1>
                                    <p className="mt-2 text-[15px] text-[#5f6368]">
                                        Enter the 6-digit code we sent to
                                    </p>
                                    {email && (
                                        <p className="mt-1 break-all text-[15px] font-medium text-[#202124]">
                                            {email}
                                        </p>
                                    )}
                                </div>

                                {error && (
                                    <div className="mt-5">
                                        <ErrorMessage message={error} />
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                    <div>
                                        <div className="mb-1.5 flex items-baseline justify-between">
                                            <label
                                                htmlFor="otp"
                                                className="block text-[13px] font-medium text-[#5f6368]"
                                            >
                                                Verification code
                                            </label>
                                            <span className="text-[12.5px] text-[#80868b]">6 digits</span>
                                        </div>
                                        <input
                                            id="otp"
                                            type="text"
                                            autoFocus
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            placeholder="Enter 6-digit code"
                                            value={otp}
                                            onChange={handleOtpChange}
                                            className="h-14 w-full rounded-lg border border-[#dadce0] bg-white text-center text-xl font-medium tracking-[0.4em] text-[#202124] outline-none transition-colors placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-[#80868b] hover:border-[#80868b] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
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
                                        {fetching ? "Verifying..." : "Verify Code"}
                                    </button>
                                </form>
                            </div>

                            <div className="mt-6 flex flex-col items-center gap-3">
                                <Link
                                    to="/request-password-reset"
                                    className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1a73e8] hover:underline"
                                >
                                    <ArrowLeft size={14} strokeWidth={2.2} />
                                    Change email
                                </Link>
                                <p className="text-center text-[12.5px] text-[#80868b]">
                                    The verification code expires after 10 minutes.
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

export default VerifyOTPCMP;