import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff, Lock, ArrowUpRight } from 'lucide-react'
import api from '../Axios/Axios.js'
import ErrorMessage from '../Error/Error.jsx'
import { login } from '../../app/features/authSlice.js'
import { useGoogleLogin } from '@react-oauth/google'

/* ------------------------------------------------------------------ */
/*  Presentational helpers — no app logic lives here                   */
/* ------------------------------------------------------------------ */

const Wordmark = ({ tone = 'dark' }) => (
  <div className="flex items-center gap-2.5">
    <div
      className={`w-8 h-8 rounded-[10px] grid place-items-center ${
        tone === 'dark'
          ? 'bg-white/10 text-white ring-1 ring-inset ring-white/15'
          : 'bg-[#131A22] text-white'
      }`}
    >
      <Lock size={15} strokeWidth={2.2} />
    </div>
    <span
      className={`text-[17px] font-semibold tracking-[-0.02em] ${
        tone === 'dark' ? 'text-white' : 'text-[#131A22]'
      }`}
    >
      Taskly
    </span>
  </div>
)

const Task = ({ label, meta, done, delay }) => (
  <li
    className="tk-rise flex items-center gap-3 py-2.5"
    style={{ animationDelay: `${delay}ms` }}
  >
    <span
      className={`w-[18px] h-[18px] shrink-0 rounded-md grid place-items-center ${
        done
          ? 'bg-[#1F8A70] text-white'
          : 'ring-1 ring-inset ring-white/25'
      }`}
    >
      {done && (
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
    </span>
    <span
      className={`flex-1 text-[13.5px] leading-snug ${
        done ? 'text-white/35 line-through decoration-white/25' : 'text-white/80'
      }`}
    >
      {label}
    </span>
    <span className="text-[11.5px] text-white/35 tabular-nums">{meta}</span>
  </li>
)

/* ------------------------------------------------------------------ */

const LoginCMP = () => {
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const validate = () => {
    const errors = {}
    if (!identifier.trim()) {
      errors.identifier = "Enter your username or email"
    }
    if (!password) {
      errors.password = "Enter your password"
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validate()) return

    setFetching(true)
    try {
      const response = await api.post("/auth/login", { identifier, password })
      if (response.data.success) {
        dispatch(login(response.data.data))
        const redirectTo = location.state?.from?.pathname || "/dashboard"
        navigate(redirectTo, { replace: true })
      } else {
        setError(response.data.message)
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.")
    } finally {
      setFetching(false)
    }
  }

  const inputBase =
    "w-full rounded-[10px] bg-white px-3.5 py-3 text-[14.5px] text-[#131A22] placeholder:text-[#9AA3AD] " +
    "border outline-none transition-[border-color,box-shadow] duration-150 " +
    "focus:border-[#1F8A70] focus:shadow-[0_0_0_3.5px_rgba(31,138,112,0.14)]"

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

        {/* ---------------- Brand panel ---------------- */}
        <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#131A22] px-14 py-12">
          {/* one soft light source, top-left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-40 -left-24 h-[460px] w-[460px] rounded-full opacity-[0.55] blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(31,138,112,0.45) 0%, rgba(19,26,34,0) 70%)' }}
          />

          <div className="relative">
            <Wordmark tone="dark" />
          </div>

          <div className="relative max-w-[26rem]">
            <h2 className="text-[34px] leading-[1.14] font-semibold tracking-[-0.03em] text-white">
              Everything you owe this week, on one page.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/45">
              Taskly keeps your work, your team&apos;s handovers and your deadlines
              in a single list that never gets longer than the day allows.
            </p>

            {/* live-ish product vignette */}
            <div className="tk-rise mt-9 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-medium text-white/85">Today</span>
                <span className="text-[12px] text-white/40 tabular-nums">2 of 4 done</span>
              </div>

              <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                <div className="tk-bar h-full w-1/2 rounded-full bg-[#1F8A70]" />
              </div>

              <ul className="mt-2 divide-y divide-white/[0.06]">
                <Task label="Send the invoice to Ardent" meta="9:10" done delay={220} />
                <Task label="Review Priya's pull request" meta="11:40" done delay={340} />
                <Task label="Write the handover doc" meta="Today" delay={460} />
                <Task label="Book the team offsite" meta="Thu" delay={580} />
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

        {/* ---------------- Sign-in column ---------------- */}
        <div className="flex min-h-screen flex-col px-5 sm:px-8">
          <header className="flex items-center justify-between py-6 lg:hidden">
            <Wordmark />
            <span className="flex items-center gap-1.5 text-[12px] text-[#6B7480]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1F8A70]" />
              Operational
            </span>
          </header>

          <main className="flex flex-1 items-center justify-center py-6 lg:py-10">
            <div className="w-full max-w-[26rem]">

              <div className="rounded-[20px] border border-[#E2E5E9] bg-white p-7 sm:p-9 shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)]">
                <h1 className="text-[27px] font-semibold tracking-[-0.03em] text-[#131A22]">
                  Welcome back
                </h1>
                <p className="mt-1.5 text-[14px] text-[#6B7480]">
                  Sign in to pick up where you left off.
                </p>

                {error && (
                  <div className="mt-5">
                    <ErrorMessage message={error} />
                  </div>
                )}

                {/* <div className="grid grid-cols-2 gap-2 mb-5 mt-2">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-sm font-medium text-slate-700 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current text-slate-900" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    GitHub
                  </button>
                </div>

                <div className="relative flex items-center justify-center mb-5">
                  <div className="w-full h-px bg-slate-200" />
                  <span className="absolute px-3 bg-white text-xs uppercase tracking-wide text-slate-400">
                    Or continue with
                  </span>
                </div> */}

                <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-5">
                  <div>
                    <label
                      htmlFor="identifier"
                      className="mb-1.5 block text-[13px] font-medium text-[#3D4753]"
                    >
                      Username or email
                    </label>
                    <input
                      id="identifier"
                      type="text"
                      autoFocus
                      autoComplete="username"
                      placeholder="you@company.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className={`${inputBase} ${
                        fieldErrors.identifier
                          ? "border-[#B42318] focus:border-[#B42318] focus:shadow-[0_0_0_3.5px_rgba(180,35,24,0.12)]"
                          : "border-[#DCE0E5]"
                      }`}
                    />
                    {fieldErrors.identifier && (
                      <p className="mt-1.5 text-[12.5px] text-[#B42318]">
                        {fieldErrors.identifier}
                      </p>
                    )}
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <label
                        htmlFor="password"
                        className="block text-[13px] font-medium text-[#3D4753]"
                      >
                        Password
                      </label>
                      <Link
                        to="/request-password-reset"
                        className="rounded text-[12.5px] text-[#1F8A70] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        minLength={8}
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputBase} pr-11 ${
                          fieldErrors.password
                            ? "border-[#B42318] focus:border-[#B42318] focus:shadow-[0_0_0_3.5px_rgba(180,35,24,0.12)]"
                            : "border-[#DCE0E5]"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#9AA3AD] transition-colors hover:text-[#3D4753]"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <Eye size={17} /> : <EyeOff size={17} />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="mt-1.5 text-[12.5px] text-[#B42318]">
                        {fieldErrors.password}
                      </p>
                    )}
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
                    {fetching ? "Signing in..." : "Sign in"}
                  </button>
                </form>
              </div>

              <p className="mt-6 text-center text-[14px] text-[#6B7480]">
                New to Taskly?{" "}
                <Link
                  to="/register"
                  className="inline-flex items-center gap-0.5 font-medium text-[#131A22] underline-offset-4 hover:underline"
                >
                  Create an account
                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </Link>
              </p>
            </div>
          </main>

          <footer className="flex flex-col items-center gap-3 py-7 sm:flex-row sm:justify-between">
            <span className="flex items-center gap-1.5 text-[12px] text-[#8B939D]">
              <Lock size={12} strokeWidth={2.2} />
              Encrypted sign-in
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
  )
}

export default LoginCMP