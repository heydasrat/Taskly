import React, { useEffect, useState } from "react"

import api from "../Axios/Axios.js"

import { useDispatch, useSelector } from "react-redux"

import { addTodo } from "../../app/features/todoSlice.js"

import {
  X,
  ListPlus,
  AlertCircle,
  Loader2
} from "lucide-react"

import TodoContent from "../TodoContent/TodoContent.jsx"
import TodoHeader from "../TodoHeader/TodoHeader"

const Todo = () => {
  const [showAddTodo, setShowAddTodo] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [todoError, setTodoError] = useState("")
  const [todoLoading, setTodoLoading] = useState(false)

  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)

  const theme = user?.preferences?.theme || "light"
  const isDark = theme === "dark"

  /* ---------- theme tokens (same palette as the login page) ---------- */

  const pageClass = isDark
    ? "bg-[#0C1117] text-white"
    : "bg-[#EDEFF2] text-[#131A22]"

  const overlayClass = isDark
    ? "bg-black/60 backdrop-blur-sm"
    : "bg-[#131A22]/45 backdrop-blur-sm"

  const modalClass = isDark
    ? "bg-[#131A22] border border-white/10"
    : "bg-white border border-[#E2E5E9] shadow-[0_1px_2px_rgba(19,26,34,0.04),0_12px_32px_-12px_rgba(19,26,34,0.14)]"

  const headingClass = isDark ? "text-white" : "text-[#131A22]"

  const labelClass = isDark ? "text-white/70" : "text-[#3D4753]"

  const mutedClass = isDark ? "text-white/45" : "text-[#6B7480]"

  const inputClass =
    "w-full rounded-[10px] border px-3.5 py-3 text-[14.5px] outline-none " +
    "transition-[border-color,box-shadow] duration-150 " +
    "focus:border-[#1F8A70] focus:shadow-[0_0_0_3.5px_rgba(31,138,112,0.14)] disabled:opacity-60 " +
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

  const secondaryBtn =
    "rounded-[10px] border px-5 py-3 text-[14.5px] font-medium transition-colors " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40 disabled:opacity-50 " +
    (isDark
      ? "border-white/10 text-white/70 hover:bg-white/5"
      : "border-[#DCE0E5] bg-white text-[#3D4753] hover:bg-[#F6F7F9]")

  useEffect(() => {
    if (!showAddTodo) {
      setTodoError("")
    }
  }, [showAddTodo])

  const handleCreateTodo = async () => {
    if (!title.trim()) {
      setTodoError("Todo title cannot be empty.")
      return
    }

    setTodoError("")
    setTodoLoading(true)

    try {
      const response = await api.post("/todo/todos", {
        title: title.trim(),
        description: description.trim() || ""
      })

      if (response.data.success) {
        dispatch(addTodo(response.data.data))

        setTitle("")
        setDescription("")
        setTodoError("")
        setShowAddTodo(false)
      } else {
        setTodoError(
          response.data.message || "Failed to create todo."
        )
      }
    } catch (error) {
      setTodoError(
        error.response?.data?.message ||
          "Unable to create todo. Please try again."
      )
    } finally {
      setTodoLoading(false)
    }
  }

  const handleClose = () => {
    if (todoLoading) return

    setTitle("")
    setDescription("")
    setTodoError("")
    setShowAddTodo(false)
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter" && !todoLoading) {
      e.preventDefault()
      handleCreateTodo()
    }
  }

  return (
    <div
      className={`tk-root w-full min-h-screen antialiased transition-colors duration-200 ${pageClass}`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400..700;1,400..700&display=swap');
        .tk-root{font-family:'Instrument Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-feature-settings:'ss01','cv01';}
      `}</style>

      <div className="flex justify-center px-4">
        <TodoHeader
          onAddTodo={() => {
            setTodoError("")
            setShowAddTodo(true)
          }}
        />

        {showAddTodo && (
          <div
            className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${overlayClass}`}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="New todo"
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
                      New todo
                    </h2>

                    <p className={`mt-0.5 text-[13px] ${mutedClass}`}>
                      Add something you want to accomplish.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={todoLoading}
                  aria-label="Close"
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1F8A70]/40 disabled:opacity-50 ${
                    isDark
                      ? "text-white/40 hover:bg-white/5 hover:text-white"
                      : "text-[#9AA3AD] hover:bg-[#F3F5F7] hover:text-[#131A22]"
                  }`}
                >
                  <X size={19} />
                </button>
              </div>

              {todoError && (
                <div
                  className={`mb-5 flex items-start gap-3 rounded-[10px] border p-3.5 text-[13.5px] ${
                    isDark
                      ? "border-red-500/20 bg-red-500/10 text-red-400"
                      : "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]"
                  }`}
                >
                  <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" />

                  <span className="font-medium">{todoError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="todo-title"
                  className={`mb-1.5 block text-[13px] font-medium ${labelClass}`}
                >
                  Title <span className="text-[#B42318]">*</span>
                </label>

                <input
                  id="todo-title"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value)
                    setTodoError("")
                  }}
                  onKeyDown={handleTitleKeyDown}
                  placeholder="e.g. Complete today's assignment"
                  autoFocus
                  disabled={todoLoading}
                  className={inputClass}
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="todo-description"
                  className={`mb-1.5 block text-[13px] font-medium ${labelClass}`}
                >
                  Description
                </label>

                <textarea
                  id="todo-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add some details about this todo..."
                  rows={4}
                  disabled={todoLoading}
                  className={`${inputClass} resize-none`}
                />

                <p className={`mt-1.5 text-[12.5px] ${mutedClass}`}>
                  Add enough detail so you know exactly what needs to be done.
                </p>
              </div>

              <div className="mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={todoLoading}
                  className={secondaryBtn}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCreateTodo}
                  disabled={!title.trim() || todoLoading}
                  className={primaryBtn}
                >
                  {todoLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ListPlus className="h-4 w-4" />
                      Create todo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <TodoContent />
    </div>
  )
}

export default Todo