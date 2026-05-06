export default function Footer() {
  return (
    <footer style={{ padding: "1rem", background: "#111", color: "#fff", marginTop: "2rem" }}>
      <p>© {new Date().getFullYear()} <a href="https://github.com/alexmarpar/safeinternet">safeinternet</a></p>
    </footer>
  );
}