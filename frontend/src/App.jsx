import { useState } from "react";
import axios from "axios";
function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null); 
  const uploadResume = async () => {

if (!file) {

alert("Please select a PDF");

return;

}

const formData = new FormData();

formData.append("resume", file);

try {

const response = await axios.post(

"http://localhost:5000/upload",

formData,

{

headers: {

"Content-Type": "multipart/form-data",

},

}

);

setResult(response.data);

} catch (error) {
 console.error(error);
}

};
const matchResume = async () => {

  if (!result) {
    alert("Upload resume first");
    return;
  }

  try {

    const response = await axios.post(
      "http://localhost:5000/match",
      {
        resume_text: result.text,
        job_description: jobDescription
      }
    );

    setMatchResult(response.data);

  } catch (error) {

    console.log(error);

    alert("Matching Failed");
  }
};
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      
      <h1 className="text-4xl font-bold text-center mb-10">
        AI Resume Analyzer
      </h1>

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">

        <h2 className="text-2xl font-semibold mb-4">
          Upload Your Resume
        </h2>

        <input
         type="file"
         accept=".pdf"
         className="border p-2 w-full"
          onChange={(e) => setFile(e.target.files[0])}
/>
        {file && (
  <p className="mt-2 text-green-600">
    Selected: {file.name}
  </p>
)}
        <button
  onClick={uploadResume}
  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded"
>
  Upload Resume
</button>
{result && (
  <div className="mt-6 border rounded-lg p-4">

    <h2 className="text-2xl font-bold mb-4">
      Analysis Result
    </h2>

    <p>
      <strong>ATS Score:</strong> {result.ats_score}
    </p>

    <p>
      <strong>Feedback:</strong> {result.feedback}
    </p>

    <p className="mt-2">
      <strong>Detected Skills:</strong>
    </p>

    <ul className="list-disc ml-6">
      {result.skills.map((skill, index) => (
        <li key={index}>
          {skill}
        </li>
      ))}
    </ul>

  </div>
)}
<div className="mt-8 border rounded-lg p-4">

  <h2 className="text-2xl font-bold mb-4">
    Job Description Matching
  </h2>

  <textarea
    rows="8"
    value={jobDescription}
    onChange={(e) =>
      setJobDescription(e.target.value)
    }
    className="w-full border p-3 rounded"
    placeholder="Paste Job Description Here..."
  />

  <button
    onClick={matchResume}
    className="mt-4 px-6 py-2 bg-green-600 text-white rounded"
  >
    Match Resume
  </button>

</div>
{matchResult && (

  <div className="mt-6 border rounded-lg p-4">

    <h2 className="text-2xl font-bold mb-4">
      Match Analysis
    </h2>

    <p>
      <strong>Match Score:</strong>
      {matchResult.match_score}%
    </p>

    <p className="mt-3">
      <strong>Missing Skills:</strong>
    </p>

    <ul className="list-disc ml-6">

      {matchResult.missing_skills.map(
        (skill, index) => (
          <li key={index}>
            {skill}
          </li>
        )
      )}

    </ul>

  </div>

)}
      </div>

    </div>
    
  );
}

export default App;