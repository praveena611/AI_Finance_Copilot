import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadReceipt } from "../services/receiptService";

export default function ReceiptUpload({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a receipt.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const data = await uploadReceipt(formData);

      onSuccess(data);

      alert("Receipt uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-6 shadow-md bg-white">

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />

      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-4 w-64 rounded-lg border"
        />
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Analyzing...
          </>
        ) : (
          <>
            <Upload size={18} />
            Upload Receipt
          </>
        )}
      </button>

    </div>
  );
}