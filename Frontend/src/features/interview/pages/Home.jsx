import React, { useState, useRef } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const [errors, setErrors] = useState({});
  const resumeInputRef = useRef();
  const validateForm = () => {
  const newErrors = {};
  const resumeFile = resumeInputRef.current?.files[0];

  if (!jobDescription.trim()) {
    newErrors.jobDescription = "Job description is required";
  }

  if (!resumeFile && !selfDescription.trim()) {
    newErrors.profile =
      "Either a resume or a self description is required";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleGenerateReport = async () => {
  if (!validateForm()) return;

  const resumeFile = resumeInputRef.current.files[0];

  const data = await generateReport({
    selfDescription,
    jobDescription,
    resumeFile,
  });

  if (data) {
    navigate(`/interview/${data._id}`);
  }
};
  
  if (loading) {
    return (
      <main className="loading-screen">
        <h1>Loading your interview plan...</h1>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" />
        </div>
      </main>
    );
  }
  return (
    <main className="home">
      <div className="layout">

      <div className="wrapper">
        {/* HEADER */}
        <div className="hero">
          <h1>
            Create Your Custom <span>Interview Plan</span>
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile to
            build a winning strategy.
          </p>
        </div>

        {/* CARD */}
        <div className="card">
          {/* LEFT */}
          <div className="left panel">
            <div className="panel-header">
              <div className="title">
                <span className="icon">📦</span>
                Target Job Description
              </div>
              <span className="badge">REQUIRED</span>
            </div>
            <textarea
              onChange={(e) => {
                setJobDescription(e.target.value);
              }}
              className="
w-full
h-full         /* fixed height */
resize-none        /* user resize disable */
overflow-hidden    /* scrollbar remove */
p-4
rounded-xl
bg-[#1e293b]
text-gray-300
border border-gray-700
focus:outline-none
focus:ring-2
focus:ring-pink-500
"
              maxLength={5000}
              placeholder="Paste the full job description here..."
            />
{errors.jobDescription && (
  <small className="error">{errors.jobDescription}</small>
)}
            <div className="char-count">0 / 5000 chars</div>
          </div>

          {/* RIGHT */}
          <div className="right panel">
            <div className="panel-header">
              <div className="title">
                <span className="icon">👤</span>
                Your Profile
              </div>
            </div>

            <div className="upload-section">
              <div className="upload-title">
                Upload Resume <span className="best">BEST RESULTS</span>
              </div>

              <div className="upload-box">
                <input ref={resumeInputRef} hidden type="file" id="resume" />
                <label htmlFor="resume">
                  <div className="upload-content">
                    <div className="upload-icon">⬆</div>
                    <p>Click to upload or drag & drop</p>
                    <small>PDF or DOCX (Max 5MB)</small>
                  </div>
                </label>
              </div>
                {errors.profile && (
  <small className="error">{errors.profile}</small>
)}
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="self-desc">
              <label>Quick Self-Description</label>
              <textarea
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                }}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
        
            </div>

            <div className="info-box">
              Either a <b>Resume</b> or a <b>Self Description</b> is required to
              generate a personalized plan.
            </div>
          </div>

          {/* FOOTER */}
          <div className="footer">
            <span>AI-Powered Strategy Generation • Approx 30s</span>
            <button onClick={handleGenerateReport}>
              ★ Generate My Interview Strategy
            </button>
          </div>
        </div>
      </div>

      {/* Recent Reports List */}
      {reports.length > 0 && (
        <section className="recent-reports">
          <h2>My Recent Interview Plans</h2>
          <ul className="reports-list">
            {reports.map((report) => (
              <li
                key={report._id}
                className="report-item"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>{report.title || "Untitled Position"}</h3>
                <p className="report-meta">
                  Generated on {new Date(report.createdAt).toLocaleDateString()}
                </p>
                <p
                  className={`match-score ${report.matchScore >= 80 ? "score--high" : report.matchScore >= 60 ? "score--mid" : "score--low"}`}
                >
                  Match Score: {report.matchScore}%
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      </div>

    </main>
  );
};

export default Home;

// import React from "react";
// import "../style/home.scss"
// const home = () => {
//         return (
//             <main className='home'>
//                 <div className="interview-input-group">

//                 <div className="left">
//                     <label htmlFor="jobDescription">Job Description</label>
//                     <textarea name = "jobDescription" id= "jobDescription" placeholder="Enter job description here..."></textarea>
//                 </div>

//                 <div className="right">
//                     <div className="input-group">
//                         <p>Resume <small className="highlight">( Use Resume and self Description together for best result)</small></p>
//                         <label className= "file-label" htmlFor="resume">Upload Resume</label>
//                         <input hidden type= "file" name ="resume" id="resume" accept=".pdf"/>
//                     </div>
//                     <div className="input-group">
//                         <label htmlFor="selfDescription">Self Description</label>
//                         <textarea name ="selfDescription" id="selfDescription" placeholder="Describe yourself in a few sentences..."></textarea>
//                     </div>
//                     <button className="button primary-button">Generate Interview Report</button>
//                 </div>

//                 </div>
//             </main>
//         )
// }

// export default home;
