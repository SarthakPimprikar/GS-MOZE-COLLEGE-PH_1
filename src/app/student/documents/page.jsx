"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Eye, Grid, List, CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "@/context/SessionContext";

export default function MyDocuments() {
  const { user } = useSession();
  const [viewMode, setViewMode] = useState("grid");
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;
      try {
        const studentId = user.id || user._id;
        const res = await fetch(`/api/students/${studentId}/admission`);
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success && data.admission?.documents) {
          setDocuments(data.admission.documents);
        } else {
          setDocuments([]);
        }
      } catch (err) {
        console.error("Failed to fetch documents", err);
        setError("Could not load your documents. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-moze-primary" />
        <span className="ml-3 text-gray-500 font-medium">Loading your documents...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-1">My Documents</h1>
          <p className="text-gray-500 text-sm">Review your uploaded admission documents and certificates.</p>
        </div>
        
        <div className="bg-white border rounded-xl p-1 flex shadow-sm">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-maroon-50 text-moze-primary shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-maroon-50 text-moze-primary shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((doc, index) => (
            <motion.div 
              key={doc._id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group"
            >
              <div className="p-5 flex-1 flex flex-col items-center justify-center text-center bg-gradient-to-br from-gray-50 to-white">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 leading-snug">{doc.type || "Document"}</h3>
                <p className="text-xs text-gray-500">{doc.fileName || "Unknown File"}</p>
              </div>
              
              <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md bg-green-100 text-green-700`}>
                    Verified
                  </span>
                </div>
                <div className="flex gap-2">
                  <a href={doc.fileUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 text-sm font-semibold text-moze-primary bg-maroon-50 rounded-lg hover:bg-moze-primary hover:text-white transition-colors flex justify-center items-center">
                    <Eye className="w-4 h-4 mr-2" /> View
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
          {documents.length === 0 && (
            <div className="col-span-full py-10 flex flex-col items-center justify-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <FileText className="w-10 h-10 mb-3 text-gray-400" />
              <p className="font-medium">No documents uploaded during your admission.</p>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                  <th className="p-4 font-semibold">Document Name</th>
                  <th className="p-4 font-semibold">Format & Size</th>
                  <th className="p-4 font-semibold">Upload Date</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <motion.tr 
                    key={doc._id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-900">{doc.type || "Document"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {doc.fileName || "Unknown File"}
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-green-50 text-green-700`}>
                        <CheckCircle className="w-3.5 h-3.5" />
                        Verified
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={doc.fileUrl || "#"} target="_blank" rel="noopener noreferrer" className="p-2 text-moze-primary hover:bg-maroon-50 rounded-lg" title="View Document">
                          <Eye className="w-5 h-5" />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
