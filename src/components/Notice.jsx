import "./Notice.css";
import { useState } from "react";

function Notice({ user, notices, setNotices }) {
  const [search, setSearch] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(notices[0] || null);
  const [writeMode, setWriteMode] = useState(false);

  const [category, setCategory] = useState("전체");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canWrite = user.role === "부장" || user.role === "사장";

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.includes(search) ||
      notice.content.includes(search) ||
      notice.writer.includes(search) ||
      notice.category.includes(search)
  );

  const submitNotice = () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const newNotice = {
      id: Date.now(),
      category,
      title,
      content,
      writer: user.codename,
      writerRole: user.role,
      date: new Date().toLocaleDateString("ko-KR"),
    };

    const updated = [newNotice, ...notices];

    setNotices(updated);
    setSelectedNotice(newNotice);
    setTitle("");
    setContent("");
    setCategory("전체");
    setWriteMode(false);
  };

  const deleteNotice = (id) => {
    const target = notices.find((n) => n.id === id);

    if (user.role !== "사장" && target.writer !== user.codename) {
      alert("본인이 작성한 공지만 삭제할 수 있습니다.");
      return;
    }

    const updated = notices.filter((n) => n.id !== id);
    setNotices(updated);
    setSelectedNotice(updated[0] || null);
  };

  return (
    <div className="notice-page">
      <div className="page-header">
        <div>
          <h1>공지사항</h1>
          <p>REMANERE 내부 공지 게시판입니다.</p>
        </div>

        {canWrite && (
          <button
            className="primary-btn"
            onClick={() => setWriteMode(!writeMode)}
          >
            {writeMode ? "작성 취소" : "+ 공지 작성"}
          </button>
        )}
      </div>

      {writeMode && (
        <div className="write-box">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="전체">전체</option>
            <option value="수뇌부">수뇌부</option>
            <option value="정보부">정보부</option>
            <option value="행동부">행동부</option>
            <option value="보안">보안</option>
            <option value="긴급">긴급</option>
          </select>

          <input
            placeholder="공지 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="공지 내용을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button className="primary-btn" onClick={submitNotice}>
            등록
          </button>
        </div>
      )}

      <div className="notice-layout">
        <section className="notice-list-panel">
          <input
            className="search-input"
            placeholder="공지 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredNotices.length === 0 ? (
            <div className="notice-empty">검색 결과가 없습니다.</div>
          ) : (
            filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className={`notice-item ${
                  selectedNotice?.id === notice.id ? "selected" : ""
                }`}
                onClick={() => setSelectedNotice(notice)}
              >
                <span className="notice-category">[{notice.category}]</span>
                <strong>{notice.title}</strong>
                <p>{notice.writer} · {notice.date}</p>
              </div>
            ))
          )}
        </section>

        <section className="notice-detail-panel">
          {selectedNotice ? (
            <>
              <span className="notice-category">
                [{selectedNotice.category}]
              </span>

              <h2>{selectedNotice.title}</h2>

              <div className="notice-meta">
                작성자 {selectedNotice.writer} · {selectedNotice.date}
              </div>

              <div className="notice-content">
                {selectedNotice.content}
              </div>

              {(user.role === "사장" ||
                selectedNotice.writer === user.codename) && (
                <button
                  className="danger-btn"
                  onClick={() => deleteNotice(selectedNotice.id)}
                >
                  삭제
                </button>
              )}
            </>
          ) : (
            <div className="notice-placeholder">
              <h2>공지를 선택하세요.</h2>
              <p>선택한 공지의 내용이 여기에 표시됩니다.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Notice;