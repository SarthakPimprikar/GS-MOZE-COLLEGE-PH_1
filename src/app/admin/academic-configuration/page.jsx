"use client";

import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Loader2,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Check,
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import toast, { Toaster } from "react-hot-toast";

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    departmentName: "",
    programType: "",
    hodId: "",
    description: "",
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [expandedDepartment, setExpandedDepartment] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    fetchDepartments();
    fetchTeachers();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/department");
      if (!response.ok) {
        throw new Error("Failed to fetch departments");
      }
      const data = await response.json();
      setDepartments(data.departments || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err.message);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/department");
      if (!response.ok) {
        throw new Error("Failed to fetch teachers");
      }
      const data = await response.json();
      console.log("adat = ", data)
      // Filter teachers who are HODs with null department
      // const availableHods = data.hodTeachers.filter(
      //   (teacher) => !teacher.department
      // );
      setTeachers(data.hodTeachers);
    } catch (err) {
      console.error("Error fetching teachers:", err);
      setError(err.message);
      setTeachers([]);
    }
  };


  console.log(editingDepartment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingDepartment ? "PUT" : "POST";
      const url = editingDepartment
        ? `/api/department/${editingDepartment?._id}`
        : "/api/department";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departmentName: formData.departmentName,
          hodId: formData.hodId, // Make sure this is included in your formData
          programType: formData.programType,
          description: formData.description,
        }),
      });

      console.log(response);

      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to save department");
      }

      toast.success(
        `Department ${editingDepartment ? "updated" : "created"} successfully`
      );
      resetForm();
      fetchDepartments();
      fetchTeachers()
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error(error.message || "Failed to save department");
    }
  };


  const handleDelete = async (departmentId, departmentName) => {
    if (!window.confirm(`Are you sure you want to delete ${departmentName}?`)) {
      return;
    }

    try {
      // Using both path parameter and query parameter approaches
      const response = await fetch(`/api/department/${departmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
          `Failed to delete department (Status: ${response.status})`
        );
      }

      const data = await response.json();
      toast.success(data.message);
      fetchDepartments(); // Refresh the list
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message);
    }
  };


  const resetForm = () => {
    setShowDialog(false);
    setEditingDepartment(null);
    setFormData({
      departmentName: "",
      programType: "",
      hodId: "",
      description: "",
    });
  };

  const toggleExpandDepartment = (departmentId) => {
    setExpandedDepartment(
      expandedDepartment === departmentId ? null : departmentId
    );
  };

  const toggleDropdown = (departmentId, e) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === departmentId ? null : departmentId);
  };

  const handleEditClick = (department) => {

    console.log(department);

    setFormData({
      departmentName: department.department,
      programType: department.programType || "",
      hodId: department.hod?.fullName || "",
      description: department.description || "",
    });
    setEditingDepartment(department);
    setShowDialog(true);
    setShowDropdown(null);
  };

  const programTypes = ["Diploma", "UG", "PG"];

  return (
    <div className="container mx-auto py-8 px-4">
      <Toaster />
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-900">
          Department Management
        </h1>
        <div className="flex items-center gap-3">
          <ExportButton
            data={departments.map(d => ({
              "Department": d.department,
              "Program": d.programType || "N/A",
              "HOD Name": d.hod?.fullName || "Not Assigned",
              "HOD Email": d.hod?.email || "N/A",
              "Description": d.description || ""
            }))}
            filename="Departments_List"
          />
          <button
            onClick={() => setShowDialog(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Department
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-indigo-900">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-indigo-900">
                  Program Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-indigo-900">
                  HOD
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-indigo-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No departments found. Create one to get started.
                  </td>
                </tr>
              ) : (
                departments.map((department) => (
                  <React.Fragment key={department._id}>
                    <tr className="border-b border-gray-200 hover:bg-indigo-50/50">
                      <td className="px-4 py-3 font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              toggleExpandDepartment(department._id)
                            }
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            {expandedDepartment === department._id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                          <span>{department.department}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {department.programType || "Not specified"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {department.hod ? (
                          <div>
                            <p className="font-medium">
                              {department.hod.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {department.hod.email}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not assigned</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => toggleDropdown(department._id, e)}
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {showDropdown === department._id && (
                            <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                              <div className="py-1">
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 w-full text-left"
                                  onClick={() => handleEditClick(department)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                  onClick={() =>
                                    handleDelete(
                                      department._id,
                                      department.department
                                    )
                                  }
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedDepartment === department._id && (
                      <tr className="bg-indigo-50/30">
                        <td colSpan={4} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-medium text-indigo-900 mb-2">
                                Department Details
                              </h3>
                              <div className="space-y-1 text-sm">
                                <p>
                                  <span className="font-medium">Name:</span>{" "}
                                  {department.department}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Program Type:
                                  </span>{" "}
                                  {department.programType || "Not specified"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Description:
                                  </span>{" "}
                                  {department.description || "None"}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Divisions:
                                  </span>{" "}
                                  {department.divisions?.length > 0
                                    ? department.divisions.join(", ")
                                    : "None"}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium text-indigo-900 mb-2">
                                HOD Information
                              </h3>
                              {department.hod ? (
                                <div className="space-y-1 text-sm">
                                  <p>
                                    <span className="font-medium">Name:</span>{" "}
                                    {department.hod.fullName}
                                  </p>
                                  <p>
                                    <span className="font-medium">Email:</span>{" "}
                                    {department.hod.email}
                                  </p>
                                  <p>
                                    <span className="font-medium">
                                      Teacher ID:
                                    </span>{" "}
                                    {department.hod.teacherId}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-gray-500">No HOD assigned</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Department Form Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
              <h2 className="text-2xl font-bold text-white">
                {editingDepartment
                  ? "Edit Department"
                  : "Create New Department"}
              </h2>
              <p className="text-indigo-100 mt-1">
                {editingDepartment
                  ? "Update department details"
                  : "Add a new department to the system"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.departmentName}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentName: e.target.value })
                  }
                  placeholder="e.g. Computer Science"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Program Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {programTypes.map((type) => (
                    <div key={type} className="flex items-center">
                      <input
                        id={`program-${type}`}
                        type="radio"
                        name="programType"
                        checked={formData.programType === type}
                        onChange={() =>
                          setFormData({ ...formData, programType: type })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                        required
                      />
                      <label
                        htmlFor={`program-${type}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Head of Department (HOD){" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.hodId}
                  onChange={(e) =>
                    setFormData({ ...formData, hodId: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjB2MHYwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iNiA5IDEyIDE1IDE4IDkiPjwvcG9seWxpbmU+PC9zdmc+')] bg-no-repeat bg-[center_right_1rem]"
                >
                  <option value="">Select HOD</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.fullName} ({teacher.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description about the department"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm flex items-center"
                >
                  {editingDepartment ? (
                    <>
                      <Pencil className="w-4 h-4 mr-2" />
                      Update Department
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Department
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Delete Department
              </h2>
            </div>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this department? This action
              cannot be undone and will also remove the HOD assignment.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDepartment}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
