import "./CallModal.css";

function CallModal({ type, user, onClose, onCall }) {
  const targets =
    type === "boss"
      ? ["루멘"]
      : ["루멘", "시드", "에스"];

  return (
    <div className="modal-bg">
      <div className="call-modal">
        <h2>{type === "boss" ? "사장 호출" : "부장 호출"}</h2>
        <p>호출할 대상을 선택하세요.</p>

        <div className="call-list">
          {targets.map((target) => (
            <button key={target} onClick={() => onCall(target)}>
              {target}
            </button>
          ))}
        </div>

        <button className="modal-close" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default CallModal;