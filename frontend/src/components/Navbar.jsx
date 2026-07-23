import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
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

        <ul className="nav-links">
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