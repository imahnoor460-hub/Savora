import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [lastPath, setLastPath] = useState(location.pathname);

  const token = localStorage.getItem("token");

  // Close the mobile menu whenever the route changes, including on
  // browser back/forward. Adjusting state during render instead of in
  // an effect avoids a second render pass with the menu still open.
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  const handleLogout = () => {
    setMenuOpen(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav
      className={
        location.pathname === "/reservation"
          ? "navbar navbar-black"
          : "navbar"
      }
    >
      <div className="container">
        <div className="logo">
          <NavLink to="/">Savora</NavLink>
        </div>

        <button
          type="button"
          className={menuOpen ? "nav-toggle nav-toggle-open" : "nav-toggle"}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul
          id="primary-navigation"
          className={menuOpen ? "nav-links nav-links-open" : "nav-links"}
        >
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/menu">Menu</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/reservation">Reserve Table</NavLink></li>
          {token ? (
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          ) : (
            <li><NavLink to="/login">Login</NavLink></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
