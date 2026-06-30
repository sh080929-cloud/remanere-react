function Home({ user, notices = [], mails = [], drafts = [] }) {
  const today = new Date().toLocaleDateString("ko-KR");

  const recentNotices = notices.slice(0, 5);
  const recentMails = mails
    .filter((m) => m.to === user.codename)
    .slice(0, 5);

  const recentDrafts = drafts.slice(0, 5);

  return (
    <div className="home">

      <div className="home-top">
        <div>
          <h1>안녕하세요, {user.codename}님.</h1>
          <p>{user.role}</p>
        </div>

        <div className="today">
          {today}
        </div>
      </div>

      <div className="home-grid">

        <div className="card">
          <h2>📢 공지사항</h2>

          {recentNotices.length === 0 ? (
            <p>등록된 공지가 없습니다.</p>
          ) : (
            recentNotices.map((n) => (
              <p key={n.id}>• {n.title}</p>
            ))
          )}
        </div>

        <div className="card">
          <h2>📩 최근 메일</h2>

          {recentMails.length === 0 ? (
            <p>받은 메일이 없습니다.</p>
          ) : (
            recentMails.map((m) => (
              <p key={m.id}>
                [{m.from}] {m.title}
              </p>
            ))
          )}
        </div>

        <div className="card">
          <h2>📄 결재 현황</h2>

          {recentDrafts.length === 0 ? (
            <p>결재 문서가 없습니다.</p>
          ) : (
            recentDrafts.map((d) => (
              <p key={d.id}>
                {d.doc} ({d.status})
              </p>
            ))
          )}
        </div>

        <div className="card">
          <h2>📅 오늘 일정</h2>

          <p>오늘 등록된 일정이 없습니다.</p>
        </div>

      </div>

    </div>
  );
}

export default Home;