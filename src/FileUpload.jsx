import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function FileUpload({ onFileProcessed }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/api/fileuploadhandler`, 
        {
          method: "POST",
          body: formData,
          // no need to set Content-Type: browser will add multipart boundary
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Upload failed: ${response.status} ${text}`);
      }

      // try JSON, else plain text
      let result;
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text();
      }

      toast.success("Upload successful!");
      onFileProcessed(result);

    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="mb-6 max-w-md mx-auto p-4 bg-white rounded-2xl shadow-lg">
      <label className="block mb-2 font-semibold">
        Upload Flight Document:
      </label>
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full mb-4"
      />

      {uploading && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-blue-600 mt-1">
            Uploading… {progress}%
          </p>
        </div>
      )}

      <button
        onClick={() => document.querySelector('input[type="file"]').click()}
        disabled={uploading}
        className="w-full py-2 rounded-2xl shadow hover:bg-blue-700 bg-blue-600 text-white font-medium"
      >
        {uploading ? "Uploading…" : "Choose & Upload File"}
      </button>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}
