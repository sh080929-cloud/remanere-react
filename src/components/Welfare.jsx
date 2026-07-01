import { useState } from "react";
import "./Welfare.css";

function Welfare() {
  const services = [
    {
      title: "장비 대여",
      desc: "업무용 장비를 신청하고 관리합니다.",
      details: ["노트북", "태블릿", "무전기", "바디캠", "보조 배터리"],
    },
    {
      title: "기기 관리",
      desc: "사내 기기 현황을 확인합니다.",
      details: ["보안 단말기", "공용 PC", "회의실 장비", "프린터", "네트워크 장비"],
    },
    {
      title: "의료 지원",
      desc: "응급 및 의료 지원 안내.",
      details: ["응급 키트", "제휴 병원", "심리 상담", "비상 연락망"],
    },
    {
      title: "자료실",
      desc: "업무 자료와 양식을 제공합니다.",
      details: ["신입 매뉴얼", "보안 규정", "전자결재 양식", "조직도"],
    },
    {
      title: "교육센터",
      desc: "교육 자료 및 훈련 일정.",
      details: ["신입 교육", "보안 교육", "장비 사용 교육", "정기 훈련"],
    },
    {
      title: "휴가 안내",
      desc: "휴가 및 근태 관련 안내.",
      details: ["연차", "병가", "경조사 휴가", "초과근무 보상"],
    },
  ];

  const [selected, setSelected] = useState(services[0]);
  const [requestMode, setRequestMode] = useState(false);
  const [requestText, setRequestText] = useState("");
  const [requests, setRequests] = useState([]);

  const submitRequest = () => {
    if (!requestText.trim()) {
      alert("신청 내용을 입력해주세요.");
      return;
    }

    const newRequest = {
      id: Date.now(),
      service: selected.title,
      content: requestText,
      status: "신청 완료",
      date: new Date().toLocaleString("ko-KR"),
    };

    setRequests([newRequest, ...requests]);
    setRequestText("");
    setRequestMode(false);
    alert("신청이 접수되었습니다.");
  };

  return (
    <div className="welfare-page">
      <div className="page-header">
        <div>
          <h1>사내 서비스</h1>
          <p>REMANERE 내부 서비스입니다.</p>
        </div>
      </div>

      <div className="welfare-layout">
        <div className="welfare-grid">
          {services.map((item) => (
            <div
              key={item.title}
              className={`service-card ${
                selected.title === item.title ? "active" : ""
              }`}
              onClick={() => {
                setSelected(item);
                setRequestMode(false);
                setRequestText("");
              }}
            >
              <h2>{item.title}</h2>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="welfare-detail">
          <h2>{selected.title}</h2>
          <p>{selected.desc}</p>

          <div className="detail-list">
            {selected.details.map((detail) => (
              <div key={detail} className="detail-item">
                {detail}
              </div>
            ))}
          </div>

          {!requestMode ? (
            <button className="primary-btn" onClick={() => setRequestMode(true)}>
              신청하기
            </button>
          ) : (
            <div className="request-box">
              <textarea
                placeholder="신청 내용을 입력하세요."
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
              />

              <div className="request-actions">
                <button className="primary-btn" onClick={submitRequest}>
                  신청 접수
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => {
                    setRequestMode(false);
                    setRequestText("");
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          )}

          <div className="request-list">
            <h3>신청 기록</h3>

            {requests.length === 0 ? (
              <p className="empty">신청 기록이 없습니다.</p>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="request-card">
                  <strong>{req.service}</strong>
                  <p>{req.content}</p>
                  <span>{req.status} · {req.date}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welfare;