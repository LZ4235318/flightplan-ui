import React, { useState } from "react";

export default function FileUpload({ onFileProcessed }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://flightplanbackendsa01.azurewebsites.net/api/uploadDocument",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();

      onFileProcessed(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-semibold">Upload Flight Document:</label>
      <input type="file" onChange={handleFileChange} disabled={uploading} />
      {uploading && <p className="text-sm text-blue-600">Uploading and processing...</p>}
      {error && <p className="text-sm text-red-600">Error: {error}</p>}
    </div>
  );
}
