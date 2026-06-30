import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Notice from "./components/Notice";
import Mail from "./components/Mail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [codename, setCodename] = useState("");
  const [pw, setPw] = useState("");
  const [user, setUser] = useState(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("홈");

  const [mails, setMails] = useState([]);
  const [drafts, setDrafts] = useState([]);
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
    { codename: "문", pw: "1001", role: "사원" },
    { codename: "루아나", pw: "0505", role: "사원" },
  ];

  const [notices, setNotices] = useState([
    {
      id: 1,
      category: "전체",
      title: "REMANERE 정기 보안 점검 안내",
      content: "금일 18시부터 사내 보안 점검이 진행됩니다.",
      writer: "루멘",
      writerRole: "사장",
      date: "2026.06.30",
    },
    {
      id: 2,
      category: "정보부",
      title: "자료 제출 양식 변경 안내",
      content: "정보부 제출 문서 양식이 일부 변경되었습니다.",
      writer: "시드",
      writerRole: "부장",
      date: "2026.06.30",
    },
  ]);

  const menu = [
    { title: "소통", items: ["공지사항", "사내메일"] },
    { title: "업무", items: ["일정관리", "전자결재"] },
    { title: "시설·서비스", items: ["시설 안내도", "복지"] },
    { title: "바로가기", items: ["부장 호출", "사장 호출"] },
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
    setCodename("");
    setPw("");
    setPage("홈");
    setMenuOpen(false);
    localStorage.removeItem("user");
  };

  const callPerson = (target) => {
    const newCall = {
      id: Date.now(),
      target,
      from: user.codename,
      time: new Date().toLocaleTimeString(),
    };

    setCalls([newCall, ...calls]);
    alert(`${target} 호출됨`);
  };

  const handleClick = (item) => {
    if (item === "부장 호출") {
      const choice = prompt("호출할 부장을 입력하세요: 루멘 / 시드 / 에스");

      if (choice === "루멘" || choice === "시드" || choice === "에스") {
        callPerson(choice);
      } else {
        alert("루멘, 시드, 에스 중에서 입력해주세요.");
      }

      setMenuOpen(false);
      return;
    }

    if (item === "사장 호출") {
      if (user.codename !== "시드" && user.codename !== "에스") {
        alert("사장 호출은 부장만 가능합니다.");
        setMenuOpen(false);
        return;
      }

      callPerson("루멘");
      setMenuOpen(false);
      return;
    }

    setPage(item);
    setMenuOpen(false);
  };

  if (!isLoggedIn) {
    return (
      <Login
        codename={codename}
        setCodename={setCodename}
        pw={pw}
        setPw={setPw}
        login={login}
      />
    );
  }

  return (
    <div className="app">
      <Header
        user={user}
        logout={logout}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {menuOpen && (
        <Sidebar menu={menu} handleClick={handleClick} />
      )}

      <main className="main">
        {page === "홈" && (
          <Home
            user={user}
            notices={notices}
            mails={mails}
            drafts={drafts}
          />
        )}

        {page === "공지사항" && (
          <Notice
            user={user}
            notices={notices}
            setNotices={setNotices}
          />
        )}

        {page === "사내메일" && (
          <Mail
            user={user}
            users={users}
            mails={mails}
            setMails={setMails}
          />
        )}

        {page !== "홈" &&
          page !== "공지사항" &&
          page !== "사내메일" && (
            <div className="page-box">
              <h1>{page}</h1>
              <p>이 화면은 곧 제작 예정입니다.</p>
            </div>
          )}

        <section className="call-section">
          <h3>호출 기록</h3>

          {calls.length === 0 ? (
            <p>호출 기록이 없습니다.</p>
          ) : (
            calls.map((c) => (
              <div key={c.id} className="draft-box">
                <p>{c.target} 호출</p>
                <p>from: {c.from}</p>
                <p>{c.time}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;