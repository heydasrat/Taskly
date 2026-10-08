import React, { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { Eye, EyeOff, Lock, ArrowUpRight, Check } from "lucide-react"
import api from "../Axios/Axios.js"
import ErrorMessage from "../Error/Error.jsx"
import { login } from "../../app/features/authSlice.js"

const previewTasks = [
    { label: "Send the invoice to Ardent", meta: "9:10", done: true },
    { label: "Review Priya's pull request", meta: "11:40", done: true },
    { label: "Write the handover doc", meta: "Today", done: false },
    { label: "Book the team offsite", meta: "Thu", done: false },
]

const inputClass = (hasError) =>
    `h-12 w-full rounded-lg border bg-white px-3.5 text-[15px] text-[#202124] outline-none transition-colors placeholder:text-[#80868b] focus:ring-1 ${
        hasError
            ? "border-[#d93025] focus:border-[#d93025] focus:ring-[#d93025]"
            : "border-[#dadce0] hover:border-[#80868b] focus:border-[#1a73e8] focus:ring-[#1a73e8]"
    }`

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

const Task = ({ label, meta, done }) => (
    <li className="flex items-center gap-3.5 py-3">
        <span
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                done
                    ? "border-[#1a73e8] bg-[#1a73e8] text-white"
                    : "border-[#5f6368]"
            }`}
        >
            {done && <Check size={12} strokeWidth={3} />}
        </span>

        <span
            className={`flex-1 text-[14px] ${
                done
                    ? "text-[#80868b] line-through"
                    : "text-[#202124]"
            }`}
        >
            {label}
        </span>

        <span className="text-[12px] tabular-nums text-[#80868b]">
            {meta}
        </span>
    </li>
)

const LoginCMP = () => {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)
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
            const response = await api.post("/auth/login", {
                identifier,
                password
            })

            if (response.data.success) {
                dispatch(login(response.data.data))

                const redirectTo =
                    location.state?.from?.pathname || "/dashboard"

                navigate(redirectTo, { replace: true })
            } else {
                setError(response.data.message)
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            )
        } finally {
            setFetching(false)
        }
    }

    const handleGoogleLogin = () => {
        setGoogleLoading(true)
        setError("")

        window.location.href =
            "http://localhost:8000/v1/api/auth/google"
    }

    const doneCount = previewTasks.filter((t) => t.done).length

    return (
        <div className="min-h-screen bg-white font-['Google_Sans',Roboto,system-ui,-apple-system,'Segoe_UI',Arial,sans-serif] text-[#202124] antialiased">
            <div className="min-h-screen lg:grid lg:grid-cols-[1fr_1fr]">

                <aside className="hidden flex-col justify-between bg-[#e8f0fe] px-14 py-12 lg:flex">
                    <Wordmark />

                    <div className="max-w-[28rem]">
                        <h2 className="text-[40px] font-normal leading-[1.15] tracking-[-0.02em]">
                            Everything you owe this week, on one page.
                        </h2>

                        <p className="mt-4 text-[16px] leading-relaxed text-[#5f6368]">
                            Taskly keeps your work, your team's handovers and your deadlines
                            in a single list that never gets longer than the day allows.
                        </p>

                        <div
                            aria-hidden="true"
                            className="mt-9 rounded-[28px] bg-white p-6 shadow-[0_1px_3px_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)]"
                        >
                            <div className="flex items-baseline justify-between">
                                <span className="text-[20px] font-medium">
                                    Today
                                </span>

                                <span className="text-[13px] tabular-nums text-[#5f6368]">
                                    {doneCount} of {previewTasks.length} done
                                </span>
                            </div>

                            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[#f1f3f4]">
                                <div
                                    className="h-full rounded-full bg-[#1a73e8]"
                                    style={{
                                        width: `${(doneCount / previewTasks.length) * 100}%`
                                    }}
                                />
                            </div>

                            <ul className="mt-2 divide-y divide-[#dadce0]">
                                {previewTasks.map((task) => (
                                    <Task key={task.label} {...task} />
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
                                    Welcome back
                                </h1>

                                <p className="mt-2 text-[15px] text-[#5f6368]">
                                    Sign in to pick up where you left off.
                                </p>

                                {error && (
                                    <div className="mt-5">
                                        <ErrorMessage message={error} />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    disabled={googleLoading || fetching}
                                    onClick={handleGoogleLogin}
                                    className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#dadce0] bg-white text-[15px] font-medium text-[#202124] transition-colors hover:bg-[#f8f9fa] hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fill="#4285F4"
                                            d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.67Z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M6.54 13.75A5.85 5.85 0 0 1 6.23 12c0-.61.11-1.2.31-1.75V7.72H3.3A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.28l3.24-2.53Z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 6.22c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.27 14.63 2.33 12 2.33a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.94 9.46 6.22 12 6.22Z"
                                        />
                                    </svg>

                                    {googleLoading
                                        ? "Continuing..."
                                        : "Continue with Google"}
                                </button>

                                <div className="my-7 flex items-center gap-4">
                                    <div className="h-px flex-1 bg-[#dadce0]" />
                                    <span className="text-[12px] text-[#80868b]">
                                        OR
                                    </span>
                                    <div className="h-px flex-1 bg-[#dadce0]" />
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    noValidate
                                    className="space-y-5"
                                >
                                    <div>
                                        <label
                                            htmlFor="identifier"
                                            className="mb-1.5 block text-[13px] font-medium text-[#5f6368]"
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
                                            className={inputClass(fieldErrors.identifier)}
                                        />

                                        {fieldErrors.identifier && (
                                            <p className="mt-1.5 text-[12.5px] text-[#d93025]">
                                                {fieldErrors.identifier}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <div className="mb-1.5 flex items-baseline justify-between">
                                            <label
                                                htmlFor="password"
                                                className="block text-[13px] font-medium text-[#5f6368]"
                                            >
                                                Password
                                            </label>

                                            <Link
                                                to="/request-password-reset"
                                                className="rounded px-1 text-[13px] font-medium text-[#1a73e8] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8]"
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
                                                className={`${inputClass(fieldErrors.password)} pr-12`}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#5f6368] transition-colors hover:bg-[#f1f3f4]"
                                                tabIndex={-1}
                                                aria-label={
                                                    showPassword
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                {showPassword
                                                    ? <Eye size={18} />
                                                    : <EyeOff size={18} />
                                                }
                                            </button>
                                        </div>

                                        {fieldErrors.password && (
                                            <p className="mt-1.5 text-[12.5px] text-[#d93025]">
                                                {fieldErrors.password}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={fetching || googleLoading}
                                        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1a73e8] text-[15px] font-medium text-white transition-colors hover:bg-[#1765cc] hover:shadow-[0_1px_2px_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a73e8] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {fetching && (
                                            <svg
                                                className="h-4 w-4 animate-spin"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                        )}

                                        {fetching ? "Signing in..." : "Sign in"}
                                    </button>
                                </form>
                            </div>

                            <p className="mt-6 text-center text-[14px] text-[#5f6368]">
                                New to Taskly?{" "}
                                <Link
                                    to="/register"
                                    className="inline-flex items-center gap-0.5 font-medium text-[#1a73e8] hover:underline"
                                >
                                    Create an account
                                    <ArrowUpRight
                                        size={14}
                                        strokeWidth={2.2}
                                    />
                                </Link>
                            </p>
                        </div>
                    </main>

                    <footer className="flex flex-col items-center gap-3 py-7 sm:flex-row sm:justify-between">
                        <span className="flex items-center gap-1.5 text-[12px] text-[#5f6368]">
                            <Lock size={12} strokeWidth={2.2} />
                            Encrypted sign-in
                        </span>

                        <nav className="flex items-center gap-5 text-[12px] text-[#5f6368]">
                            <Link
                                to="/privacy"
                                className="transition-colors hover:text-[#202124]"
                            >
                                Privacy
                            </Link>

                            <Link
                                to="/terms"
                                className="transition-colors hover:text-[#202124]"
                            >
                                Terms
                            </Link>

                            <Link
                                to="/help"
                                className="transition-colors hover:text-[#202124]"
                            >
                                Help
                            </Link>
                        </nav>
                    </footer>
                </div>
            </div>
        </div>
    )
}

export default LoginCMP

