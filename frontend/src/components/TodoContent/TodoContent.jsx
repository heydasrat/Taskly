import api from "../Axios/Axios"

import { useDispatch, useSelector } from "react-redux"

import {
    setLoading,
    removeTodo,
    updateTodo,
    toggleTodo
} from "../../app/features/todoSlice"

import { useState } from "react"

import {
    X,
    ListPlus,
    Trash2,
    ChevronDown,
    Check,
    Search
} from "lucide-react"

import TodoCard from "../TodoCard/TodoCard"


const TodoContent = () => {
    const { todos } = useSelector((state) => state.todo)
    const { user } = useSelector((state) => state.auth)

    const dispatch = useDispatch()

    const [showEditTodo, setShowEditTodo] = useState(false)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [selectedTodo, setSelectedTodo] = useState(null)

    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("all")

    const [sort, setSort] = useState("newest")
    const [showSortMenu, setShowSortMenu] = useState(false)

    const [showDeleteBar, setShowDeleteBar] = useState(false)
    const [deleteTodo, setDeleteTodo] = useState(null)

    const theme = user?.preferences?.theme || "light"
    const isDark = theme === "dark"

    /* ---------- theme tokens (same palette as the login page) ---------- */

    const containerClass = isDark
        ? "bg-[#131A22] border-white/10"
        : "bg-white border-[#E2E5E9] shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)]"

    const overlayClass = isDark
        ? "bg-black/60 backdrop-blur-sm"
        : "bg-[#131A22]/45 backdrop-blur-sm"

    const modalClass = isDark
        ? "bg-[#131A22] border border-white/10"
        : "bg-white border border-[#E2E5E9] shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)]"

    const headingClass = isDark ? "text-white" : "text-[#131A22]"

    const labelClass = isDark ? "text-white/70" : "text-[#3D4753]"

    const mutedClass = isDark ? "text-white/45" : "text-[#6B7480]"

    const fieldBase =
        "w-full rounded-[10px] border outline-none " +
        "transition-[border-color,box-shadow] duration-150 " +
        "focus:border-[#1F8A70] focus:shadow-[0_0_0_3.5px_rgba(31,138,112,0.14)] " +
        (isDark
            ? "bg-white/[0.04] border-white/10 text-white placeholder:text-white/30"
            : "bg-white border-[#DCE0E5] text-[#131A22] placeholder:text-[#9AA3AD]")

    const primaryBtn =
        "inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-3 text-[14.5px] font-medium text-white " +
        "shadow-[0_1px_2px_rgba(19,26,34,0.25)] transition-colors duration-150 " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70] focus-visible:ring-offset-2 " +
        "disabled:cursor-not-allowed disabled:opacity-55 " +
        (isDark
            ? "bg-[#1F8A70] hover:bg-[#23997d] focus-visible:ring-offset-[#131A22]"
            : "bg-[#131A22] hover:bg-[#1F2A38] active:bg-[#0D1621] focus-visible:ring-offset-white")

    const dangerBtn =
        "inline-flex items-center justify-center rounded-[10px] bg-[#B42318] px-5 py-3 text-[14.5px] font-medium text-white " +
        "shadow-[0_1px_2px_rgba(19,26,34,0.25)] transition-colors duration-150 hover:bg-[#912018] " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B42318] focus-visible:ring-offset-2 " +
        (isDark ? "focus-visible:ring-offset-[#131A22]" : "focus-visible:ring-offset-white")

    const secondaryBtn =
        "rounded-[10px] border px-5 py-3 text-[14.5px] font-medium transition-colors " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40 " +
        (isDark
            ? "border-white/10 text-white/70 hover:bg-white/5"
            : "border-[#DCE0E5] bg-white text-[#3D4753] hover:bg-[#F6F7F9]")

    const closeIconBtn =
        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors " +
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40 " +
        (isDark
            ? "text-white/40 hover:bg-white/5 hover:text-white"
            : "text-[#9AA3AD] hover:bg-[#F3F5F7] hover:text-[#131A22]")

    const sortLabels = {
        newest: "Newest",
        oldest: "Oldest",
        completed: "Completed first"
    }

    const filterOptions = [
        { value: "all", label: "All" },
        { value: "pending", label: "Pending" },
        { value: "completed", label: "Completed" }
    ]


    const handleDelete = async (id) => {
        try {
            dispatch(setLoading(true))

            const response = await api.delete(`/todo/todos/${id}`)

            if (response.data.success) {
                dispatch(removeTodo(id))
            }
        } catch (error) {
            console.error("Delete todo error:", error)
        } finally {
            dispatch(setLoading(false))
        }
    }


    const handleToggle = async (id) => {
        try {
            dispatch(setLoading(true))

            const response = await api.patch(
                `/todo/todos/${id}/toggle`,
                {},
                {
                    withCredentials: true
                }
            )

            if (response.data.success) {
                dispatch(toggleTodo(response.data.data))
            }
        } catch (error) {
            console.error("Toggle todo error:", error)
        } finally {
            dispatch(setLoading(false))
        }
    }


    const filteredTodos = todos.filter((todo) => {
        const searchValue = search.toLowerCase().trim()

        const matchesSearch =
            todo.title?.toLowerCase().includes(searchValue) ||
            todo.description?.toLowerCase().includes(searchValue)

        const matchesFilter =
            filter === "all" ||
            (filter === "pending" && !todo.isCompleted) ||
            (filter === "completed" && todo.isCompleted)

        return matchesSearch && matchesFilter
    })


    const sortedTodos = [...filteredTodos].sort((a, b) => {
        if (sort === "newest") {
            return new Date(b.createdAt) - new Date(a.createdAt)
        }

        if (sort === "oldest") {
            return new Date(a.createdAt) - new Date(b.createdAt)
        }

        if (sort === "completed") {
            return Number(b.isCompleted) - Number(a.isCompleted)
        }

        return 0
    })


    const handleCloseEdit = () => {
        setSelectedTodo(null)
        setEditTitle("")
        setEditDescription("")
        setShowEditTodo(false)
    }


    const handleEdit = (todo) => {
        setSelectedTodo(todo)
        setEditTitle(todo.title)
        setEditDescription(todo.description || "")
        setShowEditTodo(true)
    }


    const handleUpdateTodo = async () => {
        if (!editTitle.trim() || !selectedTodo) return

        try {
            dispatch(setLoading(true))

            const response = await api.patch(
                `/todo/todos/${selectedTodo._id}`,
                {
                    title: editTitle.trim(),
                    description: editDescription.trim()
                }
            )

            if (response.data.success) {
                dispatch(updateTodo(response.data.data))
                handleCloseEdit()
            }
        } catch (error) {
            console.error("Update todo error:", error)
        } finally {
            dispatch(setLoading(false))
        }
    }

    const handleSortChange = (value) => {
        setSort(value)
        setShowSortMenu(false)
    }


    const handleDeleteClick = (id) => {
        setDeleteTodo(id)
        setShowDeleteBar(true)
    }


    const handleCloseDelete = () => {
        setDeleteTodo(null)
        setShowDeleteBar(false)
    }


    const handleConfirmDelete = async () => {
        if (!deleteTodo) return

        await handleDelete(deleteTodo)

        setDeleteTodo(null)
        setShowDeleteBar(false)
    }


    return (
        <div className="flex w-full justify-center px-4 pb-10">

            <div
                className={`w-full max-w-[800px] rounded-[20px] border p-4 transition-colors duration-200 sm:p-5 ${containerClass}`}
            >

                <div className="mb-3">

                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={16}
                            strokeWidth={2.2}
                            aria-hidden="true"
                            className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 ${
                                isDark ? "text-white/35" : "text-[#9AA3AD]"
                            }`}
                        />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            aria-label="Search your todos"
                            placeholder="Search your todos..."
                            className={`${fieldBase} h-11 pl-10 pr-3.5 text-[14.5px]`}
                        />
                    </div>


                    <div className="mt-3.5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                        {/* Segmented filter */}
                        <div
                            role="group"
                            aria-label="Filter todos"
                            className={`grid grid-cols-3 gap-1 rounded-[10px] p-1 ${
                                isDark ? "bg-white/[0.06]" : "bg-[#EDEFF2]"
                            }`}
                        >
                            {filterOptions.map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setFilter(item.value)}
                                    aria-pressed={filter === item.value}
                                    className={`h-8 rounded-lg px-4 text-[13.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40 ${
                                        filter === item.value
                                            ? isDark
                                                ? "bg-white/10 text-white"
                                                : "bg-white text-[#131A22] shadow-[0_1px_2px_rgba(19,26,34,0.08)]"
                                            : isDark
                                                ? "text-white/45 hover:text-white/80"
                                                : "text-[#6B7480] hover:text-[#131A22]"
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>


                        {/* Sort */}
                        <div className="relative">

                            <button
                                type="button"
                                onClick={() => setShowSortMenu((prev) => !prev)}
                                aria-haspopup="listbox"
                                aria-expanded={showSortMenu}
                                className={`flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border px-3.5 text-[13.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40 sm:w-auto ${
                                    isDark
                                        ? "border-white/10 text-white/70 hover:bg-white/5"
                                        : "border-[#DCE0E5] bg-white text-[#3D4753] hover:bg-[#F6F7F9]"
                                }`}
                            >
                                <span>Sort: {sortLabels[sort]}</span>

                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-200 ${
                                        showSortMenu ? "rotate-180" : ""
                                    }`}
                                />
                            </button>


                            <div
                                role="listbox"
                                className={`absolute right-0 top-12 z-30 w-52 origin-top-right overflow-hidden rounded-[14px] border p-1.5 transition-all duration-150 ${
                                    showSortMenu
                                        ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
                                        : "pointer-events-none -translate-y-1 scale-95 opacity-0"
                                } ${
                                    isDark
                                        ? "border-white/10 bg-[#131A22] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]"
                                        : "border-[#E2E5E9] bg-white shadow-[0_1px_2px_rgba(19,26,34,0.04),0_16px_40px_-12px_rgba(19,26,34,0.22)]"
                                }`}
                            >
                                {Object.entries(sortLabels).map(([value, label]) => (
                                    <button
                                        key={value}
                                        type="button"
                                        role="option"
                                        aria-selected={sort === value}
                                        tabIndex={showSortMenu ? 0 : -1}
                                        onClick={() => handleSortChange(value)}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40 ${
                                            isDark
                                                ? "text-white/70 hover:bg-white/5 hover:text-white"
                                                : "text-[#3D4753] hover:bg-[#F3F5F7] hover:text-[#131A22]"
                                        }`}
                                    >
                                        <span>{label}</span>

                                        {sort === value && (
                                            <Check
                                                size={16}
                                                strokeWidth={2.4}
                                                className="text-[#1F8A70]"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                        </div>

                    </div>

                </div>


                <TodoCard
                    filteredTodosArray={sortedTodos}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onToggle={handleToggle}
                />


                {/* ---------------- Edit modal ---------------- */}
                {showEditTodo && (

                    <div
                        className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${overlayClass}`}
                    >

                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label="Edit todo"
                            className={`w-full max-w-[560px] rounded-[20px] p-6 sm:p-8 ${modalClass}`}
                        >

                            <div className="mb-7 flex items-start justify-between">

                                <div className="flex items-center gap-3">

                                    <div
                                        className={`grid h-9 w-9 place-items-center rounded-[10px] text-white ${
                                            isDark
                                                ? "bg-white/10 ring-1 ring-inset ring-white/15"
                                                : "bg-[#131A22]"
                                        }`}
                                    >
                                        <ListPlus size={17} strokeWidth={2.2} />
                                    </div>


                                    <div>

                                        <h2
                                            className={`text-[22px] font-semibold tracking-[-0.03em] ${headingClass}`}
                                        >
                                            Edit todo
                                        </h2>

                                        <p className={`mt-0.5 text-[13px] ${mutedClass}`}>
                                            Update the details of your todo.
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={handleCloseEdit}
                                    aria-label="Close"
                                    className={closeIconBtn}
                                >
                                    <X size={19} />
                                </button>

                            </div>


                            <div>

                                <label
                                    htmlFor="edit-todo-title"
                                    className={`mb-1.5 block text-[13px] font-medium ${labelClass}`}
                                >
                                    Title <span className="text-[#B42318]">*</span>
                                </label>


                                <input
                                    id="edit-todo-title"
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                    placeholder="e.g. Complete today's assignment"
                                    autoFocus
                                    className={`${fieldBase} px-3.5 py-3 text-[14.5px]`}
                                />

                            </div>


                            <div className="mt-5">

                                <label
                                    htmlFor="edit-todo-description"
                                    className={`mb-1.5 block text-[13px] font-medium ${labelClass}`}
                                >
                                    Description
                                </label>


                                <textarea
                                    id="edit-todo-description"
                                    value={editDescription}
                                    onChange={(e) =>
                                        setEditDescription(e.target.value)
                                    }
                                    placeholder="Add some details about this todo..."
                                    rows={4}
                                    className={`${fieldBase} resize-none px-3.5 py-3 text-[14.5px]`}
                                />


                                <p className={`mt-1.5 text-[12.5px] ${mutedClass}`}>
                                    Add enough detail so you know exactly what
                                    needs to be done.
                                </p>

                            </div>


                            <div className="mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">

                                <button
                                    type="button"
                                    onClick={handleCloseEdit}
                                    className={secondaryBtn}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={handleUpdateTodo}
                                    disabled={!editTitle.trim()}
                                    className={primaryBtn}
                                >
                                    Save changes
                                </button>

                            </div>

                        </div>

                    </div>

                )}


                {/* ---------------- Delete modal ---------------- */}
                {showDeleteBar && (

                    <div
                        className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${overlayClass}`}
                    >

                        <div
                            role="alertdialog"
                            aria-modal="true"
                            aria-label="Delete todo"
                            className={`w-full max-w-[420px] rounded-[20px] p-6 ${modalClass}`}
                        >

                            <div className="flex items-start gap-4">

                                <div
                                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-[10px] ${
                                        isDark
                                            ? "bg-red-500/10 text-red-400"
                                            : "bg-[#FEF3F2] text-[#B42318]"
                                    }`}
                                >
                                    <Trash2 size={19} strokeWidth={2.2} />
                                </div>


                                <div>

                                    <h2
                                        className={`text-[20px] font-semibold tracking-[-0.03em] ${headingClass}`}
                                    >
                                        Delete todo?
                                    </h2>


                                    <p
                                        className={`mt-1.5 text-[14px] leading-relaxed ${mutedClass}`}
                                    >
                                        Are you sure you want to delete this
                                        todo? This action cannot be undone.
                                    </p>

                                </div>

                            </div>


                            <div className="mt-7 flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={handleCloseDelete}
                                    className={secondaryBtn}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    className={dangerBtn}
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    )
}


export default TodoContent