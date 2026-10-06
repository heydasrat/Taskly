import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff, Lock, ArrowUpRight, Check } from 'lucide-react'
import ErrorMessage from '../Error/Error.jsx'
import api from '../Axios/Axios.js'
import { logout } from '../../app/features/authSlice.js'

/* ------------------------------------------------------------------ */
/*  Presentational helpers — no app logic lives here                   */
/* ------------------------------------------------------------------ */

const setupSteps = [
  {
    title: 'Create your account',
    body: 'Your name, an email you check, and a password of at least eight characters.',
    current: true,
  },
  {
    title: 'Confirm your email',
    body: 'We send a code to the address you enter, so the account stays yours.',
    current: false,
  },
  {
    title: 'Write down today',
    body: 'Three things is plenty for a first list. Add the rest when it turns up.',
    current: false,
  },
]

const inputClass =
  'h-12 w-full rounded-lg border border-[#dadce0] bg-white px-3.5 text-[15px] text-[#202124] outline-none transition-colors ' +
  'placeholder:text-[#80868b] hover:border-[#80868b] focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]'

const labelClass = 'mb-1.5 block text-[13px] font-medium text-[#5f6368]'

const Wordmark = () => (
  <div className="flex items-center gap-2.5">
    <div className="grid h-8 w-8 place-items-center rounded-full bg-[#1a73e8] text-white">
      <Check size={16} strokeWidth={3} />
    </div>
    <span className="text-[22px] font-medium tracking-[-0.01em] text-[#5f6368]">
      Taskly
    </span>
  </div>
)

const Step = ({ title, body, current }) => (
  <li className="flex items-start gap-3.5 py-3.5">
    <span
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
        current ? 'border-[#1a73e8] bg-[#1a73e8] text-white' : 'border-[#5f6368]'
      }`}
    >
      {current && <Check size={12} strokeWidth={3} />}
    </span>
    <div className="min-w-0">
      <p className={`text-[14px] font-medium ${current ? 'text-[#202124]' : 'text-[#5f6368]'}`}>
        {title}
      </p>
      <p className="mt-0.5 text-[13px] leading-relaxed text-[#80868b]">{body}</p>
    </div>
  </li>
)

/* ------------------------------------------------------------------ */

const RegisterCMP = () => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [fetching, setFetching] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!fullName.trim()) {
      setError("Please write a valid full name.")
      return
    }
    if (!email.trim()) {
      setError("Please write a valid email.")
      return
    }
    if (!username.trim()) {
      setError("Please write a valid username.")
      return
    }
    if (!password.trim()) {
      setError("Please write a valid password.")
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.")
      return
    }

    try {
      setFetching(true)
      const response = await api.post("/auth/register", { fullName, email, username, password })
      if (response.data.success) {
        navigate("/verify-email", { state: { email, password } })
      }
    } catch (error) {
      setError(error.response.data.message)
      dispatch(logout())
    } finally {
      setFetching(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-['Google_Sans',Roboto,system-ui,-apple-system,'Segoe_UI',Arial,sans-serif] text-[#202124] antialiased">
      <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1fr]">

        {/* ---------------- Brand panel ---------------- */}
        <aside className="hidden flex-col justify-between bg-[#e8f0fe] px-14 py-12 lg:flex">
          <Wordmark />

          <div className="max-w-[28rem]">
            <h2 className="text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
              One account, and the week stops living in your head.
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-[#5f6368]">
              Setup takes about a minute. You&apos;ll confirm your email, then land
              straight in today&apos;s list.
            </p>

            <div
              aria-hidden="true"
              className="mt-9 rounded-[28px] bg-white p-6 shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[20px] font-medium">Getting started</span>
                <span className="text-[13px] tabular-nums text-[#5f6368]">
                  1 of {setupSteps.length}
                </span>
              </div>

              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#f1f3f4]">
                <div
                  className="h-full rounded-full bg-[#1a73e8]"
                  style={{ width: `${(1 / setupSteps.length) * 100}%` }}
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
              Free for personal use. No card needed.
            </span>
          </div>
        </aside>

        {/* ---------------- Sign-up column ---------------- */}
        <div className="flex min-h-screen flex-col px-5 sm:px-8">
          <header className="flex items-center justify-between py-6 lg:hidden">
            <Wordmark />
            <Link
              to="/login"
              className="text-[13px] font-medium text-[#1a73e8] hover:underline"
            >
              Sign in
            </Link>
          </header>

          <main className="flex flex-1 items-center justify-center py-6 lg:py-10">
            <div className="w-full max-w-[26rem]">
              <div className="rounded-[28px] border border-[#dadce0] bg-white p-7 sm:p-10">
                <h1 className="text-[28px] font-normal tracking-[-0.01em]">
                  Create your account
                </h1>
                <p className="mt-2 text-[15px] text-[#5f6368]">
                  A minute now, then you&apos;re in.
                </p>

                {error && (
                  <div className="mt-5">
                    <ErrorMessage message={error} />
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label htmlFor="fullName" className={labelClass}>
                      Full name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoFocus
                      autoComplete="name"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className={labelClass}>
                      Username
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-[#80868b]">
                        @
                      </span>
                      <input
                        id="username"
                        type="text"
                        autoComplete="username"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`${inputClass} pl-8`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className={labelClass}>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#5f6368] transition-colors hover:bg-[#f1f3f4]"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    <p className="mt-1.5 text-[12.5px] text-[#80868b]">
                      Must be at least 8 characters
                    </p>
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
                    {fetching ? "Registering..." : "Create account"}
                  </button>

                  <p className="text-[12.5px] leading-relaxed text-[#80868b]">
                    By creating an account you agree to our{" "}
                    <Link to="/terms" className="text-[#1a73e8] hover:underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-[#1a73e8] hover:underline">
                      Privacy Policy
                    </Link>.
                  </p>
                </form>
              </div>

              <p className="mt-6 text-center text-[14px] text-[#5f6368]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="inline-flex items-center gap-0.5 font-medium text-[#1a73e8] hover:underline"
                >
                  Sign in
                  <ArrowUpRight size={14} strokeWidth={2.2} />
                </Link>
              </p>
            </div>
          </main>

          <footer className="flex flex-col items-center gap-3 py-7 sm:flex-row sm:justify-between">
            <span className="flex items-center gap-1.5 text-[12px] text-[#5f6368]">
              <Lock size={12} strokeWidth={2.2} />
              Encrypted sign-up
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
  )
}

export default RegisterCMP