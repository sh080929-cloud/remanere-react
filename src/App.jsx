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

  const [draftList, setDraftList] = useState([]);

  // 📩 호출 전체 로그
  const [calls, setCalls] = useState([]);

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

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      setUser(JSON.parse(saved));
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

  // 📞 호출 생성
  const callPerson = (target) => {
    const newCall = {
      id: Date.now(),
      target,
      from: user.codename,
      time: new Date().toLocaleTimeString(),
      read: false
    };

    setCalls([newCall, ...calls]);
    alert(`${target} 호출됨`);
  };

  // 📩 개인 호출함 (내가 받은 것만)
  const myInbox = calls.filter((c) => c.target === user.codename);

  const handleClick = (item) => {
    if (item === "전자결재") {
      setPage("전자결재");
      setMenuOpen(false);
      return;
    }

    // 📞 부장 호출 → 전 직원 가능
    if (item === "부장 호출") {
      const choice = prompt("부장 선택: 시드 / 에스");

      if (choice === "시드" || choice === "에스") {
        callPerson(choice);
      } else {
        alert("잘못된 선택");
      }
      return;
    }

    // 📞 사장 호출 → 부장 + 사장만 가능
    if (item === "사장 호출") {
      if (user.role === "사원") {
        alert("사원은 사장 호출 불가");
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
  };

  const submitDraft = () => {
    const newDraft = {
      id: Date.now(),
      doc: selectedDoc,
      writer: user.codename,
      status: "부장검토"
    };

    setDraftList([newDraft, ...draftList]);
  };

  const approve = (id) => {
    setDraftList((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;

        if (d.status === "부장검토") {
          if (user.role !== "부장") {
            alert("부장만 승인 가능");
            return d;
          }
          return { ...d, status: "사장검토" };
        }

        if (d.status === "사장검토") {
          if (user.role !== "사장") {
            alert("사장만 승인 가능");
            return d;
          }
          return { ...d, status: "최종승인" };
        }

        return d;
      })
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>REMANERE</h1>

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

        {/* 📩 개인 호출함 */}
        <h3>📩 내 호출함</h3>

        {myInbox.length === 0 ? (
          <p>호출 없음</p>
        ) : (
          myInbox.map((c) => (
            <div key={c.id} className="draft-box">
              <p>📨 {c.from} → 나 호출</p>
              <p>time: {c.time}</p>
            </div>
          ))
        )}

        {/* 📄 결재 */}
        {page === "전자결재" && (
          <div>
            <h3>전자결재 (기존 유지)</h3>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;