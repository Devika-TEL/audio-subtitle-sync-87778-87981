import { Link, NavLink } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="nav-left">
        <Link to="/" className="brand">
          🎬 Audio-Subtitle Sync
        </Link>
      </div>
      <div className="nav-right">
        <NavLink to="/upload" className="nav-item">
          Upload
        </NavLink>
        <NavLink to="/jobs" className="nav-item">
          Jobs
        </NavLink>
        <NavLink to="/manage" className="nav-item">
          Manage
        </NavLink>
        <NavLink to="/translate" className="nav-item">
          Translate
        </NavLink>
        <NavLink to="/admin" className="nav-item">
          Admin
        </NavLink>
      </div>
    </nav>
  );
}
