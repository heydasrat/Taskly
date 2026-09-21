import { useState } from "react"
import { Link } from "react-router-dom"
import {
    LogOut,
    ChevronDown,
    Settings,
    User,
    MessageSquare,
    Lock
} from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import api from "../Axios/Axios.js"
import { logout } from "../../app/features/authSlice.js"

const Navbar = () => {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false)

    const { user } = useSelector((state) => state.auth)

    const theme = user?.preferences?.theme || "light"
    const isDark = theme === "dark"

    const handleLogout = async () => {
        try {
            await api.post(
                "/auth/logout",
                {},
                { withCredentials: true }
            )
        } catch (error) {
            console.error("Logout error:", error)
        } finally {
            dispatch(logout())
        }
    }

 

    const headerClass = isDark
        ? "border-white/10 bg-[#0C1117]/85"
        : "border-[#E2E5E9] bg-white/85"

    const textClass = isDark ? "text-white" : "text-[#131A22]"

    const mutedClass = isDark ? "text-white/45" : "text-[#6B7480]"

    const hoverClass = isDark ? "hover:bg-white/5" : "hover:bg-[#F3F5F7]"

    const menuClass = isDark
        ? "border-white/10 bg-[#131A22] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]"
        : "border-[#E2E5E9] bg-white shadow-[0_1px_2px_rgba(19,26,34,0.04),0_16px_40px_-12px_rgba(19,26,34,0.22)]"

    const dividerBorder = isDark ? "border-white/10" : "border-[#EDEFF2]"
    const dividerBg = isDark ? "bg-white/10" : "bg-[#EDEFF2]"

    const itemBase =
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40"

    const itemClass = isDark
        ? "text-white/70 hover:bg-white/5 hover:text-white"
        : "text-[#3D4753] hover:bg-[#F3F5F7] hover:text-[#131A22]"

    const logoutClass = isDark
        ? "text-white/60 hover:bg-red-500/10 hover:text-red-400"
        : "text-[#3D4753] hover:bg-[#FEF3F2] hover:text-[#B42318]"

    return (
        <header
            className={`tk-root sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-200 ${headerClass}`}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
                .tk-root{font-family:'Instrument Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-feature-settings:'ss01','cv01';}
            `}</style>

            <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
                {/* Wordmark — same as the login page */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40"
                >
                    <div
                        className={`grid h-8 w-8 place-items-center rounded-[10px] text-white ${
                            isDark
                                ? "bg-white/10 ring-1 ring-inset ring-white/15"
                                : "bg-[#131A22]"
                        }`}
                    >
                        <Lock size={15} strokeWidth={2.2} />
                    </div>

                    <span
                        className={`text-[17px] font-semibold tracking-[-0.02em] ${textClass}`}
                    >
                        Taskly
                    </span>
                </Link>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowMenu(!showMenu)}
                        aria-haspopup="menu"
                        aria-expanded={showMenu}
                        className={`flex items-center gap-2.5 rounded-[10px] px-2 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40 ${hoverClass}`}
                    >
                        {user?.avatar?.url ? (
                            <img
                                src={user.avatar.url}
                                alt="Profile"
                                className={`h-9 w-9 rounded-full object-cover ring-2 ${
                                    isDark ? "ring-white/10" : "ring-[#E2E5E9]"
                                }`}
                            />
                        ) : (
                            <div
                                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                    isDark
                                        ? "bg-white/10 text-white/70"
                                        : "bg-[#EDEFF2] text-[#6B7480]"
                                }`}
                            >
                                <User size={18} strokeWidth={2} />
                            </div>
                        )}

                        <div className="hidden text-left sm:block">
                            <p
                                className={`text-[13.5px] font-medium leading-tight ${textClass}`}
                            >
                                {user?.username ||
                                    user?.name ||
                                    "User"}
                            </p>

                            <p
                                className={`mt-0.5 max-w-[150px] truncate text-[12px] ${mutedClass}`}
                            >
                                {user?.email || "Account"}
                            </p>
                        </div>

                        <ChevronDown
                            size={16}
                            strokeWidth={2}
                            className={`ml-0.5 transition-transform duration-200 ${mutedClass} ${
                                showMenu ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {showMenu && (
                        <div
                            role="menu"
                            className={`absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-[14px] border p-1.5 ${menuClass}`}
                        >
                            <div className={`mb-1 border-b px-3 py-2.5 ${dividerBorder}`}>
                                <p
                                    className={`truncate text-[13.5px] font-medium ${textClass}`}
                                >
                                    {user?.fullName ||
                                        user?.username ||
                                        "User"}
                                </p>

                                <p
                                    className={`mt-0.5 truncate text-[12px] ${mutedClass}`}
                                >
                                    {user?.email || "Account"}
                                </p>
                            </div>

                            <Link
                                to="/setting"
                                role="menuitem"
                                onClick={() => setShowMenu(false)}
                                className={`${itemBase} ${itemClass}`}
                            >
                                <Settings size={17} strokeWidth={2} />
                                <span>Settings</span>
                            </Link>

                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => {
                                    setShowMenu(false)
                                    window.open(
                                        "https://forms.google.com/your-feedback-form",
                                        "_blank",
                                        "noopener,noreferrer"
                                    )
                                }}
                                className={`${itemBase} ${itemClass}`}
                            >
                                <MessageSquare size={17} strokeWidth={2} />
                                <span>Give feedback</span>
                            </button>

                            <div className={`my-1 h-px ${dividerBg}`} />

                            <button
                                onClick={handleLogout}
                                type="button"
                                role="menuitem"
                                className={`${itemBase} ${logoutClass}`}
                            >
                                <LogOut size={17} strokeWidth={2} />
                                <span>Log out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Navbar