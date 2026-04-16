import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { roleHomePath, useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="site-brand" onClick={closeMenu}>
          <div className="site-brand__icon">
            <img
              src={logo}
              alt="CareSync360"
              style={{ width: 32, height: 32, borderRadius: 8 }}
            />
          </div>
          <div className="site-brand__text">
            <span className="site-brand__name">CareSync360</span>
            <span className="site-brand__tagline">Healthcare Platform</span>
          </div>
        </Link>

        <button
          type="button"
          className="site-header__toggle"
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="site-header__toggle-line"></span>
          <span className="site-header__toggle-line"></span>
          <span className="site-header__toggle-line"></span>
        </button>

        <div
          id="public-navigation"
          className={`site-header__panel${menuOpen ? " is-open" : ""}`}
        >
          <nav className="site-nav">
            <NavLink to="/" end onClick={closeMenu} className="site-nav__link">
              Home
            </NavLink>
            <NavLink
              to="/doctors"
              onClick={closeMenu}
              className="site-nav__link"
            >
              Doctors
            </NavLink>
            <Link
              to="/#platform-features"
              onClick={closeMenu}
              className="site-nav__link"
            >
              Features
            </Link>
          </nav>

          <div className="site-header__actions">
            {isAuthenticated ? (
              <>
                <div className="site-user">
                  <div className="site-user__avatar">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="site-user__info">
                    <span className="site-user__name">
                      {user?.name || "User"}
                    </span>
                    <span className="site-user__role">
                      {user?.role?.toLowerCase() || "patient"} workspace
                    </span>
                  </div>
                </div>
                <Link
                  className="btn btn-outline"
                  to={roleHomePath(user?.role)}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-outline"
                  to="/login"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  className="btn btn-primary"
                  to="/register-patient"
                  onClick={closeMenu}
                >
                  Start Care Journey
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
