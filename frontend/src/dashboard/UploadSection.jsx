import { useState } from "react";
import { uploadReceipt } from "../services/receiptService";
import "./uploadSection.css";

export default function UploadSection({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a receipt.");
      return;
    }

    setLoading(true);
    setStatus("uploading");
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);

    const interval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 10 : prev));
    }, 200);

    try {
      const data = await uploadReceipt(formData);

      clearInterval(interval);

      setProgress(100);
      setStatus("analyzing");

      setTimeout(() => {
        setStatus("done");

        if (onSuccess) {
          onSuccess(data);
        }
      }, 1000);
    } catch (err) {
      clearInterval(interval);
      console.error(err);
      alert("Upload failed.");
      setStatus("idle");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-wrapper">
      <div className={`upload-card ${status}`}>
        <h2>AI Receipt Scanner</h2>

        <p>
          Upload your receipt → AI extracts & categorizes expenses
        </p>

        <label className="drop-zone">
          <input
            type="file"
            accept="image/*,.pdf"
            hidden
            onChange={handleFile}
          />

          <div className="drop-content">
            {status === "idle" && (
              <>
                <div className="icon">📄</div>
                <p>Drag & Drop or Click to Upload</p>
              </>
            )}

            {status === "uploading" && (
              <>
                <div className="spinner"></div>
                <p>Uploading Receipt...</p>
              </>
            )}

            {status === "analyzing" && (
              <>
                <div className="pulse"></div>
                <p>AI is analyzing your receipt...</p>
              </>
            )}

            {status === "done" && (
              <>
                <div className="check">✅</div>
                <p>Receipt processed successfully!</p>
              </>
            )}
          </div>
        </label>

        {(status === "uploading" || status === "analyzing") && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {file && (
          <div className="file-name">
            📎 {file.name}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="upload-btn"
        >
          {loading ? "Analyzing..." : "Upload Receipt"}
        </button>
      </div>
    </div>
  );
}