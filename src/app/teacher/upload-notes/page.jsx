"use client";
import { useState, useEffect } from "react";
import { UploadCloud, FileText, Loader2 } from "lucide-react";
import { useSession } from "@/context/SessionContext";

export default function NoteUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useSession();

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!user || user.role !== "teacher") {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/teachers/${user.id}/dashboard`);
        if (!response.ok) throw new Error("Failed to fetch teacher data");
        const data = await response.json();

        setSubjects(
          data.mySubjects
            ? [...new Set(data.mySubjects.flatMap((y) => y.subjects || []))]
            : []
        );
        setYears(
          data.mySubjects
            ? [...new Set(data.mySubjects.map((y) => y.year).filter(Boolean))]
            : []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit");
      return;
    }
    setFile(selectedFile);
    setFileName(selectedFile?.name || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("files", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subject", subject);
    formData.append("year", year);
    formData.append("teacherId", user.id);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setSuccessMessage(data.error || "Upload failed. Please try again.");
        return;
      }

      setSuccessMessage(data.message || `File "${fileName}" uploaded successfully!`);
      setTimeout(() => setSuccessMessage(""), 5000);

      onUploadSuccess?.(data);

      setFile(null);
      setTitle("");
      setDescription("");
      setSubject("");
      setYear("");
      setFileName("");
      document.getElementById("file").value = "";
    } catch (error) {
      console.error(error);
      setSuccessMessage("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  if (!user || user.role !== "teacher") {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md text-center py-8">
        <p className="text-gray-600">Only teachers can upload notes.</p>
      </div>
    );
  }

  if (!subjects.length || !years.length) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md text-center py-8">
        <p className="text-gray-600">
          You need to be assigned to subjects and years before uploading notes.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center mb-6">
        <div className="p-3 rounded-full bg-indigo-50 mr-4">
          <UploadCloud className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Upload Notes</h2>
          <p className="text-gray-500">Share your study materials with the community</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            >
              <option value="">Select a subject</option>
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            >
              <option value="">Select year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="Enter a descriptive title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition min-h-[100px]"
            placeholder="Add a brief description of your notes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">File</label>
          <label
            htmlFor="file"
            className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer ${
              file ? "border-indigo-300 bg-indigo-50" : "border-gray-300 hover:border-indigo-300 hover:bg-indigo-50"
            } transition`}
          >
            {file ? (
              <div className="flex items-center text-indigo-600">
                <FileText className="h-5 w-5 mr-2" />
                <span className="font-medium">{fileName}</span>
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-indigo-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, PPT, PPTX (MAX. 10MB)</p>
              </div>
            )}
            <input id="file" type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt,.ppt,.pptx" required />
          </label>
        </div>

        {successMessage && (
          <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-300 text-green-700 text-sm text-center">
            {successMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isUploading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition`}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Uploading...
            </>
          ) : (
            "Upload Note"
          )}
        </button>
      </form>
    </div>
  );
}
