import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ErrorMessage from "../Error/Error";
import api from "../Axios/Axios";
import { login } from "../../app/features/authSlice";

/* ------------------------------------------------------------------ */
/*  Presentational helpers — no app logic lives here                   */
/* ------------------------------------------------------------------ */

const LockGlyph = ({ size = 15 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const MailGlyph = ({ size = 26 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
  </svg>
);

const Wordmark = ({ tone = "dark" }) => (
  <div className="flex items-center gap-2.5">
    <div
      className={`w-8 h-8 rounded-[10px] grid place-items-center ${
        tone === "dark"
          ? "bg-white/10 text-white ring-1 ring-inset ring-white/15"
          : "bg-[#131A22] text-white"
      }`}
    >
      <LockGlyph />
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

const Step = ({ title, body, state, last, delay }) => (
  <li
    className="tk-rise relative flex gap-4 pb-6 last:pb-0"
    style={{ animationDelay: `${delay}ms` }}
  >
    {!last && (
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-5 bottom-1 w-px bg-white/12"
      />
    )}
    <span
      className={`relative mt-1 grid h-[15px] w-[15px] shrink-0 place-items-center rounded-full ${
        state === "current"
          ? "bg-[#1F8A70] shadow-[0_0_0_4px_rgba(31,138,112,0.18)]"
          : state === "done"
          ? "bg-[#1F8A70]"
          : "bg-[#131A22] ring-1 ring-inset ring-white/25"
      }`}
    >
      {state === "done" && (
        <svg
          viewBox="0 0 16 16"
          className="tk-check h-2 w-2"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animationDelay: `${delay + 200}ms` }}
        >
          <path d="M3.5 8.4 6.4 11.3 12.5 4.9" />
        </svg>
      )}
    </span>
    <div className="min-w-0">
      <p
        className={`text-[13.5px] font-medium ${
          state === "upcoming" ? "text-white/55" : "text-white"
        }`}
      >
        {title}
      </p>
      <p
        className={`mt-1 text-[13px] leading-relaxed ${
          state === "upcoming" ? "text-white/30" : "text-white/50"
        }`}
      >
        {body}
      </p>
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

  return (
    <div className="tk-root min-h-screen bg-[#EDEFF2] text-[#131A22] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
        .tk-root{font-family:'Instrument Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-feature-settings:'ss01','cv01';}
        @keyframes tk-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .tk-rise{animation:tk-rise .6s cubic-bezier(.22,.68,.28,1) both}
        @keyframes tk-draw{to{stroke-dashoffset:0}}
        .tk-check path{stroke-dasharray:18;stroke-dashoffset:18;animation:tk-draw .4s ease-out both}
        @media (prefers-reduced-motion:reduce){
          .tk-rise,.tk-check path{animation:none!important}
          .tk-check path{stroke-dashoffset:0}
        }
      `}</style>

      <div className="min-h-screen lg:grid lg:grid-cols-[1.02fr_1fr]">

        {/* ---------------- Brand panel ---------------- */}
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
              Almost in. One code to go.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/45">
              We sent six digits to your email. Enter them and you&apos;ll land
              straight in today&apos;s list.
            </p>

            <ol className="mt-10 max-w-[22rem]">
              <Step
                state="done"
                title="Create your account"
                body="Your name, email and password are set."
                delay={220}
              />
              <Step
                state="current"
                title="Confirm your email"
                body="Enter the 6-digit code we just sent you."
                delay={340}
              />
              <Step
                state="upcoming"
                last
                title="Write down today"
                body="Three things is plenty for a first list."
                delay={460}
              />
            </ol>
          </div>

          <div className="relative flex items-center gap-2 text-[12px] text-white/40">
            <LockGlyph size={12} />
            <span>Check spam if it takes a minute to arrive.</span>
          </div>
        </aside>

        {/* ---------------- Verify column ---------------- */}
        <div className="flex min-h-screen flex-col px-5 sm:px-8">
          <header className="flex items-center justify-between py-6 lg:hidden">
            <Wordmark />
          </header>

          <main className="flex flex-1 items-center justify-center py-6 lg:py-10">
            <div className="w-full max-w-[26rem]">

              <div className="rounded-[20px] border border-[#E2E5E9] bg-white p-7 sm:p-9 shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)]">

                <div className="mb-6 flex justify-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#1F8A70]/10 text-[#1F8A70]">
                    <MailGlyph />
                  </div>
                </div>

                <div className="text-center">
                  <h1 className="text-[27px] font-semibold tracking-[-0.03em] text-[#131A22]">
                    Verify your email
                  </h1>
                  <p className="mt-1.5 text-[14px] text-[#6B7480]">
                    Enter the 6-digit verification code
                  </p>
                  {email && (
                    <p className="mt-1 break-all text-[14px] font-medium text-[#131A22]">
                      {email}
                    </p>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
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
                        className="h-12 w-11 rounded-[10px] border border-[#DCE0E5] text-center text-lg font-semibold text-[#131A22]
                          outline-none transition-[border-color,box-shadow] duration-150
                          focus:border-[#1F8A70] focus:shadow-[0_0_0_3.5px_rgba(31,138,112,0.14)]"
                      />
                    ))}
                  </div>

                  {error && <ErrorMessage message={error} />}

                  <button
                    type="submit"
                    disabled={fetching}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#131A22] text-[14.5px] font-medium text-white
                      shadow-[0_1px_2px_rgba(19,26,34,0.25)] transition-colors duration-150
                      hover:bg-[#1F2A38] active:bg-[#0D1621]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2
                      disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {fetching ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Verifying...
                      </>
                    ) : (
                      "Verify email"
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-[14px] text-[#6B7480]">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resending}
                    className="font-medium text-[#1F8A70] underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resending ? "Resending..." : "Resend code"}
                  </button>
                </p>
              </div>

              <p className="mt-6 text-center text-[14px] text-[#6B7480]">
                Wrong email?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="font-medium text-[#131A22] underline-offset-4 hover:underline"
                >
                  Go back
                </button>
              </p>
            </div>
          </main>

          <footer className="flex flex-col items-center gap-3 py-7 sm:flex-row sm:justify-between">
            <span className="flex items-center gap-1.5 text-[12px] text-[#8B939D]">
              <LockGlyph size={12} />
              Encrypted verification
            </span>
            <nav className="flex items-center gap-5 text-[12px] text-[#8B939D]">
              <a href="/privacy" className="transition-colors hover:text-[#131A22]">Privacy</a>
              <a href="/terms" className="transition-colors hover:text-[#131A22]">Terms</a>
              <a href="/help" className="transition-colors hover:text-[#131A22]">Help</a>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailCMP;