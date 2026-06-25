import { useState } from "react";
import axios from "axios";
function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [matching, setMatching] = useState(false); 

  const uploadResume = async (selectedFile) => {
  if (!selectedFile) {
    alert("No file selected");
    return;
  }

  const formData = new FormData();
  formData.append("resume", selectedFile);

  try {
    const res = await axios.post(
      "https://resume-analyser-4d6y.onrender.com/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("UPLOAD RESPONSE:", res.data);
    setResult(res.data);

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    alert("Upload failed");
  }
};

const matchResume = async () => {

  if (!result) {
    return;
  }

  setMatching(true);

  try {

    const response = await axios.post(
      "https://resume-analyser-4d6y.onrender.com/upload",
      {
        resume_text: result.text,
        job_description: jobDescription
      }
    );

    setMatchResult(response.data);
    setMatching(false);

  } catch (error) {
    console.log(error);
    setMatching(false);
  }
};
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 blur-[120px]" />
<div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 blur-[120px]" />
     <h1 className="text-5xl font-bold text-center mb-2">
  AI Resume Analyzer
</h1>
<p className="text-center text-slate-400 mb-10">
  Analyze • Improve • Match
</p>

      <div
  className="
  max-w-4xl
  mx-auto
  bg-white/5
  backdrop-blur-lg
  border
  border-white/10
  p-8
  rounded-3xl
  shadow-2xl
  "
>
        <h2 className="text-3xl font-bold mb-2">
  Upload Resume
</h2>

<p className="text-slate-400 mb-6">
  Upload a PDF and get ATS insights instantly.
</p>

        <label
  className="
  flex
  flex-col
  items-center
  justify-center
  w-full
  h-40 md:h-56
  border-2
  border-dashed
  border-slate-700
  rounded-2xl
  cursor-pointer
  hover:border-sky-500
  hover:bg-slate-800
  transition
  "
>

  <div className="text-center">

    <p className="text-5xl mb-4">
      📄
    </p>

    <p className="text-lg font-semibold">
      Click to Upload Resume
    </p>

    <p className="text-slate-400 text-sm mt-2">
      PDF files only
    </p>

    {file && (
      <p className="mt-4 text-green-400">
        ✓ {file.name}
      </p>
    )}

  </div>

 <input
  type="file"
  accept="application/pdf"
  onChange={(e) => {
    const file = e.target.files?.[0];
    console.log("SELECTED FILE:", file);
    uploadResume(file);
  }}
/>

</label>
        <button
  onClick={uploadResume}
  className="mt-4 px-6 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:scale-105 text-white rounded"
>
  {loading ? "Analyzing..." : "Upload Resume"}
</button>
{result && (
<div
  className="
  mt-8
  bg-white/5
  backdrop-blur-lg
  rounded-2xl
  p-6
  border
  border-white/10
  shadow-xl
  "
>
    <h2 className="text-2xl font-bold mb-4">
      Analysis Result
    </h2>

    <div className="my-6">

  <p className="text-slate-400 text-sm">
    ATS SCORE
  </p>

  <h3 className="text-6xl font-bold text-green-400">
    {result.ats_score}
  </h3>

</div>

    <p>
      <strong>Feedback:</strong> {result.feedback}
    </p>
  <p className="mt-4">
  <strong>Feedback:</strong>
</p>

<p className="text-green-400 mt-2">
  {result.feedback}
</p>

<div className="flex flex-wrap gap-3 mt-3">

  {result.skills?.map((skill, index) => (

    <span
      key={index}
      className="
      px-4 py-2
      bg-sky-500/10
      text-sky-300
      border border-sky-500/30
      rounded-full
      text-sm
      "
    >
      {skill}
    </span>

  ))}

</div>

    <p className="mt-2">
      <strong>Detected Skills:</strong>
    </p>

    <ul className="list-disc ml-6">
      {result.skills?.map((skill, index) => (
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
    className="
w-full
bg-slate-900
border
border-slate-700
rounded-xl
p-4
text-white
focus:outline-none
focus:border-sky-500
"
    placeholder="Paste Job Description Here..."
  />

  <button
    onClick={matchResume}
    className="
mt-4
px-8
py-3
bg-gradient-to-r from-cyan-500 to-blue-500
hover:bg-cyan-400
hover:scale-105
transition
rounded-xl
font-semibold
"
  >
    {matching ? "Matching..." : "Match Resume"}
  </button>

</div>
{matchResult && (

  <div className="mt-8 bg-slate-800 rounded-2xl p-6 border border-slate-700">

    <h2 className="text-2xl font-bold mb-4">
      Match Analysis
    </h2>

    <div className="mb-6">

  <p className="text-slate-400 text-sm">
    MATCH SCORE
  </p>

  <h3 className="text-5xl font-bold text-cyan-400">
    {matchResult.match_score}%
  </h3>

</div>

    <div className="flex flex-wrap gap-3">

  {matchResult.missing_skills?.map(
    (skill, index) => (

      <span
        key={index}
        className="
        px-4 py-2
        bg-red-500/10
        text-red-300
        border border-red-500/30
        rounded-full
        "
      >
        {skill}
      </span>

    )
  )}

</div>

  </div>

)}
      </div>

    </div>
    
  );
}

export default App;