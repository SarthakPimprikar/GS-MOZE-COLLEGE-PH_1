"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const StudentProfile = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [student, setStudent] = useState(null);
  const [editedStudent, setEditedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Check for edit=true in URL params
  useEffect(() => {
    if (searchParams.get('edit') === 'true') {
      setEditMode(true);
    }
  }, [searchParams]);

  // Fetch student attendance data
  const fetchAttendance = async () => {
    try {
      const res = await fetch(`/api/student-attendance?studentId=${student.studentId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAttendanceData(data.data || []);
        }
      }
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/students/${params.id}`);
        if (!res.ok) throw new Error(`Failed to fetch student: ${res.status}`);
        const data = await res.json();
        setStudent(data);
        setEditedStudent(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchStudent();
    }
  }, [params.id]);

  // Fetch attendance after student data is loaded
  useEffect(() => {
    if (student && student.studentId) {
      fetchAttendance();
    }
  }, [student]);

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setEditedStudent(prev => ({
        ...prev,
        address: {
          ...(prev.address || {}),
          [field]: value
        }
      }));
    } else {
      setEditedStudent(prev => ({ ...prev, [name]: value }));
    }
  };

  // Save profile changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/students/${student._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedStudent),
      });

      if (!res.ok) throw new Error('Failed to update student');

      setStudent(editedStudent);
      setEditMode(false);
      // Remove edit param from URL
      router.replace(`/admin/student-profiles/${params.id}`);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditedStudent(student);
    setEditMode(false);
    router.replace(`/admin/student-profiles/${params.id}`);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading student profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-600 mb-4">Student not found</div>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/student-profiles"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← Back to Students
          </Link>
          <div className="flex justify-between items-center mt-2">
            <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>

            {/* Edit/Save/Cancel Buttons */}
            <div className="flex items-center gap-3">
              {editMode ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
            <div className="flex items-center">
              <div className="h-20 w-20 bg-white text-black bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {(student.fullName || student.name).charAt(0).toUpperCase()}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold">{student.fullName || student.name}</h2>
                <p className="text-blue-100">{student.email}</p>
                <p className="text-blue-100 mt-1">ID: {student.studentId}</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Full Name</span>
                    {editMode ? (
                      <input
                        type="text"
                        name="fullName"
                        value={editedStudent?.fullName || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter full name"
                      />
                    ) : (
                      <p className="text-gray-900">{student.fullName || student.name}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={editedStudent?.email || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter email"
                      />
                    ) : (
                      <p className="text-gray-900">{student.email}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone</span>
                    {editMode ? (
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={editedStudent?.mobileNumber || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-gray-900">{student.mobileNumber || "Not provided"}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                    {editMode ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editedStudent?.dateOfBirth ? editedStudent.dateOfBirth.split('T')[0] : ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Student ID</span>
                    <p className="text-gray-900">{student.studentId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Program Type</span>
                    {editMode ? (
                      <input
                        type="text"
                        name="programType"
                        value={editedStudent?.programType || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter program type"
                      />
                    ) : (
                      <p className="text-gray-900">{student.programType || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Branch/Course</span>
                    {editMode ? (
                      <input
                        type="text"
                        name="branch"
                        value={editedStudent?.branch || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter branch/course"
                      />
                    ) : (
                      <p className="text-gray-900">{student.branch}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Division</span>
                    {editMode ? (
                      <select
                        name="division"
                        value={editedStudent?.division || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Division</option>
                        <option value="A">Division A</option>
                        <option value="B">Division B</option>
                        <option value="C">Division C</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{student.division || 'Not Assigned'}</p>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    {editMode ? (
                      <select
                        name="status"
                        value={editedStudent?.status || ''}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                          }`}
                      >
                        {student.status ? student.status.charAt(0).toUpperCase() + student.status.slice(1) : "N/A"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {student.address && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address</span>
                    <p className="text-gray-900">
                      {student.address.street || student.address.addressLine1 || "Not provided"}
                    </p>
                    {student.address.city && (
                      <p className="text-gray-900">{student.address.city}</p>
                    )}
                    {student.address.state && (
                      <p className="text-gray-900">{student.address.state}</p>
                    )}
                    {student.address.zipCode && (
                      <p className="text-gray-900">{student.address.zipCode}</p>
                    )}
                    {student.address.country && (
                      <p className="text-gray-900">{student.address.country}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-500">Admission Date</span>
                  <p className="text-gray-900">
                    {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : "Not provided"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Created At</span>
                  <p className="text-gray-900">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance Information */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Information</h3>
              {attendanceData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {attendanceData.map((attendance, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(attendance.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              attendance.status === 'Present' 
                                ? 'bg-green-100 text-green-800'
                                : attendance.status === 'Absent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {attendance.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attendance.subject || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {attendance.department || 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <div className="text-gray-400 mb-2">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No attendance records found</p>
                  <p className="text-sm text-gray-400 mt-1">Attendance will appear here once recorded</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;