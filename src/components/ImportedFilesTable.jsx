"use client";
import React, { useState, useEffect } from "react";
import { 
  FileSpreadsheet,
  Download,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

const ImportedFilesTable = ({ userId, refreshTrigger }) => {
  const [importedFiles, setImportedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchImportedFiles();
    }
  }, [userId, refreshTrigger]);

  const fetchImportedFiles = async () => {
    try {
      setLoading(true);
      console.log("Fetching imported files for userId:", userId); // Debug log
      const response = await fetch(`/api/imported-files?userId=${userId}`);
      const data = await response.json();
      
      console.log("API Response:", data); // Debug log
      
      if (data.success) {
        setImportedFiles(data.importedFiles || []);
        console.log("Files loaded:", data.importedFiles || []); // Debug log
      } else {
        console.error("API Error:", data.error); // Debug log
        toast.error(data.error || "Failed to fetch imported files");
      }
    } catch (error) {
      console.error("Error fetching imported files:", error); // Debug log
      toast.error("Failed to fetch imported files");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this imported file?")) {
      return;
    }

    try {
      const response = await fetch(`/api/imported-files?fileId=${fileId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Imported file deleted successfully");
        fetchImportedFiles();
      } else {
        toast.error(data.error || "Failed to delete imported file");
      }
    } catch (error) {
      console.error("Error deleting imported file:", error);
      toast.error("Failed to delete imported file");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "partial":
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "partial":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatNumber = (num) => {
    return num ? num.toLocaleString() : "0";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading imported files...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Imported Excel Files ({importedFiles.length})
          </h3>
        </div>
        <button
          onClick={fetchImportedFiles}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Files Table */}
      {importedFiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium mb-2">No imported files found</p>
          <p className="text-gray-500 text-sm">
            When you import Excel files, they will appear here with their import status and details.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Records
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imported
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duplicates
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Errors
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imported Date
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {importedFiles.map((file) => (
                  <tr key={file._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileSpreadsheet className="w-4 h-4 text-green-500 mr-2" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                            {file.originalFileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {file.mimeType}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                        {getStatusIcon(file.status)}
                        <span className="ml-1">
                          {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(file.totalRecords)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(file.importedRecords)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(file.duplicateRecords)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatNumber(file.errorRecords)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.fileSize)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(file.createdAt)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={file.filePath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                          title="Download file"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(file._id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                          title="Delete file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {importedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {importedFiles.reduce((sum, file) => sum + (file.totalRecords || 0), 0)}
            </div>
            <div className="text-sm text-blue-600 font-medium">Total Records</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {importedFiles.reduce((sum, file) => sum + (file.importedRecords || 0), 0)}
            </div>
            <div className="text-sm text-green-600 font-medium">Successfully Imported</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {importedFiles.reduce((sum, file) => sum + (file.duplicateRecords || 0), 0)}
            </div>
            <div className="text-sm text-red-600 font-medium">Duplicates</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {importedFiles.reduce((sum, file) => sum + (file.errorRecords || 0), 0)}
            </div>
            <div className="text-sm text-orange-600 font-medium">Errors</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportedFilesTable;
