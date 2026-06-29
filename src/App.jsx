import { useState, useEffect } from "react";
import "./App.css";

function App() {
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

  const [calls, setCalls] = useState([]);

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

  // 🔐 로그인
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      setIsLoggedIn(true);
    }
  }, []);

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

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("user");
  };

  // 📞 호출 시스템
  const callPerson = (target) => {
    const newCall = {
      id: Date.now(),
      target,
      from: user.codename,
      time: new Date().toLocaleTimeString()
    };

    setCalls([newCall, ...calls]);
    alert(`${target} 호출됨`);
  };

  const handleClick = (item) => {
    if (item === "전자결재") {
      setPage("전자결재");
      setMenuOpen(false);
      return;
    }

    // 📞 부장 호출 (선택)
    if (item === "부장 호출") {
      const choice = prompt("부장 선택: 시드 / 에스");

      if (choice === "시드" || choice === "에스") {
        callPerson(choice);
      } else {
        alert("잘못된 선택");
      }
      return;
    }

    // 📞 사장 호출 (권한)
    if (item === "사장 호출") {
      if (user.role !== "사장") {
        alert("권한 없음");
        return;
      }

      callPerson("루멘");
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

  return (
    <div className="app">

      <header className="header">
        <div className="logo">REMANERE</div>

        <div>
          {user.codename} ({user.role})
          <button onClick={logout} style={{ marginLeft: 10 }}>
            로그아웃
          </button>
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

        {/* 📄 전자결재 */}
        {page === "전자결재" && (
          <div>

            <button onClick={() => setDraftOpen(!draftOpen)}>
              기안하기
            </button>

            {draftOpen && (
              <div className="draft-box">
                {["연차 사용 신청서", "출장 신청서", "물품 구매 신청서", "보고 제출"].map((d) => (
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

            <h3>📄 결재함</h3>

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

        {/* 📞 호출 로그 */}
        <h3>📞 호출 기록</h3>

        {calls.map((c) => (
          <div key={c.id} className="draft-box">
            <p>{c.target} 호출됨</p>
            <p>from: {c.from}</p>
            <p>time: {c.time}</p>
          </div>
        ))}
      </main>

    </div>
  );
}

export default App;