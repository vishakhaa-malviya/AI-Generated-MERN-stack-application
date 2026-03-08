import React, { useState , useEffect} from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate, useParams}  from "react-router";

const Interview = () => {
  const [activeSection, setActiveSection] = useState("technical");
  const [expandedIndex, setExpandedIndex] = useState(0);
  const { report, isLoading, error, getResumePdf } = useInterview();
  const { interviewId } = useParams();
  const navItems = [
    { key: "technical", label: "Technical Questions", icon: "<>" },
    { key: "behavioral", label: "Behavioral Questions", icon: "◉" },
    { key: "roadmap", label: "Road Map", icon: "➤" },
  ];

  
  const sectionTitle = {
    technical: "Technical Questions",
    behavioral: "Behavioral Questions",
    roadmap: "Road Map",
  };

  const severityColor = (s) =>
    s === "high" ? "gap-red" : s === "medium" ? "gap-yellow" : "gap-green";

  const toggle = (i) => setExpandedIndex(expandedIndex === i ? -1 : i);

  const getItems = () => {
    if (!report) return [];
    if (activeSection === "technical") return report.technicalQuestions || [];
    if (activeSection === "behavioral") return report.behavioralQuestions || [];
    if (activeSection === "roadmap") return report.preparationPlan || [];
    return [];
  };

  const items = getItems();

  const matchScore = report?.matchScore ?? 0;
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const progress = (matchScore / 100) * circ;

  // ── LOADING STATE ──────────────────────────────
  if (isLoading) {
    return (
      <main className="interview interview--centered">
        <div className="state-box">
          <div className="spinner" />
          <p className="state-title">Generating your interview strategy...</p>
          <p className="state-sub">This usually takes about 30 seconds</p>
        </div>
      </main>
    );
  }

  // ── ERROR STATE ────────────────────────────────
  if (error) {
    return (
      <main className="interview interview--centered">
        <div className="state-box state-box--error">
          <span className="state-icon">⚠</span>
          <p className="state-title">Something went wrong</p>
          <p className="state-sub">{error}</p>
        </div>
      </main>
    );
  }

  // ── EMPTY STATE ────────────────────────────────
  if (!report) {
    return (
      <main className="interview interview--centered">
        <div className="state-box">
          <span className="state-icon">📋</span>
          <p className="state-title">No report yet</p>
          <p className="state-sub">Go back and generate your interview strategy first.</p>
        </div>
      </main>
    );
  }

  // ── MAIN VIEW ──────────────────────────────────
  return (
    <main className="interview">

      {/* TOP HEADER BAR */}
      <div className="top-header">
        <div className="top-header-left" />
        <div className="top-header-center">
          <h1 className="content-title">{sectionTitle[activeSection]}</h1>
          <span className="content-count">
            {items.length} {activeSection === "roadmap" ? "days" : "questions"}
          </span>
        </div>
        
      </div>

      {/* BODY */}
      <div className="body-row">

        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          <div>
            
          <div className="sidebar-label">SECTIONS</div>
          {navItems.map((nav) => (
            <div
              key={nav.key}
              className={`sidebar-item ${activeSection === nav.key ? "active" : ""}`}
              onClick={() => { setActiveSection(nav.key); setExpandedIndex(0); }}
            >
              <span className="sidebar-icon">{nav.icon}</span>
              <span className="sidebar-text">{nav.label}</span>
              
            </div>

          ))}
          </div>
<button 
 onClick={()=>getResumePdf(interviewId)}
className="button primary-button">
  <svg height={"0.8rem"} style={{marginRight: "0.2rem"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
  Download AI Generated Resume</button>
        </aside>

        {/* CENTER */}
        <div className="content">
          <div className="accordion">
            {items.map((item, i) => {
              const isOpen = expandedIndex === i;
              const label = activeSection === "roadmap" ? `Day ${item.day}` : `Q${i + 1}`;
              const heading = activeSection === "roadmap" ? item.focus : item.question;

              return (
                <div key={i} className={`accordion-item ${isOpen ? "open" : ""}`}>
                  <div className="accordion-header" onClick={() => toggle(i)}>
                    <span className={`q-badge ${isOpen ? "active" : ""}`}>{label}</span>
                    <span className="q-text">{heading}</span>
                    <span className="q-chevron">{isOpen ? "∧" : "∨"}</span>
                  </div>

                  {isOpen && (
                    <div className="accordion-body">
                      {activeSection === "roadmap" ? (
                        <div className="tasks-list">
                          {item.tasks.map((task, ti) => (
                            <div className="task-row" key={ti}>
                              <span className="task-dot" />
                              <p>{task}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className="tag-row">
                            <span className="tag intention">INTENTION</span>
                          </div>
                          <p className="body-text">{item.intention}</p>
                          <div className="tag-row" style={{ marginTop: "1rem" }}>
                            <span className="tag answer">MODEL ANSWER</span>
                          </div>
                          <p className="body-text">{item.answer}</p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside className="right-panel">
        <h4>Match Score</h4>
          <div className="match-section">
            <div className="score-ring-wrap">
              <svg className="score-ring" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} className="ring-track" />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="ring-fill"
                  strokeDasharray={`${progress} ${circ}`}
                  strokeDashoffset={circ / 4}
                />
              </svg>
              <div className="score-inner">
                <span className="score-num">{matchScore}</span>
                <span className="score-pct">%</span>
              </div>
            </div>
            <div className="score-caption">
              {matchScore >= 80
                ? "Strong match for this role"
                : matchScore >= 60
                ? "Good match for this role"
                : "Needs improvement"}
            </div>
          </div>

          <div className="skill-gaps-section">
            <div className="rp-label">SKILL GAPS</div>
            <div className="skill-gaps">
              {(report.skillGaps || []).map((gap, i) => (
                <div key={i} className={`skill-chip ${severityColor(gap.severity)}`}>
                  {gap.skill}
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </main>
  );
};

export default Interview;
