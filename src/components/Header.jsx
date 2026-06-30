function Header({ user, logout, menuOpen, setMenuOpen }) {
  return (
    <header className="header">

      <div className="header-left">
        <h2 className="logo">REMANERE</h2>
        <span className="logo-sub">Groupware</span>
      </div>

      <div className="header-right">

        <button className="icon-btn">
          🔔
        </button>

        <div className="user-info">
          <span className="user-name">
            {user.codename}
          </span>

          <span className="user-role">
            {user.role}
          </span>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
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