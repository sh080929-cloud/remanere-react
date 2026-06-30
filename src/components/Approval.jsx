import { useState } from "react";
import "./Approval.css";

function Approval({ user, approvals, setApprovals }) {
  const [writeMode, setWriteMode] = useState(false);

  return (
    <div className="approval-page">

      <div className="page-header">
        <div>
          <h1>전자결재</h1>
          <p>결재 문서를 작성하고 승인 상태를 관리합니다.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setWriteMode(!writeMode)}
        >
          {writeMode ? "닫기" : "+ 새 문서"}
        </button>
      </div>

      {writeMode && (
        <div className="approval-select">

          <h3>문서 종류 선택</h3>

          <div className="approval-type-grid">

            <button>연차 사용 신청서</button>

            <button>출장 신청서</button>

            <button>초과 근무 신청서</button>

            <button>물품 구매 신청서</button>

            <button>특수 수당 신청서</button>

            <button>보고 제출</button>

          </div>

        </div>
      )}

      <div className="approval-list">

        {approvals.length === 0 ? (

          <div className="empty-box">

            <h2>결재 문서가 없습니다.</h2>

            <p>우측 상단의 새 문서를 눌러 작성하세요.</p>

          </div>

        ) : (

          approvals.map((doc) => (

            <div
              key={doc.id}
              className="approval-card"
            >

              <div className="approval-left">

                <div className="approval-top">

                  <span className="doc-type">

                    {doc.docType}

                  </span>

                  <span className={`status ${doc.status}`}>

                    {doc.status}

                  </span>

                </div>

                <h2>{doc.title}</h2>

                <p className="approval-content">

                  {doc.content}

                </p>

                <div className="approval-info">

                  <span>

                    👤 {doc.writer}

                  </span>

                  <span>

                    📅 {doc.date}

                  </span>

                </div>

              </div>

              <div className="approval-right">

                {doc.status !== "최종승인" && (

                  <button className="approve-btn">

                    ✔ 승인

                  </button>

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