import React from "react"

import { Check, Pencil, Trash2 } from "lucide-react"

import { useSelector } from "react-redux"

const TodoCard = ({
    filteredTodosArray,
    onEdit,
    onDelete,
    onToggle
}) => {
    const { todos, isLoading } = useSelector((state) => state.todo)
    const { user } = useSelector((state) => state.auth)

    const filteredTodosArr = filteredTodosArray ?? todos

    const theme = user?.preferences?.theme || "light"
    const isDark = theme === "dark"

    /* ---------- theme tokens (same palette as the login page) ---------- */

    const headingClass = isDark ? "text-white" : "text-[#131A22]"
    const mutedClass = isDark ? "text-white/45" : "text-[#6B7480]"

    const emptyIconClass = isDark
        ? "bg-white/10 text-white/60"
        : "bg-[#EDEFF2] text-[#6B7480]"

    const actionBase =
        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40"

    if (isLoading) {
        return (
            <div className="w-full space-y-2.5">
                {[1, 2, 3].map((item) => (
                    <div
                        key={item}
                        className={`h-14 animate-pulse rounded-[10px] ${
                            isDark ? "bg-white/[0.06]" : "bg-[#EDEFF2]"
                        }`}
                    />
                ))}
            </div>
        )
    }

    if (!todos || todos.length === 0) {
        return (
            <div className="w-full py-14 text-center">
                <div
                    className={`mx-auto mb-4 grid h-10 w-10 place-items-center rounded-[10px] ${emptyIconClass}`}
                >
                    <Check size={20} strokeWidth={2.2} />
                </div>

                <h3
                    className={`text-[16px] font-semibold tracking-[-0.02em] ${headingClass}`}
                >
                    No todos yet
                </h3>

                <p className={`mt-1 text-[14px] ${mutedClass}`}>
                    Create your first todo to get started.
                </p>
            </div>
        )
    }

    if (filteredTodosArr.length === 0) {
        return (
            <div className="w-full py-14 text-center">
                <div
                    className={`mx-auto mb-4 grid h-10 w-10 place-items-center rounded-[10px] ${emptyIconClass}`}
                >
                    <Check size={20} strokeWidth={2.2} />
                </div>

                <h3
                    className={`text-[16px] font-semibold tracking-[-0.02em] ${headingClass}`}
                >
                    No todos found
                </h3>

                <p className={`mt-1 text-[14px] ${mutedClass}`}>
                    Try changing your search or filter.
                </p>
            </div>
        )
    }

    return (
        <ul
            className={`w-full divide-y ${
                isDark ? "divide-white/[0.06]" : "divide-[#EEF0F3]"
            }`}
        >
            {filteredTodosArr.map((todo) => (
                <li
                    key={todo._id}
                    className={`group flex items-center gap-3.5 rounded-lg px-2 py-3.5 transition-colors ${
                        isDark ? "hover:bg-white/[0.03]" : "hover:bg-[#F6F7F9]"
                    }`}
                >
                    {/* Checkbox — same square + green check as the login preview */}
                    <button
                        type="button"
                        onClick={() => onToggle?.(todo._id)}
                        aria-label={
                            todo.isCompleted
                                ? "Mark todo as incomplete"
                                : "Mark todo as complete"
                        }
                        aria-pressed={!!todo.isCompleted}
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/50 ${
                            todo.isCompleted
                                ? "bg-[#1F8A70] text-white"
                                : `ring-1 ring-inset hover:ring-[#1F8A70] ${
                                      isDark ? "ring-white/25" : "ring-[#C4CAD1]"
                                  }`
                        }`}
                    >
                        {todo.isCompleted && (
                            <svg
                                viewBox="0 0 16 16"
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M3.5 8.4 6.4 11.3 12.5 4.9" />
                            </svg>
                        )}
                    </button>

                    <div className="min-w-0 flex-1">
                        <h3
                            className={`truncate text-[14.5px] font-medium leading-snug ${
                                todo.isCompleted
                                    ? isDark
                                        ? "text-white/35 line-through decoration-white/25"
                                        : "text-[#9AA3AD] line-through decoration-[#C4CAD1]"
                                    : isDark
                                        ? "text-white/85"
                                        : "text-[#131A22]"
                            }`}
                        >
                            {todo.title}
                        </h3>

                        {todo.description && (
                            <p
                                className={`mt-0.5 line-clamp-2 text-[13px] leading-snug ${
                                    todo.isCompleted
                                        ? isDark
                                            ? "text-white/25"
                                            : "text-[#B4BBC3]"
                                        : mutedClass
                                }`}
                            >
                                {todo.description}
                            </p>
                        )}
                    </div>

                    {/* Always visible on touch screens, hover/focus on desktop */}
                    <div className="flex shrink-0 items-center gap-0.5 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                        <button
                            type="button"
                            onClick={() => onEdit?.(todo)}
                            aria-label="Edit todo"
                            className={`${actionBase} ${
                                isDark
                                    ? "text-white/40 hover:bg-white/5 hover:text-white"
                                    : "text-[#9AA3AD] hover:bg-[#EDEFF2] hover:text-[#131A22]"
                            }`}
                        >
                            <Pencil size={16} />
                        </button>

                        <button
                            type="button"
                            onClick={() => onDelete?.(todo._id)}
                            aria-label="Delete todo"
                            className={`${actionBase} ${
                                isDark
                                    ? "text-white/40 hover:bg-red-500/10 hover:text-red-400"
                                    : "text-[#9AA3AD] hover:bg-[#FEF3F2] hover:text-[#B42318]"
                            }`}
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default TodoCard