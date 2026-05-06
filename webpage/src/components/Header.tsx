import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ padding: "1rem", width: "100%", background: "#111", color: "#fff" }}>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
}