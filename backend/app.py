import pdfplumber
from flask import Flask, request, jsonify
import os
SKILLS = [
    "python",
    "java",
    "c++",
    "html",
    "css",
    "javascript",
    "react",
    "nodejs",
    "mongodb",
    "mysql",
    "sql",
    "git",
    "github",
    "flask",
    "machine learning",
    "deep learning",
    "data structures",
    "algorithms"
]
app = Flask(__name__)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

def extract_text_from_pdf(pdf_path):

    text = ""

    with pdfplumber.open(pdf_path) as pdf:

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

    return text
def detect_skills(text):

    found_skills = []

    text = text.lower()

    for skill in SKILLS:

        if skill.lower() in text:

            found_skills.append(skill)

    return found_skills
def calculate_ats_score(text, skills):

    score = 0

    text = text.lower()

    # Skills
    if len(skills) >= 5:
        score += 20

    # Education
    education_keywords = [
        "b.tech",
        "btech",
        "bachelor",
        "degree",
        "college",
        "university"
    ]

    if any(word in text for word in education_keywords):
        score += 20

    # Projects
    project_keywords = [
        "project",
        "projects"
    ]

    if any(word in text for word in project_keywords):
        score += 20

    # Experience
    experience_keywords = [
        "experience",
        "internship",
        "intern"
    ]

    if any(word in text for word in experience_keywords):
        score += 20

    # Contact Information
    if "@" in text:
        score += 20

    return score
    
def ats_feedback(score):

    if score >= 80:
        return "Excellent ATS Resume"

    elif score >= 60:
        return "Good Resume, Needs Improvements"

    elif score >= 40:
        return "Average Resume"

    else:
        return "Poor ATS Resume"
    
@app.route("/")
def home():
    return "Backend Running"


@app.route("/upload", methods=["POST"])
def upload_resume():

    if "resume" not in request.files:
        return jsonify({
            "error": "No file uploaded"
        }), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({
            "error": "No file selected"
        }), 400

    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        file.filename
    )

    file.save(filepath)

    resume_text = extract_text_from_pdf(filepath)
    detected_skills = detect_skills(resume_text)
    ats_score = calculate_ats_score(
    resume_text,
    detected_skills
    )
    feedback = ats_feedback(ats_score)

    return jsonify({
    "message": "Resume uploaded successfully",
    "filename": file.filename,
    "ats_score": ats_score,
    "feedback": feedback,
    "skills": detected_skills,
    "text": resume_text
    })


if __name__ == "__main__":
    app.run(debug=True)