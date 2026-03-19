"use client";
import React, { useState, useEffect } from "react";
import {
  BookOpenText,
  GraduationCap,
  IndianRupee,
  Library,
  CalendarDays,
  UserCog,
  ClipboardSignature,
  BarChart4,
  FlaskConical,
  Building2,
  Briefcase,
  FileSearch,
  Edit,
  X,
  Plus,
  Trash2,
} from "lucide-react";

const iconMap = {
  BookOpenText: <BookOpenText className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  IndianRupee: <IndianRupee className="w-6 h-6" />,
  Library: <Library className="w-6 h-6" />,
  CalendarDays: <CalendarDays className="w-6 h-6" />,
  UserCog: <UserCog className="w-6 h-6" />,
  ClipboardSignature: <ClipboardSignature className="w-6 h-6" />,
  BarChart4: <BarChart4 className="w-6 h-6" />,
  FlaskConical: <FlaskConical className="w-6 h-6" />,
  Building2: <Building2 className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  FileSearch: <FileSearch className="w-6 h-6" />,
};

const iconNames = [
  "BookOpenText",
  "GraduationCap",
  "IndianRupee",
  "Library",
  "CalendarDays",
  "UserCog",
  "ClipboardSignature",
  "BarChart4",
  "FlaskConical",
  "Building2",
  "Briefcase",
  "FileSearch",
];

export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ title: "", description: "", icon: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [addData, setAddData] = useState({ title: "", description: "", icon: "BookOpenText" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await fetch("/api/modules");
      const data = await response.json();
      setModules(data.modules);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching modules:", error);
      setErrorMessage("Failed to load modules");
      setLoading(false);
    }
  };

  const handleEditClick = (module) => {
    setEditingId(module._id);
    setEditData({ title: module.title, description: module.description, icon: module.icon });
  };

  const handleSaveEdit = async () => {
    if (!editData.title || !editData.description || !editData.icon) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      const response = await fetch("/api/modules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...editData }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Module updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setEditingId(null);
        fetchModules();
      } else {
        setErrorMessage(data.message || "Failed to update module");
      }
    } catch (error) {
      console.error("Error saving module:", error);
      setErrorMessage("Server error while updating");
    }
  };

  const handleAddSave = async () => {
    if (!addData.title || !addData.description || !addData.icon) {
      setErrorMessage("All fields are required");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const response = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Module added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        setIsAdding(false);
        setAddData({ title: "", description: "", icon: "BookOpenText" });
        fetchModules();
      } else {
        setErrorMessage(data.message || "Failed to add module");
      }
    } catch (error) {
      console.error("Error adding module:", error);
      setErrorMessage("Server error while adding");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      const response = await fetch(`/api/modules?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccessMessage("Module deleted successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
        fetchModules();
      } else {
        setErrorMessage("Failed to delete module");
      }
    } catch (error) {
      console.error("Error deleting module:", error);
      setErrorMessage("Server error while deleting");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 relative">
      {/* Top Controls */}
      <div className="flex justify-center mb-6">
        <div className="hidden md:block">
          <span className="px-6 py-2 bg-blue-50/70 rounded-full text-sm font-medium text-gray-700 border border-blue-200">
            Edit Modules (Changes Reflect on Landing Page)
          </span>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm animate-fade-in-down">
          ✓ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-fade-in-down">
          ✗ {errorMessage}
        </div>
      )}

      {/* Main Box Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Manage Modules
        </h2>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" /> Add New Module
        </button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Add New Card Slot (Visible when adding) */}
        {isAdding && (
          <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-500 scale-105 transform transition duration-200">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold text-gray-800">New Module</h4>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Icon Selector */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-600 block mb-1">Icon</label>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded text-blue-600">
                  {iconMap[addData.icon] || <BookOpenText className="w-5 h-5" />}
                </div>
                <select
                  value={addData.icon}
                  onChange={(e) => setAddData({ ...addData, icon: e.target.value })}
                  className="flex-1 px-2 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {iconNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-3">
              <label className="text-xs font-medium text-gray-600 block mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Transport"
                value={addData.title}
                onChange={(e) => setAddData({ ...addData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
              <textarea
                placeholder="Short description..."
                value={addData.description}
                onChange={(e) => setAddData({ ...addData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                rows="3"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddSave}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition shadow-sm"
              >
                Create
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {modules.map((item, index) => (
          <div
            key={item._id || index}
            className={`relative bg-white p-6 rounded-xl border border-gray-100 transition duration-200 shadow-sm ${editingId === item._id ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02] z-10' : 'hover:border-blue-300 hover:shadow-md group'}`}
          >
            {/* Action Buttons (Edit/Delete) - Only show when NOT editing this specific card */}
            {editingId !== item._id && (
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleEditClick(item)}
                  className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md text-blue-600 hover:text-blue-700 border border-gray-100"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md text-red-500 hover:text-red-600 border border-gray-100"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Card Content (when not editing) */}
            {editingId !== item._id ? (
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-100 transition mb-2">
                  {iconMap[item.icon]}
                </div>

                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ) : (
              // Edit Form
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm">Edit Module</h4>
                  <button
                    onClick={() => setEditingId(null)}
                    className="p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* Icon Selector */}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Icon</label>
                  <select
                    value={editData.icon}
                    onChange={(e) => setEditData({ ...editData, icon: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Icon</option>
                    {iconNames.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title Input */}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Title</label>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Description</label>
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none focus:ring-1 focus:ring-blue-500 outline-none"
                    rows="2"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition shadow-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
