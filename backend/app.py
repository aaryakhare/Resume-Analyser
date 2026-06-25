from flask import Flask, request, jsonify
import os
import pdfplumber
from flask_cors import CORS, cross_origin
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from werkzeug.utils import secure_filename
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

CORS(app, origins=["*"])
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
def generate_suggestions(
    resume_text,
    skills
):

    suggestions = []

    resume_text = resume_text.lower()

    if len(skills) < 5:
        suggestions.append(
            "Add more technical skills"
        )

    if "project" not in resume_text:
        suggestions.append(
            "Add project details"
        )

    if (
        "internship" not in resume_text
        and
        "experience" not in resume_text
    ):
        suggestions.append(
            "Add internship or work experience"
        )

    if (
        "certificate" not in resume_text
        and
        "certification" not in resume_text
    ):
        suggestions.append(
            "Add certifications"
        )

    if "achievement" not in resume_text:
        suggestions.append(
            "Add achievements or accomplishments"
        )

    return suggestions   
    
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
    filename = secure_filename(file.filename)

    if not filename.endswith(".pdf"):
        return jsonify({"error": "Only PDF allowed"}), 400

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    resume_text = extract_text_from_pdf(filepath)
    detected_skills = detect_skills(resume_text)
    ats_score = calculate_ats_score(
    resume_text,
    detected_skills
    )
    feedback = ats_feedback(ats_score)
    suggestions = generate_suggestions(
    resume_text,
    detected_skills
)
    return jsonify({
    "message": "Resume uploaded successfully",
    "filename": file.filename,
    "ats_score": ats_score,
    "feedback": feedback,
    "suggestions": suggestions,
    "skills": detected_skills,
    "text": resume_text
    })

@app.route("/match", methods=["POST"])
def match_resume():
    data = request.get_json()

    if not data or "resume_text" not in data or "job_description" not in data:
        return jsonify({"error": "Invalid input"}), 400

    resume_text = data["resume_text"]
    job_description = data["job_description"]

    try:
        texts = [resume_text, job_description]

        vectorizer = TfidfVectorizer()
        tfidf = vectorizer.fit_transform(texts)

        similarity = cosine_similarity(tfidf[0], tfidf[1])[0][0]
        match_score = round(similarity * 100, 2)

    except Exception as e:
        return jsonify({"error": "Matching failed", "details": str(e)}), 500

    return jsonify({
        "match_score": match_score,
        "missing_skills": []
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)