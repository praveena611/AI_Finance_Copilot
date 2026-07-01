import { useState } from "react";
import { Upload, Loader2, ImagePlus } from "lucide-react";
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
    <div className="w-full">

      <label
        htmlFor="receipt"
        className="border-2 border-dashed border-slate-600 hover:border-indigo-500 rounded-2xl bg-slate-900 p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
      >
        <ImagePlus
          size={60}
          className="text-indigo-400 mb-4"
        />

        <h3 className="text-xl font-semibold text-white">
          Drag & Drop Receipt
        </h3>

        <p className="text-slate-400 mt-2">
          or click to browse
        </p>

        <p className="text-sm text-slate-500 mt-1">
          JPG • PNG • PDF
        </p>

        <input
          id="receipt"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {file && (
        <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center gap-4">

          <img
            src={preview}
            alt="Preview"
            className="w-20 h-20 rounded-lg object-cover"
          />

          <div className="flex-1">

            <p className="text-white font-medium">
              {file.name}
            </p>

            <p className="text-slate-400 text-sm">
              {(file.size / 1024).toFixed(1)} KB
            </p>

          </div>

        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 transition rounded-xl py-3 font-semibold text-white flex items-center justify-center gap-3 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Analyzing Receipt...
          </>
        ) : (
          <>
            <Upload size={20} />
            Upload Receipt
          </>
        )}
      </button>

    </div>
  );
}