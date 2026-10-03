import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import ErrorMessage from '../Error/Error.jsx'
import api from '../Axios/Axios.js'
import { logout } from '../../app/features/authSlice.js'

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
)

const Wordmark = ({ tone = 'dark' }) => (
  <div className="flex items-center gap-2.5">
    <div
      className={`w-8 h-8 rounded-[10px] grid place-items-center ${
        tone === 'dark'
          ? 'bg-white/10 text-white ring-1 ring-inset ring-white/15'
          : 'bg-[#131A22] text-white'
      }`}
    >
      <LockGlyph />
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

const Step = ({ title, body, current, last, delay }) => (
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
      className={`relative mt-1 h-[15px] w-[15px] shrink-0 rounded-full ${
        current
          ? 'bg-[#1F8A70] shadow-[0_0_0_4px_rgba(31,138,112,0.18)]'
          : 'bg-[#131A22] ring-1 ring-inset ring-white/25'
      }`}
    />
    <div className="min-w-0">
      <p
        className={`text-[13.5px] font-medium ${
          current ? 'text-white' : 'text-white/55'
        }`}
      >
        {title}
      </p>
      <p
        className={`mt-1 text-[13px] leading-relaxed ${
          current ? 'text-white/50' : 'text-white/30'
        }`}
      >
        {body}
      </p>
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

  const inputBase =
    "w-full h-11 rounded-[10px] bg-white px-3.5 text-[14.5px] text-[#131A22] placeholder:text-[#9AA3AD] " +
    "border border-[#DCE0E5] outline-none transition-[border-color,box-shadow] duration-150 " +
    "focus:border-[#1F8A70] focus:shadow-[0_0_0_3.5px_rgba(31,138,112,0.14)]"

  const labelBase = "mb-1.5 block text-[13px] font-medium text-[#3D4753]"

  return (
    <div className="tk-root min-h-screen bg-[#EDEFF2] text-[#131A22] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
        .tk-root{font-family:'Instrument Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-feature-settings:'ss01','cv01';}
        @keyframes tk-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .tk-rise{animation:tk-rise .6s cubic-bezier(.22,.68,.28,1) both}
        @media (prefers-reduced-motion:reduce){.tk-rise{animation:none!important}}
      `}</style>

      <div className="min-h-screen lg:grid lg:grid-cols-[1.02fr_1fr]">

        {/* ---------------- Brand panel ---------------- */}
        <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#131A22] px-14 py-12">
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
              One account, and the week stops living in your head.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-white/45">
              Setup takes about a minute. You&apos;ll confirm your email, then land
              straight in today&apos;s list.
            </p>

            <ol className="mt-10 max-w-[22rem]">
              <Step
                current
                title="Create your account"
                body="Your name, an email you check, and a password of at least eight characters."
                delay={220}
              />
              <Step
                title="Confirm your email"
                body="We send a code to the address you enter, so the account stays yours."
                delay={340}
              />
              <Step
                last
                title="Write down today"
                body="Three things is plenty for a first list. Add the rest when it turns up."
                delay={460}
              />
            </ol>
          </div>

          <div className="relative flex items-center gap-2 text-[12px] text-white/40">
            <LockGlyph size={12} />
            <span>Free for personal use. No card needed.</span>
          </div>
        </aside>

        {/* ---------------- Sign-up column ---------------- */}
        <div className="flex min-h-screen flex-col px-5 sm:px-8">
          <header className="flex items-center justify-between py-6 lg:hidden">
            <Wordmark />
            <Link
              to="/login"
              className="text-[13px] font-medium text-[#3D4753] underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </header>

          <main className="flex flex-1 items-center justify-center py-6 lg:py-10">
            <div className="w-full max-w-[26rem]">

              <div className="rounded-[20px] border border-[#E2E5E9] bg-white p-7 sm:p-9 shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)]">
                <h1 className="text-[27px] font-semibold tracking-[-0.03em] text-[#131A22]">
                  Create your account
                </h1>
                <p className="mt-1.5 text-[14px] text-[#6B7480]">
                  A minute now, then you&apos;re in.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">

                  <div>
                    <label htmlFor="fullName" className={labelBase}>
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
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelBase}>
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputBase}
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className={labelBase}>
                      Username
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[14.5px] text-[#B4BBC3]">
                        @
                      </span>
                      <input
                        id="username"
                        type="text"
                        autoComplete="username"
                        placeholder="johndoe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`${inputBase} pl-8`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className={labelBase}>
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="At least 8 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputBase} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-1.5 rounded-md p-2 text-[#9AA3AD] transition-colors hover:text-[#3D4753]"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-[18px] w-[18px]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-[18px] w-[18px]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="mt-1.5 text-[12.5px] text-[#8B939D]">
                      Must be at least 8 characters
                    </p>
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
                        Registering...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </button>

                  <p className="pt-1 text-[12.5px] leading-relaxed text-[#8B939D]">
                    By creating an account you agree to our{" "}
                    <Link to="/terms" className="text-[#3D4753] underline-offset-2 hover:underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-[#3D4753] underline-offset-2 hover:underline">
                      Privacy Policy
                    </Link>.
                  </p>
                </form>
              </div>

              <p className="mt-6 text-center text-[14px] text-[#6B7480]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-[#131A22] underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </main>

          <footer className="flex flex-col items-center gap-3 py-7 sm:flex-row sm:justify-between">
            <span className="flex items-center gap-1.5 text-[12px] text-[#8B939D]">
              <LockGlyph size={12} />
              Encrypted sign-up
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

export default RegisterCMP