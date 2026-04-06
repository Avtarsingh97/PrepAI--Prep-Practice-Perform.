const { GoogleGenAI, Type } = require("@google/genai")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The title of the job for which the interview report is generated" },
        matchScore: { type: Type.NUMBER, description: "A score between 0 and 100 indicating how well the candidate's profile matches the job description" },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"], description: "The severity of this skill gap" }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan for the candidate to follow",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day in the preparation plan" },
                    task: {
                        type: Type.ARRAY,
                        description: "List of tasks to be done on this day to follow the preparation plan",
                        items: { type: Type.STRING }
                    }
                },
                required: ["day", "focus", "task"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are a backend API that MUST return strictly valid JSON matching a given schema.

CRITICAL INSTRUCTIONS:
- Output ONLY valid JSON
- Do NOT use markdown or backticks
- Do NOT include explanations
- Do NOT return anything outside JSON
- Do NOT stringify JSON
- Do NOT return flat arrays like ["key","value"]
- Do NOT repeat keys
- All arrays MUST contain objects (except "task" which is array of strings)
- Generate atleast 5 technical questions, 5 behavioral questions, and 7 days preparation plan days

If the output does not match the schema exactly, it will be rejected.

-------------------------------------

JSON SCHEMA REQUIREMENTS:

{
  "title": string,

  "matchScore": number (0 to 100),

  "technicalQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],

  "behavioralQuestions": [
    {
      "question": string,
      "intention": string,
      "answer": string
    }
  ],

  "skillGaps": [
    {
      "skill": string,
      "severity": "low" | "medium" | "high"
    }
  ],

  "preparationPlan": [
    {
      "day": number,
      "focus": string,
      "task": [string]
    }
  ]
}

-------------------------------------

STRICT VALIDATION RULES:

1. "matchScore" must be between 0 and 100
2. "severity" must be EXACTLY one of: "low", "medium", "high" (lowercase only)
3. "preparationPlan" must be a SINGLE array (no duplicate keys)
4. "day" must start from 1 and increment sequentially
5. "task" must be an ARRAY of strings (NOT a single string)
6. Each object array must contain at least 2 items
7. No null values
8. No missing fields
9. All keys must be present exactly as defined
10. Use double quotes for all strings

-------------------------------------

INPUT DATA:

Job Description:
${jobDescription}

Resume:
${resume}

Self Description:
${selfDescription}

-------------------------------------

Return ONLY valid JSON that matches the schema.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema,
        }
    })
    const responseData = JSON.parse(response.text);

    return responseData;
}

async function generatePdfFromHtml(htmlContent) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new", // Modern headless mode
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--no-zygote",
                "--single-process"
            ],
            // Use local chrome if provided via environment variable
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
        });
    } catch (error) {
        console.error("Error launching puppeteer browser:", error);
        throw new Error("Failed to initialize PDF generator. Please ensure Chrome is installed correctly.");
    }
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle2" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: false,
        margin: {
            top: "15mm",
            bottom: "15mm",
            left: "15mm",
            right: "15mm"
        }
    })
    await browser.close();
    return pdfBuffer;


}

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        personalInfo: {
            type: Type.OBJECT,
            properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                portfolio: { type: Type.STRING }
            },
            required: ["fullName", "email", "phone"]
        },
        summary: { type: Type.STRING, description: "A professional summary tailored to the job description" },
        skills: {
            type: Type.ARRAY,
            description: "Categorized technical skills",
            items: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING, description: "Category name like Languages, Frameworks, etc." },
                    list: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.ARRAY, items: { type: Type.STRING } },
                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                    link: { type: Type.STRING }
                }
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    degree: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    location: { type: Type.STRING },
                    completionYear: { type: Type.STRING }
                }
            }
        },
        certifications: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["personalInfo", "summary", "skills", "experience", "education"]
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are a professional resume writer. Generate a tailored resume for a candidate based on their existing resume, self-description, and a target job description.

STRICT JSON OUTPUT ONLY. The response must follow the provided schema exactly.

RESOURCES:
- Candidate Resume: ${resume}
- Self Description: ${selfDescription}
- Target Job Description: ${jobDescription}

CRITICAL GUIDELINES:
1.  **Tailoring**: Align experience, summary, and skills precisely with the job description. Highlight keywords that increase ATS score.
2.  **Professional Tone**: Use action verbs (e.g., "Engineered", "Optimized", "Spearheaded") and avoid AI-sounding phrases like "I am a motivated candidate".
3.  **Human-Like Content**: Ensure the bullet points sound like they were written by a professional developer, showing impact and quantifiable results where possible.
4.  **Summary**: Professional and targeted, 3-4 lines maximum.
5.  **Skills**: Group technologies appropriately (Languages, Frameworks, Databases, Tools).
6.  **Experience/Projects**: Use clear bullet points for responsibilities and achievements.
7.  **ATS Friendly**: Use standard terminology and clear structure.
8.  **Strict Length Limit**: The total content MUST fit into EXACTLY 2 pages when rendered to PDF. Do not generate excessive content that would spill over to a 3rd page. Focus on quality over quantity.

The response must be valid JSON and match the schema.
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumeSchema,
        }
    })

    const resumeData = JSON.parse(response.text);

    // Template for rendering the JSON data into HTML
    const renderResumeHtml = (data) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${data.personalInfo.fullName} - Resume</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.4; color: #333; margin: 0; padding: 0; background-color: #f3f4f6; }
        .container { width: 100%; max-width: 800px; margin: 20px auto; padding: 40px; background-color: #fff; border: 1px solid #e5e7eb; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        header { text-align: center; border-bottom: 2px solid #1f2937; padding-bottom: 15px; margin-bottom: 20px; }
        h1 { margin: 0; font-size: 26px; color: #1f2937; text-transform: uppercase; letter-spacing: 1.5px; }
        .contact-info { font-size: 13px; margin-top: 8px; color: #4b5563; }
        .contact-info a { color: #2563eb; text-decoration: none; margin: 0 8px; }
        section { margin-bottom: 20px; }
        h2 { font-size: 16px; border-bottom: 1px solid #d1d5db; padding-bottom: 5px; margin-bottom: 10px; color: #1f2937; text-transform: uppercase; font-weight: bold; }
        .summary p { margin: 0; font-size: 13.5px; text-align: justify; color: #333; line-height: 1.5; }
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 8px; font-size: 12.5px; }
        .skill-cat { font-weight: 700; color: #2c3e50; }
        .item { margin-bottom: 15px; page-break-inside: avoid; }
        .item-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 14.5px; color: #111827; }
        .item-sub { display: flex; justify-content: space-between; font-style: italic; font-size: 12.5px; color: #6b7280; margin-bottom: 4px; }
        ul { margin: 5px 0; padding-left: 20px; font-size: 13px; color: #374151; }
        li { margin-bottom: 3px; }
        .education-item { margin-bottom: 10px; font-size: 13.5px; page-break-inside: avoid; }
        @media print { 
            body { background-color: #fff; line-height: 1.3; }
            .container { width: 100%; max-width: 100%; border: none; box-shadow: none; margin: 0; padding: 0; } 
            section { margin-bottom: 15px; }
            h2 { font-size: 15px; }
            .summary p, .item-header, .item-sub, ul, .education-item { font-size: 12px; }
            .contact-info { font-size: 11px; margin-top: 5px; }
            .contact-info a { color: #000; text-decoration: underline; } 
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>${data.personalInfo.fullName}</h1>
            <div class="contact-info">
                ${data.personalInfo.phone} | ${data.personalInfo.email} | ${data.personalInfo.location}<br>
                ${data.personalInfo.linkedin ? `<a href="${data.personalInfo.linkedin}">LinkedIn</a>` : ''}
                ${data.personalInfo.portfolio ? `| <a href="${data.personalInfo.portfolio}">Portfolio</a>` : ''}
            </div>
        </header>

        <section class="summary">
            <h2>Professional Summary</h2>
            <p>${data.summary}</p>
        </section>

        <section>
            <h2>Technical Skills</h2>
            <div class="skills-grid">
                ${data.skills.map(s => `<div><span class="skill-cat">${s.category}:</span> ${s.list.join(', ')}</div>`).join('')}
            </div>
        </section>

        <section>
            <h2>Professional Experience</h2>
            ${data.experience.map(exp => `
                <div class="item">
                    <div class="item-header"><span>${exp.jobTitle}</span><span>${exp.duration}</span></div>
                    <div class="item-sub"><span>${exp.company}</span><span>${exp.location}</span></div>
                    <ul>
                        ${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </section>

        ${data.projects && data.projects.length > 0 ? `
        <section>
            <h2>Key Projects</h2>
            ${data.projects.map(p => `
                <div class="item">
                    <div class="item-header"><span>${p.title}</span>${p.link ? `<span><a href="${p.link}">View Project</a></span>` : ''}</div>
                    <div class="item-sub"><span>${p.technologies.join(', ')}</span></div>
                    <ul>
                        ${p.description.map(d => `<li>${d}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </section>
        ` : ''}

        <section>
            <h2>Education</h2>
            ${data.education.map(edu => `
                <div class="education-item">
                    <strong>${edu.degree}</strong> | ${edu.institution} | ${edu.location} | ${edu.completionYear}
                </div>
            `).join('')}
        </section>

        ${data.certifications && data.certifications.length > 0 ? `
        <section>
            <h2>Certifications</h2>
            <div style="font-size: 14px; color: #444;">
                ${data.certifications.join(' • ')}
            </div>
        </section>
        ` : ''}
    </div>
</body>
</html>
`;

    const html = renderResumeHtml(resumeData);

    const pdfBuffer = await generatePdfFromHtml(html);
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf }
