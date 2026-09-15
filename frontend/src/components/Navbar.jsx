import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(location.pathname);

  const token = localStorage.getItem("token");

  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  // The drawer covers the viewport, so the page behind it must not scroll —
  // otherwise a swipe on the drawer scrolls the page underneath instead.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="savora-navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <NavLink to="/" className="navbar-brand">
          <span className="brand-icon">S</span>
          <span className="brand-title">SAVORA</span>
        </NavLink>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className={menuOpen ? "nav-toggle nav-toggle-open" : "nav-toggle"}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation Links */}
        <ul className={menuOpen ? "nav-links nav-links-open" : "nav-links"}>
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
               Menu
            </NavLink>
          </li>
          <li>
            <NavLink to="/story" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
              Story
            </NavLink>
          </li>
          <li>
            <NavLink to="/reservation" className="btn-reserve-link">
              <button type="button" className="btn-reserve">
                Reserve Table
              </button>
            </NavLink>
          </li>
          {token ? (
            <li>
              <button type="button" onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          ) : (
            <li>
              <NavLink to="/login" className="nav-login-btn">
                Login
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;