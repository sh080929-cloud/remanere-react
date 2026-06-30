function Login({
  codename,
  setCodename,
  pw,
  setPw,
  login,
}) {
  return (
    <div className="login-page">
      <div className="login-box">

        <h1>REMANERE</h1>
        <p>GROUPWARE</p>

        <input
          placeholder="코드네임"
          value={codename}
          onChange={(e) => setCodename(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />

        <button onClick={login}>
          로그인
        </button>

      </div>
    </div>
  );
}

export default Login;