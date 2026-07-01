import { useState } from "react";
import "./Approval.css";

function Approval({ user, approvals, setApprovals }) {
  const [writeMode, setWriteMode] = useState(false);
  const [docType, setDocType] = useState(null);
  const [rejectTargetId, setRejectTargetId] = useState(null);
const [rejectReason, setRejectReason] = useState("");

  const [form, setForm] = useState({});

  const docTypes = [
    "연차 신청서",
    "출장 신청서",
    "초과근무 신청서",
    "물품 구매 신청서",
    "특수수당 신청서",
    "업무 보고서",
  ];

  const updateForm = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const resetForm = () => {
    setDocType(null);
    setForm({});
    setWriteMode(false);
  };

  const submitApproval = () => {
    if (!docType) return;

    const newDoc = {
      id: Date.now(),
      docType,
      title: form.title || docType,
      content: form.content || form.reason || form.purpose || "내용 없음",
      form,
      writer: user.codename,
      writerRole: user.role,
      status: "부장검토",
      date: new Date().toLocaleString("ko-KR"),
    };

    setApprovals([newDoc, ...approvals]);
    resetForm();
  };

  const approveDoc = (id) => {
    setApprovals(
      approvals.map((doc) => {
        if (doc.id !== id) return doc;

        if (doc.status === "부장검토") {
          if (user.role !== "부장") {
            alert("부장만 승인할 수 있습니다.");
            return doc;
          }
          return { ...doc, status: "사장검토" };
        }

        if (doc.status === "사장검토") {
          if (user.role !== "사장") {
            alert("최종 승인 권한이 없습니다.");
            return doc;
          }
          return { ...doc, status: "최종승인" };
        }

        return doc;
      })
    );
  };

 const rejectDoc = (id) => {
  if (!rejectReason.trim()) {
    alert("반려 사유를 입력해주세요.");
    return;
  }

  setApprovals(
    approvals.map((doc) =>
      doc.id === id
        ? { ...doc, status: "반려", rejectReason }
        : doc
    )
  );

  setRejectTargetId(null);
  setRejectReason("");
};

  const renderForm = () => {
    if (!docType) return null;

    return (
      <div className="write-box">
        <h3>{docType}</h3>

        <input
          placeholder="문서 제목"
          value={form.title || ""}
          onChange={(e) => updateForm("title", e.target.value)}
        />

        {docType === "연차 신청서" && (
          <>
            <input
              type="date"
              value={form.startDate || ""}
              onChange={(e) => updateForm("startDate", e.target.value)}
            />
            <input
              type="date"
              value={form.endDate || ""}
              onChange={(e) => updateForm("endDate", e.target.value)}
            />
            <textarea
              placeholder="연차 사유"
              value={form.reason || ""}
              onChange={(e) => updateForm("reason", e.target.value)}
            />
          </>
        )}

        {docType === "출장 신청서" && (
          <>
            <input
              placeholder="출장지"
              value={form.place || ""}
              onChange={(e) => updateForm("place", e.target.value)}
            />
            <input
              placeholder="출장 기간"
              value={form.period || ""}
              onChange={(e) => updateForm("period", e.target.value)}
            />
            <textarea
              placeholder="출장 목적"
              value={form.purpose || ""}
              onChange={(e) => updateForm("purpose", e.target.value)}
            />
          </>
        )}

        {docType === "초과근무 신청서" && (
          <>
            <input
              placeholder="근무 예정 시간"
              value={form.workTime || ""}
              onChange={(e) => updateForm("workTime", e.target.value)}
            />
            <textarea
              placeholder="초과근무 사유"
              value={form.reason || ""}
              onChange={(e) => updateForm("reason", e.target.value)}
            />
          </>
        )}

        {docType === "물품 구매 신청서" && (
          <>
            <input
              placeholder="구매 품목"
              value={form.item || ""}
              onChange={(e) => updateForm("item", e.target.value)}
            />
            <input
              placeholder="수량"
              value={form.amount || ""}
              onChange={(e) => updateForm("amount", e.target.value)}
            />
            <input
              placeholder="예상 금액"
              value={form.price || ""}
              onChange={(e) => updateForm("price", e.target.value)}
            />
            <textarea
              placeholder="구매 사유"
              value={form.reason || ""}
              onChange={(e) => updateForm("reason", e.target.value)}
            />
          </>
        )}

        {docType === "특수수당 신청서" && (
          <>
            <input
              placeholder="수당 종류"
              value={form.allowanceType || ""}
              onChange={(e) => updateForm("allowanceType", e.target.value)}
            />
            <input
              placeholder="신청 금액"
              value={form.price || ""}
              onChange={(e) => updateForm("price", e.target.value)}
            />
            <textarea
              placeholder="신청 사유"
              value={form.reason || ""}
              onChange={(e) => updateForm("reason", e.target.value)}
            />
          </>
        )}

        {docType === "업무 보고서" && (
          <>
            <input
              placeholder="보고 대상 업무"
              value={form.workTitle || ""}
              onChange={(e) => updateForm("workTitle", e.target.value)}
            />
            <textarea
              placeholder="업무 내용"
              value={form.content || ""}
              onChange={(e) => updateForm("content", e.target.value)}
            />
          </>
        )}

        <button className="primary-btn" onClick={submitApproval}>
          기안 제출
        </button>
      </div>
    );
  };

  return (
    <div className="approval-page">
      <div className="page-header">
        <div>
          <h1>전자결재</h1>
          <p>결재 문서를 작성하고 승인 상태를 관리합니다.</p>
        </div>

        <button
  className="approval-new-btn"
  onClick={() => {
    setWriteMode(!writeMode);
    setDocType(null);
  }}
>
  <span className="plus">+</span>
  {writeMode ? "닫기" : "새 기안"}
</button>
      </div>

      {writeMode && !docType && (
        <div className="approval-select">
          <h3>문서 종류 선택</h3>

          <div className="approval-type-grid">
            {docTypes.map((type) => (
              <button key={type} onClick={() => setDocType(type)}>
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {writeMode && renderForm()}

      <div className="approval-list">
        {approvals.length === 0 ? (
          <div className="empty-box">
            <h2>결재 문서가 없습니다.</h2>
            <p>우측 상단의 새 문서를 눌러 작성하세요.</p>
          </div>
        ) : (
          approvals.map((doc) => (
            <div key={doc.id} className="approval-card">
              <div className="approval-left">
                <div className="approval-top">
                  <span className="doc-type">{doc.docType}</span>
                  <span className={`status ${doc.status}`}>
                    {doc.status}
                  </span>
                </div>

                <h2>{doc.title}</h2>

                <p className="approval-content">{doc.content}</p>

                {doc.rejectReason && (
                  <p className="approval-content">
                    반려 사유: {doc.rejectReason}
                  </p>
                )}

                <div className="approval-info">
                  <span>👤 {doc.writer}</span>
                  <span>📅 {doc.date}</span>
                </div>
              </div>

              <div className="approval-right">
                {doc.status !== "최종승인" && doc.status !== "반려" && (
                  <>
                    <button
  className="reject-btn"
  onClick={() => setRejectTargetId(doc.id)}
>
  ✖ 반려
</button>
{rejectTargetId === doc.id && (
  <div className="reject-box">
    <textarea
      placeholder="반려 사유를 입력하세요."
      value={rejectReason}
      onChange={(e) => setRejectReason(e.target.value)}
    />

    <div className="reject-actions">
      <button className="reject-confirm" onClick={() => rejectDoc(doc.id)}>
        반려 확정
      </button>

      <button
        className="reject-cancel"
        onClick={() => {
          setRejectTargetId(null);
          setRejectReason("");
        }}
      >
        취소
      </button>
    </div>
  </div>
)}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Approval;