import { useSelector } from "react-redux"
import { Plus } from "lucide-react"

const TodoHeader = ({ onAddTodo }) => {
    const todos = useSelector((state) => state.todo.todos)
    const user = useSelector((state) => state.auth.user)

    const allTodos = todos.length
    const completedTodos = todos.filter((todo) => todo.isCompleted).length
    const pendingTodos = todos.filter((todo) => !todo.isCompleted).length
    const progress = allTodos ? Math.round((completedTodos / allTodos) * 100) : 0

    const theme = user?.preferences?.theme || "light"
    const isDark = theme === "dark"

    const headingClass = isDark ? "text-white" : "text-[#131A22]"
    const descriptionClass = isDark ? "text-white/45" : "text-[#6B7480]"
    const labelClass = isDark ? "text-white/45" : "text-[#6B7480]"
    const countClass = isDark ? "text-white/90" : "text-[#131A22]"
    const trackClass = isDark ? "bg-white/10" : "bg-[#DCE0E5]"

    return (
        <div className="w-full max-w-[800px] pt-8 pb-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1
                        className={`text-[27px] font-semibold tracking-[-0.03em] ${headingClass}`}
                    >
                        My todos
                    </h1>

                    <p className={`mt-1.5 text-[14px] ${descriptionClass}`}>
                        Keep track of what you need to get done with clarity.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onAddTodo}
                    className={`inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-4 py-2.5 text-[14.5px] font-medium text-white shadow-[0_1px_2px_rgba(19,26,34,0.25)] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2 ${
                        isDark
                            ? "bg-[#1F8A70] hover:bg-[#23997d] focus-visible:ring-offset-[#0C1117]"
                            : "bg-[#131A22] hover:bg-[#1F2A38] active:bg-[#0D1621] focus-visible:ring-offset-[#EDEFF2]"
                    }`}
                >
                    <Plus size={18} strokeWidth={2.4} />
                    <span>Add todo</span>
                </button>
            </div>

            <div className="mt-6 flex items-center gap-5 text-[13px] tabular-nums">
                <span className={labelClass}>
                    All{" "}
                    <span className={`font-semibold ${countClass}`}>
                        {allTodos}
                    </span>
                </span>

                <span className={labelClass}>
                    Completed{" "}
                    <span className="font-semibold text-[#1F8A70]">
                        {completedTodos}
                    </span>
                </span>

                <span className={labelClass}>
                    Pending{" "}
                    <span
                        className={`font-semibold ${
                            isDark ? "text-amber-400" : "text-amber-600"
                        }`}
                    >
                        {pendingTodos}
                    </span>
                </span>
            </div>

            <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label="Completed todos"
                className={`mt-3 h-[3px] w-full overflow-hidden rounded-full ${trackClass}`}
            >
                <div
                    className="h-full rounded-full bg-[#1F8A70] transition-[width] duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}

export default TodoHeader