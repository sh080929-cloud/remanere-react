import { useState } from "react";

function Mail({ user, users, mails, setMails }) {
  const [tab, setTab] = useState("inbox");
  const [selectedMail, setSelectedMail] = useState(null);

  const [to, setTo] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const inbox = mails.filter((m) => m.to === user.codename);
  const sent = mails.filter((m) => m.from === user.codename);

  const sendMail = () => {
    if (!to || !title || !content) {
      alert("받는 사람, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    const newMail = {
      id: Date.now(),
      from: user.codename,
      to,
      title,
      content,
      time: new Date().toLocaleString("ko-KR"),
      read: false,
    };

    setMails([newMail, ...mails]);
    setTo("");
    setTitle("");
    setContent("");
    setTab("sent");
    alert("메일을 보냈습니다.");
  };

  const openMail = (mail) => {
    setSelectedMail(mail);

    if (mail.to === user.codename && !mail.read) {
      setMails(
        mails.map((m) =>
          m.id === mail.id ? { ...m, read: true } : m
        )
      );
    }
  };

  if (selectedMail) {
    return (
      <div className="mail-page">
        <button className="back-btn" onClick={() => setSelectedMail(null)}>
          ← 목록으로
        </button>

        <div className="mail-detail">
          <h1>{selectedMail.title}</h1>

          <div className="mail-info">
            <p>보낸 사람: {selectedMail.from}</p>
            <p>받는 사람: {selectedMail.to}</p>
            <p>시간: {selectedMail.time}</p>
          </div>

          <div className="mail-content">
            {selectedMail.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mail-page">
      <div className="page-header">
        <div>
          <h1>사내메일</h1>
          <p>REMANERE 직원 간 메시지를 주고받습니다.</p>
        </div>
      </div>

      <div className="mail-tabs">
        <button
          className={tab === "inbox" ? "active" : ""}
          onClick={() => setTab("inbox")}
        >
          받은메일
        </button>

        <button
          className={tab === "sent" ? "active" : ""}
          onClick={() => setTab("sent")}
        >
          보낸메일
        </button>

        <button
          className={tab === "write" ? "active" : ""}
          onClick={() => setTab("write")}
        >
          메일쓰기
        </button>
      </div>

      {tab === "write" && (
        <div className="mail-write">
          <select value={to} onChange={(e) => setTo(e.target.value)}>
            <option value="">받는 사람 선택</option>

            {users
              .filter((u) => u.codename !== user.codename)
              .map((u) => (
                <option key={u.codename} value={u.codename}>
                  {u.codename} ({u.role})
                </option>
              ))}
          </select>

          <input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button className="primary-btn" onClick={sendMail}>
            보내기
          </button>
        </div>
      )}

      {tab === "inbox" && (
        <div className="mail-list">
          {inbox.length === 0 ? (
            <p>받은 메일이 없습니다.</p>
          ) : (
            inbox.map((mail) => (
              <div
                key={mail.id}
                className={`mail-item ${mail.read ? "" : "unread"}`}
                onClick={() => openMail(mail)}
              >
                <div>
                  <strong>{mail.read ? "" : "● "}{mail.title}</strong>
                  <p>from: {mail.from}</p>
                </div>

                <span>{mail.time}</span>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "sent" && (
        <div className="mail-list">
          {sent.length === 0 ? (
            <p>보낸 메일이 없습니다.</p>
          ) : (
            sent.map((mail) => (
              <div
                key={mail.id}
                className="mail-item"
                onClick={() => openMail(mail)}
              >
                <div>
                  <strong>{mail.title}</strong>
                  <p>to: {mail.to}</p>
                </div>

                <span>{mail.time}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Mail;