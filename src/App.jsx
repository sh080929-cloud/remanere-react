import { useState } from "react";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState("홈");

  const userRole = "사원"; // 나중에 로그인으로 바뀜

  const menu = [
    { title: "소통", items: ["공지사항", "사내메일"] },
    { title: "업무", items: ["일정관리", "전자결재"] },
    { title: "시설·서비스", items: ["시설 안내도", "사내 기본행동양식", "복지"] },
    { title: "바로가기", items: ["부장 호출", "사장 호출"] }
  ];

  const handleClick = (item) => {
    // 권한 체크
    if (item === "사장 호출" && userRole !== "사장") {
      alert("접근 권한이 없습니다.");
      return;
    }

    if (item === "부장 호출") {
      const bosses = ["루멘", "시드", "에스"];
      const picked = bosses[Math.floor(Math.random() * bosses.length)];
      alert(`${picked} 호출됨`);
      return;
    }

    setPage(item);
    setMenuOpen(false);
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div className="logo">REMANERE</div>

        <div className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>
      </header>

      {/* SIDEBAR */}
      {menuOpen && (
        <aside className="sidebar">
          {menu.map((group) => (
            <div key={group.title}>
              <h4>{group.title}</h4>
              <ul>
                {group.items.map((item) => (
                  <li key={item} onClick={() => handleClick(item)}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      )}

      {/* MAIN */}
      <main className="main">
        <h1>{page}</h1>
      </main>

    </div>
  );
}

export default App;