import { useState, useEffect } from "react";
import "./App.css";

function App() {
  // 🔐 로그인 상태 (로컬 저장 연동)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [codename, setCodename] = useState("");
  const [pw, setPw] = useState("");
  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("홈");

  const [draftOpen, setDraftOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [status, setStatus] = useState("작성중");

  const [draftList, setDraftList] = useState([]);

  // 🔐 유저 DB
  const users = [
    { codename: "루멘", pw: "0505", role: "사장" },
    { codename: "시드", pw: "0813", role: "부장" },
    { codename: "에스", pw: "0724", role: "부장" },
    { codename: "마포크", pw: "0204", role: "사원" },
    { codename: "엔터", pw: "0705", role: "사원" },
    { codename: "아스칼", pw: "0110", role: "사원" },
    { codename: "마르코르", pw: "0821", role: "사원" },
    { codename: "에리카", pw: "1111", role: "사원" },
    { codename: "문", pw: "1001", role: "사원" }
  ];

  const menu = [
    { title: "소통", items: ["공지사항", "사내메일"] },
    { title: "업무", items: ["일정관리", "전자결재"] },
    { title: "시설·서비스", items: ["시설 안내도", "복지"] },
    { title: "바로가기", items: ["부장 호출", "사장 호출"] }
  ];

  // 🔁 로그인 유지 (localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setIsLoggedIn(true);
    }
  }, []);

  // 🔐 로그인
  const login = () => {
    const found = users.find(
      (u) => u.codename === codename && u.pw === pw
    );

    if (!found) {
      alert("로그인 실패");
      return;
    }

    setUser(found);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(found));
  };

  // 🚪 로그아웃
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  const handleClick = (item) => {
    if (item === "전자결재") {
      setPage("전자결재");
      setMenuOpen(false);
      return;
    }

    setPage(item);
    setMenuOpen(false);
  };

  const openDoc = (doc) => {
    setSelectedDoc(doc);
    setDraftOpen(false);
    setStatus("작성중");
  };

  // 📄 기안 제출 → 결재함 저장
  const submitDraft = () => {
    const newDraft = {
      id: Date.now(),
      doc: selectedDoc,
      writer: user.codename,
      role: user.role,
      status: "부장검토"
    };

    setDraftList([newDraft, ...draftList]);
    setStatus("부장검토");
  };

  const approve = (id) => {
    setDraftList((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;

        if (d.status === "부장검토") return { ...d, status: "사장검토" };
        if (d.status === "사장검토") return { ...d, status: "최종승인" };

        return d;
      })
    );
  };

  // 🔐 로그인 화면
  if (!isLoggedIn) {
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

          <button onClick={login}>로그인</button>
        </div>
      </div>
    );
  }

  // 🏠 메인
  return (
    <div className="app">

      <header className="header">
        <div className="logo">REMANERE</div>

        <div>
          <span style={{ marginRight: "10px" }}>
            {user.codename} ({user.role})
          </span>

          <button onClick={logout}>로그아웃</button>
        </div>

        <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </header>

      {menuOpen && (
        <aside className="sidebar">
          {menu.map((g) => (
            <div key={g.title}>
              <h4>{g.title}</h4>
              <ul>
                {g.items.map((item) => (
                  <li key={item} onClick={() => handleClick(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      )}

      <main className="main">
        <h1>{page}</h1>

        {/* 전자결재 */}
        {page === "전자결재" && (
          <div>

            <button onClick={() => setDraftOpen(!draftOpen)}>
              기안하기
            </button>

            {draftOpen && (
              <div className="draft-box">
                {["연차", "출장", "구매"].map((d) => (
                  <div key={d} onClick={() => openDoc(d)}>
                    {d}
                  </div>
                ))}
              </div>
            )}

            {selectedDoc && (
              <div className="form-box">
                <h3>{selectedDoc} 신청서</h3>

                <button onClick={submitDraft}>제출</button>
              </div>
            )}

            {/* 📄 결재함 */}
            <h3 style={{ marginTop: "30px" }}>📄 결재함</h3>

            {draftList.map((d) => (
              <div key={d.id} className="draft-box">
                <p>문서: {d.doc}</p>
                <p>작성자: {d.writer}</p>
                <p>상태: {d.status}</p>

                {user.role !== "사원" && d.status !== "최종승인" && (
                  <button onClick={() => approve(d.id)}>
                    결재
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}

export default App;