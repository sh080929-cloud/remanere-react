import { useState } from "react";

function Notice({ user, notices, setNotices }) {
  const [search, setSearch] = useState("");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [writeMode, setWriteMode] = useState(false);

  const [category, setCategory] = useState("전체");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const canWrite = user.role === "부장" || user.role === "사장";

  const filteredNotices = notices.filter((notice) =>
    notice.title.includes(search) ||
    notice.content.includes(search) ||
    notice.writer.includes(search)
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

    setNotices([newNotice, ...notices]);
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

    setNotices(notices.filter((n) => n.id !== id));
    setSelectedNotice(null);
  };

  if (selectedNotice) {
    return (
      <div className="notice-page">
        <button className="back-btn" onClick={() => setSelectedNotice(null)}>
          ← 목록으로
        </button>

        <div className="notice-detail">
          <span className="notice-category">[{selectedNotice.category}]</span>
          <h1>{selectedNotice.title}</h1>

          <div className="notice-meta">
            작성자 {selectedNotice.writer} · {selectedNotice.date}
          </div>

          <p className="notice-content">{selectedNotice.content}</p>

          {(user.role === "사장" || selectedNotice.writer === user.codename) && (
            <button
              className="danger-btn"
              onClick={() => deleteNotice(selectedNotice.id)}
            >
              삭제
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="notice-page">
      <div className="page-header">
        <div>
          <h1>공지사항</h1>
          <p>REMANERE 내부 공지 게시판입니다.</p>
        </div>

        {canWrite && (
          <button className="primary-btn" onClick={() => setWriteMode(!writeMode)}>
            {writeMode ? "작성 취소" : "+ 공지 작성"}
          </button>
        )}
      </div>

      {writeMode && (
        <div className="write-box">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="전체">전체</option>
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

      <input
        className="search-input"
        placeholder="공지 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="notice-list">
        {filteredNotices.map((notice) => (
          <div
            key={notice.id}
            className="notice-item"
            onClick={() => setSelectedNotice(notice)}
          >
            <div>
              <span className="notice-category">[{notice.category}]</span>
              <strong>{notice.title}</strong>
            </div>

            <div className="notice-meta">
              {notice.writer} · {notice.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notice;