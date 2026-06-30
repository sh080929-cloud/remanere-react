import "./Home.css";

function Home({ user, notices = [], mails = [], drafts = [] }) {
  const today = new Date();

  const dateText = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const hour = today.getHours();
  const greeting =
    hour < 12 ? "좋은 아침입니다." : hour < 18 ? "좋은 오후입니다." : "좋은 저녁입니다.";

  const recentNotices = notices.slice(0, 4);
  const recentMails = mails.filter((m) => m.to === user.codename).slice(0, 4);
  const recentDrafts = drafts.slice(0, 4);

  return (
    <div className="home">
      <section className="home-hero">
        <div>
          <p className="hero-label">REMANERE GROUPWARE</p>
          <h1>
            {greeting}
            <br />
            {user.codename}님.
          </h1>
          <p className="hero-sub">
            오늘도 안전한 근무를 기원합니다.
          </p>
        </div>

        <div className="hero-date">
          <span>{dateText}</span>
          <strong>{user.role}</strong>
        </div>
      </section>

      <section className="home-grid">
        <div className="card">
          <h2>공지사항</h2>

          {recentNotices.length === 0 ? (
            <p className="empty">등록된 공지가 없습니다.</p>
          ) : (
            recentNotices.map((n) => (
              <div key={n.id} className="card-item">
                <strong>[{n.category}] {n.title}</strong>
                <span>{n.writer} · {n.date}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2>최근 메일</h2>

          {recentMails.length === 0 ? (
            <p className="empty">받은 메일이 없습니다.</p>
          ) : (
            recentMails.map((m) => (
              <div key={m.id} className="card-item">
                <strong>{m.title}</strong>
                <span>from {m.from}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2>결재 현황</h2>

          {recentDrafts.length === 0 ? (
            <p className="empty">결재 문서가 없습니다.</p>
          ) : (
            recentDrafts.map((d) => (
              <div key={d.id} className="card-item">
                <strong>{d.title}</strong>
                <span>{d.docType} · {d.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <h2>오늘 일정</h2>
          <p className="empty">등록된 일정이 없습니다.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;