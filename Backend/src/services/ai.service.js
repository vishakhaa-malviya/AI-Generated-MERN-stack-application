const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const interviewReportSchema = {
  type: SchemaType.OBJECT,
  properties: {
    jobDescription: { type: SchemaType.STRING },
    resume: { type: SchemaType.STRING },
    selfDescription: { type: SchemaType.STRING },
    matchScore: {
      type: SchemaType.NUMBER,
      description: "Match percentage 0 to 100",
    },
    technicalQuestions: {
      type: SchemaType.ARRAY,
      description: "An array of EXACTLY 5 technical interview questions.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: { type: SchemaType.STRING },
          intention: { type: SchemaType.STRING },
          answer: { type: SchemaType.STRING },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: SchemaType.ARRAY,
      description: "An array of EXACTLY 5 behavioral interview questions.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          question: { type: SchemaType.STRING },
          intention: { type: SchemaType.STRING },
          answer: { type: SchemaType.STRING },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          skill: { type: SchemaType.STRING },
          severity: {
            type: SchemaType.STRING,
            enum: ["low", "medium", "high"],
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: SchemaType.ARRAY,
      description: "An array of at least 7 days preparation planning.",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.NUMBER },
          focus: { type: SchemaType.STRING },
          tasks: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
    title: {
      type: SchemaType.STRING,
      description: "Job title derived from the job description",
    },
  },
  required: [
    "jobDescription",
    "resume",
    "matchScore",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport(
  resumeText,
  selfDescription,
  jobDescriptionText,
) {
  console.log("Analyzing resume with Gemini API...");
  console.log("resumeText length:", resumeText?.length || 0);
  console.log("selfDescription length:", selfDescription?.length || 0);
  console.log("jobDescription length:", jobDescriptionText?.length || 0);

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: interviewReportSchema,
      },
    });

    const prompt = `You are an expert technical recruiter and software engineer. 
        
Analyze the candidate's profile against the job description below and generate a detailed, PERSONALIZED interview preparation report.

CRITICAL INSTRUCTIONS:
- Base ALL questions, skill gaps, and preparation plan STRICTLY on the actual job description and candidate profile provided below.
- Do NOT generate generic questions. Every question must be specific to the candidate's experience and the job requirements.
- The matchScore must reflect how well this specific candidate matches this specific job.
- Use the resume AND self-description together to understand the candidate's full profile.

---

JOB DESCRIPTION:
${jobDescriptionText || "Not provided"}

---

CANDIDATE RESUME:
${resumeText || "Not provided"}

---

CANDIDATE SELF-DESCRIPTION:
${selfDescription || "Not provided"}

---

Now generate the personalized interview report JSON based strictly on the above content.`;

    const result = await model.generateContent(prompt);
    const reportData = JSON.parse(result.response.text());

    console.log("✅ Analysis Complete!");
    return reportData;
  } catch (error) {
    console.error("❌ Error communicating with Gemini--->", error);
    throw error;
  }
}

async function generatePdfFromHtml(htmlContent) {
  let browser = null;
  try {
    const isProduction = process.env.NODE_ENV === "production";
    
    if (isProduction) {
      const chromium = require("@sparticuz/chromium");
      const puppeteer = require("puppeteer-core");
      
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      const puppeteer = require("puppeteer");
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
    }

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "12mm",
        bottom: "12mm",
        left: "12mm",
        right: "12mm",
      },
    });

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
}

// async function generatePdfFromHtml(htmlContent) {
//   try {
//     const options = {
//       format: "A4",
//       width: "210mm",
//       height: "297mm",
//       printBackground: true,
//       margin: {
//         top: "20mm",
//         bottom: "20mm",
//         left: "15mm",
//         right: "15mm",
//       },
//     };

//     const file = { content: htmlContent };
//     const pdfBuffer = await generatePdf(file, options);
//     return pdfBuffer;
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     throw new Error(`Failed to generate PDF: ${error.message}`);
//   }
// }

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          html: {
            type: SchemaType.STRING,
            description:
              "Complete self-contained HTML for a professional resume",
          },
        },
        required: ["html"],
      },
    },
  });

  const prompt = `You are an expert resume writer. Generate a professional, single-page, ATS-friendly resume in HTML format.

CANDIDATE DETAILS:
Resume/Experience: ${resume || "Not provided"}
Self Description: ${selfDescription || "Not provided"}  
Target Job Description: ${jobDescription || "Not provided"}

STRICT DESIGN REQUIREMENTS - Follow EXACTLY:
- SINGLE PAGE ONLY — everything must fit on one A4 page. Cut content if needed.
- Style it like a traditional compact resume: plain white background, black text, no colors, no cards, no sidebars
- Name at top center in large bold text
- Contact info on one line below name (phone | email | LinkedIn | GitHub)
- Section headings in ALL CAPS, bold, with a thin horizontal line underneath
- No profile photo, no icons, no colored boxes
- Font: Arial or similar sans-serif, body text 10-11px
- Tight line spacing and margins to fit everything on one page
- Sections in this order: Summary, Technical Skills, Experience, Projects, Education
- Use bullet points (•) for experience and project items
- Skills section: one line per category, bold category name followed by comma-separated skills
- Return a complete self-contained HTML with all CSS inline or in a <style> tag
- Page size must be exactly A4 (210mm x 297mm)
- All margins: 12mm
- DO NOT use cards, shadows, colored sections, or modern design elements
- CRITICAL: Must fit on exactly ONE page — reduce font size or spacing if needed`;

  const result = await model.generateContent(prompt);
  const { html } = JSON.parse(result.response.text());
  const pdfBuffer = await generatePdfFromHtml(html);
  return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
