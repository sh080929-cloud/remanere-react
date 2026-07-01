import { useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

function CalendarPage() {
  const [schedules, setSchedules] = useState([]);
  const [value, setValue] = useState(new Date());

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("회의");

  const selectedDateText =
    value.getFullYear() +
    "-" +
    String(value.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(value.getDate()).padStart(2, "0");

  const selectedSchedules = schedules.filter(
    (s) => s.date === selectedDateText
  );

  const addSchedule = () => {
    if (!title.trim() || !date) {
      alert("일정명과 날짜를 입력해주세요.");
      return;
    }

    const newSchedule = {
      id: Date.now(),
      title,
      date,
      type,
    };

    setSchedules((prev) => [newSchedule, ...prev]);

    alert("일정이 등록되었습니다.");

    setTitle("");
    setDate("");
    setType("회의");
  };

  return (
    <div className="calendar-page">
      <div className="page-header">
        <div>
          <h1>일정관리</h1>
          <p>REMANERE 내부 일정을 관리합니다.</p>
        </div>
      </div>

      <div className="calendar-layout">
        <section className="schedule-form">
          <h2>새 일정 등록</h2>

          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>회의</option>
            <option>휴가</option>
            <option>출장</option>
            <option>점검</option>
            <option>교육</option>
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            placeholder="일정명"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <button className="primary-btn" onClick={addSchedule}>
            일정 추가
          </button>
        </section>

        <section className="schedule-list">
          <h2>일정 달력</h2>

          <ReactCalendar
  onChange={setValue}
  value={value}
  locale="ko-KR"
  tileContent={({ date }) => {
    const dateText =
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0");

    const hasSchedule = schedules.some(
      (s) => s.date === dateText
    );

    return hasSchedule ? (
      <div className="schedule-dot"></div>
    ) : null;
  }}
/>

          <div className="selected-date">
            선택한 날짜 :
            <strong> {value.toLocaleDateString("ko-KR")}</strong>
          </div>

          <div className="selected-schedule-list">
            <h3>선택한 날짜 일정</h3>

            {selectedSchedules.length === 0 ? (
              <p className="empty">이 날짜에는 일정이 없습니다.</p>
            ) : (
              selectedSchedules.map((s) => (
                <div key={s.id} className="schedule-card">
                  <span>{s.type}</span>
                  <strong>{s.title}</strong>
                  <p>{s.date}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default CalendarPage;