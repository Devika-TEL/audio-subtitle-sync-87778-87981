import { Link, NavLink } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="nav-left">
        <Link to="/" className="brand">
          🎬 Subtitle QC & Reposition
        </Link>
      </div>
      <div className="nav-right">
        <NavLink to="/upload" className="nav-item">
          Upload
        </NavLink>
      </div>
    </nav>
  );
}
