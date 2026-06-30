import "./Header.css";

function Header({ user, logout, menuOpen, setMenuOpen }) {
  return (
    <header className="header">
      <div className="header-brand">
        <h1>REMANERE</h1>
        <span>GROUPWARE SYSTEM</span>
      </div>

      <div className="header-right">
        <button className="alarm-btn">🔔</button>

        <div className="header-user">
          <strong>{user.codename}</strong>
          <span>{user.role}</span>
        </div>

        <button className="logout-btn" onClick={logout}>
          로그아웃
        </button>

        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}

export default Header;