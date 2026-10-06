import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Lock, Mail, Check } from "lucide-react";
import ErrorMessage from "../Error/Error";
import api from "../Axios/Axios";
import { login } from "../../app/features/authSlice";

/* ------------------------------------------------------------------ */
/*  Presentational helpers — no app logic lives here                   */
/* ------------------------------------------------------------------ */

const setupSteps = [
  {
    title: "Create your account",
    body: "Your name, email and password are set.",
    state: "done",
  },
  {
    title: "Confirm your email",
    body: "Enter the 6-digit code we just sent you.",
    state: "current",
  },
  {
    title: "Write down today",
    body: "Three things is plenty for a first list.",
    state: "upcoming",
  },
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

const Step = ({ title, body, state }) => (
  <li className="flex items-start gap-3.5 py-3.5">
    <span
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
        state === "done"
          ? "border-[#1a73e8] bg-[#1a73e8] text-white"
          : state === "current"
          ? "border-[#1a73e8] bg-white"
          : "border-[#dadce0]"
      }`}
    >
      {state === "done" && <Check size={12} strokeWidth={3} />}
      {state === "current" && <span className="h-2 w-2 rounded-full bg-[#1a73e8]" />}
    </span>
    <div className="min-w-0">
      <p
        className={`text-[14px] font-medium ${
          state === "upcoming" ? "text-[#5f6368]" : "text-[#202124]"
        }`}
      >
        {title}
      </p>
      <p className="mt-0.5 text-[13px] leading-relaxed text-[#80868b]">{body}</p>
    </div>
  </li>
);

/* ------------------------------------------------------------------ */

const VerifyEmailCMP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { email, password } = location.state || {};

  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(false);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...verificationCode];
    newCode[index] = value;

    setVerificationCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedCode = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pastedCode) return;

    const newCode = [...verificationCode];
    pastedCode.split("").forEach((digit, index) => {
      newCode[index] = digit;
    });

    setVerificationCode(newCode);

    const nextIndex = Math.min(pastedCode.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const code = verificationCode.join("");

    if (code.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (!email) {
      setError("Email address is missing. Please register again.");
      return;
    }

    try {
      setFetching(true);

      const response = await api.post("/auth/verify-email", { email, otp: code });
      if (response.data.success) {
        try {
          const loginResponse = await api.post("/auth/login", { identifier: email, password });
          if (loginResponse.data.success) {
            dispatch(login(loginResponse.data.data));
            navigate("/dashboard");
          }
        } catch (error) {
          setError(error.response.data.message);
        }
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setFetching(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setResending(true);
      const response = await api.post("/auth/resend-otp", { email });
      if (response.data.success) {
        setError(response.data.message);
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setResending(false);
    }
  };

  const doneCount = setupSteps.filter((s) => s.state === "done").length;

  return (
    <div className="min-h-screen bg-white font-['Google_Sans',Roboto,system-ui,-apple-system,'Segoe_UI',Arial,sans-serif] text-[#202124] antialiased">
      <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1fr]">

        {/* ---------------- Brand panel ---------------- */}
        <aside className="hidden flex-col justify-between bg-[#e8f0fe] px-14 py-12 lg:flex">
          <Wordmark />

          <div className="max-w-[28rem]">
            <h2 className="text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
              Almost in. One code to go.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#5f6368]">
              We sent six digits to your email. Enter them and you&apos;ll land
              straight in today&apos;s list.
            </p>

            <div
              aria-hidden="true"
              className="mt-9 rounded-[28px] bg-white p-6 shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[20px] font-medium">Getting started</span>
                <span className="text-[13px] tabular-nums text-[#5f6368]">
                  {doneCount} of {setupSteps.length} done
                </span>
              </div>

              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#f1f3f4]">
                <div
                  className="h-full rounded-full bg-[#1a73e8]"
                  style={{ width: `${(doneCount / setupSteps.length) * 100}%` }}
                />
              </div>

              <ul className="mt-2 divide-y divide-[#dadce0]">
                {setupSteps.map((step) => (
                  <Step key={step.title} {...step} />
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

        {/* ---------------- Verify column ---------------- */}
        <div className="flex min-h-screen flex-col px-5 sm:px-8">
          <header className="flex items-center justify-between py-6 lg:hidden">
            <Wordmark />
          </header>

          <main className="flex flex-1 items-center justify-center py-6 lg:py-10">
            <div className="w-full max-w-[26rem]">
              <div className="rounded-[28px] border border-[#dadce0] bg-white p-7 sm:p-10">

                <div className="mb-6 flex justify-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#e8f0fe] text-[#1a73e8]">
                    <Mail size={26} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="text-center">
                  <h1 className="text-[28px] font-normal tracking-[-0.01em]">
                    Verify your email
                  </h1>
                  <p className="mt-2 text-[15px] text-[#5f6368]">
                    Enter the 6-digit verification code
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
                  <div
                    className="flex justify-center gap-2"
                    onPaste={handlePaste}
                    role="group"
                    aria-label="6-digit verification code"
                  >
                    {verificationCode.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="h-12 w-11 rounded-lg border border-[#dadce0] bg-white text-center text-lg font-medium text-[#202124] outline-none transition-colors hover:border-[#80868b] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
                      />
                    ))}
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
                    {fetching ? "Verifying..." : "Verify email"}
                  </button>
                </form>

                <p className="mt-6 text-center text-[14px] text-[#5f6368]">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resending}
                    className="font-medium text-[#1a73e8] hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resending ? "Resending..." : "Resend code"}
                  </button>
                </p>
              </div>

              <p className="mt-6 text-center text-[14px] text-[#5f6368]">
                Wrong email?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-medium text-[#1a73e8] hover:underline"
                >
                  Go back
                </button>
              </p>
            </div>
          </main>

          <footer className="flex flex-col items-center gap-3 py-7 sm:flex-row sm:justify-between">
            <span className="flex items-center gap-1.5 text-[12px] text-[#5f6368]">
              <Lock size={12} strokeWidth={2.2} />
              Encrypted verification
            </span>
            <nav className="flex items-center gap-5 text-[12px] text-[#5f6368]">
              <a href="/privacy" className="transition-colors hover:text-[#202124]">Privacy</a>
              <a href="/terms" className="transition-colors hover:text-[#202124]">Terms</a>
              <a href="/help" className="transition-colors hover:text-[#202124]">Help</a>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailCMP;