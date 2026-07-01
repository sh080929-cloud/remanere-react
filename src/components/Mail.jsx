import "./Mail.css";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function Mail({ user, users, mails, setMails }) {
  const [tab, setTab] = useState("inbox");
  const [selectedMail, setSelectedMail] = useState(null);
  const [to, setTo] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const inbox = mails.filter((m) => m.to === user.codename);
  const sent = mails.filter((m) => m.from === user.codename);
  const currentList = tab === "inbox" ? inbox : sent;

  const sendMail = async () => {
    if (!to || !title || !content) {
      alert("받는 사람, 제목, 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await addDoc(collection(db, "mails"), {
        from: user.codename,
        to,
        title,
        content,
        time: new Date().toLocaleString("ko-KR"),
        read: false,
        createdAt: serverTimestamp(),
      });

    

      setTo("");
      setTitle("");
      setContent("");
      setTab("sent");
    } catch (e) {
      alert("오류: " + e.message);
    }
  };

  const openMail = (mail) => {
    setSelectedMail(mail);
  };

  return (
    <div className="mail-page">
      <div className="page-header">
        <div>
          <h1>사내메일</h1>
          <p>REMANERE 직원 간 메시지를 주고받습니다.</p>
        </div>
      </div>

      <div className="mail-layout">
        <aside className="mail-menu">
          <button className={tab === "inbox" ? "active" : ""} onClick={() => { setTab("inbox"); setSelectedMail(null); }}>
            📥 받은메일 <span>{inbox.length}</span>
          </button>
          <button className={tab === "sent" ? "active" : ""} onClick={() => { setTab("sent"); setSelectedMail(null); }}>
            📤 보낸메일 <span>{sent.length}</span>
          </button>
          <button className={tab === "write" ? "active" : ""} onClick={() => { setTab("write"); setSelectedMail(null); }}>
            ✏ 메일쓰기
          </button>
        </aside>

        <section className="mail-list-panel">
          {tab === "write" ? (
            <div className="mail-write">
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                <option value="">받는 사람 선택</option>
                {users.filter((u) => u.codename !== user.codename).map((u) => (
                  <option key={u.codename} value={u.codename}>
                    {u.codename} ({u.role})
                  </option>
                ))}
              </select>

              <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea placeholder="내용을 입력하세요." value={content} onChange={(e) => setContent(e.target.value)} />
              <button className="primary-btn" onClick={sendMail}>보내기</button>
            </div>
          ) : currentList.length === 0 ? (
            <div className="mail-empty">메일이 없습니다.</div>
          ) : (
            currentList.map((mail) => (
              <div
                key={mail.id}
                className={`mail-item ${selectedMail?.id === mail.id ? "selected" : ""} ${!mail.read && mail.to === user.codename ? "unread" : ""}`}
                onClick={() => openMail(mail)}
              >
                <strong>{mail.title}</strong>
                <p>{tab === "inbox" ? `from ${mail.from}` : `to ${mail.to}`}</p>
                <span>{mail.time}</span>
              </div>
            ))
          )}
        </section>

        <section className="mail-detail-panel">
          {selectedMail ? (
            <>
              <h2>{selectedMail.title}</h2>
              <div className="mail-info">
                <p>보낸 사람: {selectedMail.from}</p>
                <p>받는 사람: {selectedMail.to}</p>
                <p>{selectedMail.time}</p>
              </div>
              <div className="mail-content">{selectedMail.content}</div>
            </>
          ) : (
            <div className="mail-placeholder">
              <h2>메일을 선택하세요.</h2>
              <p>선택한 메일의 내용이 여기에 표시됩니다.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Mail;