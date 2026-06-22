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
    
    return jsonify({
    "message": "Resume uploaded successfully",
    "filename": file.filename,
    "skills": detected_skills,
    "text": resume_text
    })


if __name__ == "__main__":
    app.run(debug=True)