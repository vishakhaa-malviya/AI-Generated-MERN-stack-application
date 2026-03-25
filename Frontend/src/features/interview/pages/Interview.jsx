import React, { useState , useEffect} from "react";
import "../style/interview.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate, useParams}  from "react-router";
import {generateResumePdf } from "../services/interview.api";
const Interview = () => {
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
const [pdfUrl, setPdfUrl] = useState(null);
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

  const handleDownloadResume = async () => {
  setPdfLoading(true);
  try {
    const blob = await getResumePdf(interviewId);
    if (blob) {
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    }
  } catch (err) {
    console.log("PDF error", err);
  } finally {
    setPdfLoading(false);
  }
};
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
