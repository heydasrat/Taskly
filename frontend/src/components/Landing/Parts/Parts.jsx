import { memo } from "react";
import { Link } from "react-router-dom";
import { Check, Menu, Search, X } from "lucide-react";
// import { navItems, previewFilters, previewTasks } from "./data.js";
import { navItems,previewFilters,previewTasks } from "../Data/Data";

export const Wordmark = memo(() => (
  <span className="tk-wordmark">
    <span className="tk-mark">
      <Check size={16} strokeWidth={3} />
    </span>
    <span className="tk-wordmark__text">Taskly</span>
  </span>
));

const TaskRow = memo(({ label, meta, done }) => (
  <li className="tk-task" data-done={done}>
    <span className="tk-task__check">
      {done && <Check size={12} strokeWidth={3} />}
    </span>
    <span className="tk-task__label">{label}</span>
    <span className="tk-task__meta">{meta}</span>
  </li>
));

export const TaskPreview = memo(() => {
  const doneCount = previewTasks.filter((t) => t.done).length;

  return (
    <div className="tk-preview" aria-hidden="true">
      <div className="tk-preview__head">
        <strong>Today</strong>
        <span>
          {doneCount} of {previewTasks.length} done
        </span>
      </div>

      <div className="tk-progress">
        <span style={{ width: `${(doneCount / previewTasks.length) * 100}%` }} />
      </div>

      <div className="tk-search">
        <Search size={16} />
        <span>Search your tasks</span>
      </div>

      <div className="tk-chips">
        {previewFilters.map((name, i) => (
          <span key={name} className="tk-chip" data-active={i === 0}>
            {name}
          </span>
        ))}
      </div>

      <ul className="tk-tasks">
        {previewTasks.map((task) => (
          <TaskRow key={task.label} {...task} />
        ))}
      </ul>
    </div>
  );
});

export const Header = ({ user, open, onToggle, onClose }) => {
  const authed = Boolean(user);

  return (
    <header className="tk-header">
      <div className="tk-container tk-header__bar">
        <Link to={authed ? "/dashboard" : "/"} aria-label="Taskly home">
          <Wordmark />
        </Link>

        <nav className="tk-nav" aria-label="Primary">
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} className="tk-link">
              {label}
            </a>
          ))}
        </nav>

        <div className="tk-actions">
          {authed ? (
            <Link to="/dashboard" className="tk-btn tk-btn--filled">
              Home
            </Link>
          ) : (
            <>
              <Link to="/login" className="tk-btn tk-btn--text">
                Sign in
              </Link>
              <Link to="/register" className="tk-btn tk-btn--filled">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="tk-menu-btn"
          onClick={onToggle}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="tk-mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div id="tk-mobile-menu" className="tk-mobile">
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} onClick={onClose} className="tk-mobile__link">
              {label}
            </a>
          ))}
          {authed ? (
            <Link to="/dashboard" onClick={onClose} className="tk-btn tk-btn--filled">
              Home
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={onClose} className="tk-btn tk-btn--outlined">
                Sign in
              </Link>
              <Link to="/register" onClick={onClose} className="tk-btn tk-btn--filled">
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};