'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Users, Phone, ChevronDown, ChevronUp, X, Save } from 'lucide-react';

// Color palette for departments
const colorPalette = [
  'red', 'green', 'blue', 'purple', 'yellow', 'pink',
  'indigo', 'orange', 'teal', 'cyan', 'lime', 'amber',
  'emerald', 'violet', 'rose', 'fuchsia', 'sky', 'slate'
];

// Function to get color class for department
const getDepartmentColor = (department) => {
  const index = department.toLowerCase().charCodeAt(0) % colorPalette.length;
  const color = colorPalette[index];

  switch (color) {
    case 'red': return 'bg-red-100 text-red-800';
    case 'green': return 'bg-green-100 text-green-800';
    case 'blue': return 'bg-blue-100 text-blue-800';
    case 'purple': return 'bg-purple-100 text-purple-800';
    case 'yellow': return 'bg-yellow-100 text-yellow-800';
    case 'pink': return 'bg-pink-100 text-pink-800';
    case 'indigo': return 'bg-indigo-100 text-indigo-800';
    case 'orange': return 'bg-orange-100 text-orange-800';
    case 'teal': return 'bg-teal-100 text-teal-800';
    case 'cyan': return 'bg-cyan-100 text-cyan-800';
    case 'lime': return 'bg-lime-100 text-lime-800';
    case 'amber': return 'bg-amber-100 text-amber-800';
    case 'emerald': return 'bg-emerald-100 text-emerald-800';
    case 'violet': return 'bg-violet-100 text-violet-800';
    case 'rose': return 'bg-rose-100 text-rose-800';
    case 'fuchsia': return 'bg-fuchsia-100 text-fuchsia-800';
    case 'sky': return 'bg-sky-100 text-sky-800';
    case 'slate': return 'bg-slate-100 text-slate-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function StaffManagement() {
  const [activeTab, setActiveTab] = useState("staff");
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState(null);
  const [expandedDepartments, setExpandedDepartments] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    email: '',
    department: '',
    designation: '',
    salary: '',
    contactNumber: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleDepartmentExpansion = (department) => {
    setExpandedDepartments((prev) => ({
      ...prev,
      [department]: !prev[department],
    }));
  };

  // Group staff by department
  const groupStaffByDepartment = (staffToGroup) => {
    const grouped = {};

    // Get all unique departments from actual data
    const uniqueDepartments = [...new Set(staffToGroup.map(person => person.department).filter(Boolean))];

    // Initialize groups for all departments found in data
    uniqueDepartments.forEach((dept) => {
      grouped[dept.toLowerCase()] = [];
    });

    // Add "other" for any staff without department
    grouped["other"] = [];

    // Sort staff into groups
    staffToGroup.forEach((person) => {
      const deptKey = person.department ? person.department.toLowerCase() : 'other';
      if (grouped[deptKey]) {
        grouped[deptKey].push(person);
      } else {
        grouped["other"].push(person);
      }
    });

    return grouped;
  };

  // Fetch all staff
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/hr/staff');
        const data = await res.json();

        if (data?.success) {
          setStaff(data?.data || []);
          setFilteredStaff(data?.data || []);
        } else {
          setError(data.error || 'Failed to fetch staff');
        }
      } catch (error) {
        setError('Error fetching staff: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // Get unique departments from staff data
  const getUniqueDepartments = () => {
    const uniqueDepts = [...new Set(staff.map(person => person.department).filter(Boolean))];
    return uniqueDepts.sort();
  };

  // Filter and search functionality
  const filteredAndSortedStaff = staff.filter((person) => {
    const name = person?.name || "";
    const email = person?.email || "";
    const staffId = person?.staffId || "";
    const department = person?.department?.toLowerCase() || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "all" || department === filterDepartment.toLowerCase();

    return matchesSearch && matchesDepartment;
  }).sort((a, b) => {
    const aValue = a[sortBy] || "";
    const bValue = b[sortBy] || "";

    if (sortOrder === "asc") {
      return aValue.toString().localeCompare(bValue.toString());
    } else {
      return bValue.toString().localeCompare(aValue.toString());
    }
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Clear any existing error for this field
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // Special handling for password (no spaces allowed)
    if (name === "password") {
      const noSpaceValue = value.replace(/\s/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: noSpaceValue,
      }));
      return;
    }

    // Special validation for name (only letters and spaces)
    if (name === "name" && value && !/^[a-zA-Z\s]*$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Only alphabetic characters are allowed",
      }));
      return;
    }

    // Special handling for phone (only numbers, max 10 digits)
    if (name === "contactNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    // Handle all other fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = "Name should contain only letters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Staff ID validation
    if (!formData.staffId.trim()) {
      newErrors.staffId = "Staff ID is required";
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    // Designation validation
    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }

    // Phone validation
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }

    // Teacher/HOD-specific validation
    if (formData.department === "Teacher" || formData.department === "HOD") {
      if (!formData.password && !currentStaff) {
        newErrors.password = "Password is required";
      } else if (formData.password && formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (formData.password && /\s/.test(formData.password)) {
        newErrors.password = "Password cannot contain spaces";
      }
    } else {
      // Non-teaching staff salary validation
      if (!formData.salary) {
        newErrors.salary = "Salary is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create or Update staff
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const url = currentStaff
      ? `/api/hr/staff?id=${currentStaff._id}`
      : `/api/hr/staff`;
    const method = currentStaff ? 'PUT' : 'POST';

    const apiData = {
      staffId: formData.staffId,
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber || null,
      department: formData.department,
      designation: formData.designation,
      salary: formData.salary ? parseFloat(formData.salary) : null,
      password: formData.password || undefined,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      });
      const response = await res.json();

      if (!response.success) {
        throw new Error(response.error || 'Failed to save staff');
      }

      const newStaff = response.data;
      if (currentStaff) {
        setStaff(staff.map((s) => (s._id === newStaff._id ? newStaff : s)));
      } else {
        setStaff([...staff, newStaff]);
      }

      setIsModalOpen(false);
      setShowEditModal(false);
      resetForm();
      setError(null);
    } catch (error) {
      setError('Error saving staff: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete staff
  const handleDelete = async (staffId) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/hr/staff/${staffId}`, { method: 'DELETE' });
      const response = await res.json();

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete staff');
      }

      setStaff(staff.filter(s => s._id !== staffId));
    } catch (error) {
      setError('Error deleting staff: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Open modal for editing
  const handleEdit = (staffMember) => {
    setCurrentStaff(staffMember);
    setFormData({
      staffId: staffMember.staffId || '',
      name: staffMember.name || '',
      email: staffMember.email || '',
      department: staffMember.department || '',
      designation: staffMember.designation || '',
      salary: staffMember.salary || '',
      contactNumber: staffMember.contactNumber || staffMember.phone || '',
      password: '', // Password not retrieved for security
    });
    setShowEditModal(true);
  };

  // Reset form for new staff
  const resetForm = () => {
    setCurrentStaff(null);
    setFormData({
      staffId: '',
      name: '',
      email: '',
      department: '',
      designation: '',
      salary: '',
      contactNumber: '',
      password: '',
    });
    setErrors({});
  };

  const handleAddNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const departmentGroups = groupStaffByDepartment(filteredAndSortedStaff);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center py-8">Loading staff data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );
  }

  const AddStaffModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Add New Staff Member</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID *</label>
              <input
                type="text"
                name="staffId"
                value={formData.staffId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.staffId ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter staff ID"
              />
              {errors.staffId && (
                <p className="mt-1 text-sm text-red-600">{errors.staffId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                maxLength={25}
                className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.contactNumber ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter contact number"
                maxLength={10}
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.department ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              >
                <option value="">Select Department</option>
                {departments.slice(0, -1).map((dept) => (
                  <option key={dept.name} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.designation ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter designation"
              />
              {errors.designation && (
                <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {(formData.department !== "Teacher" && formData.department !== "HOD") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary *</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.salary ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter salary"
                />
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
                )}
              </div>
            )}
            {(formData.department === "Teacher" || formData.department === "HOD") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Add Staff</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const EditStaffModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Edit Staff Member</h2>
          <button
            onClick={() => setShowEditModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID *</label>
              <input
                type="text"
                name="staffId"
                value={formData.staffId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.staffId ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter staff ID"
              />
              {errors.staffId && (
                <p className="mt-1 text-sm text-red-600">{errors.staffId}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.name ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                maxLength={10}
                minLength={10}
                className={`w-full px-3 py-2 border ${errors.contactNumber ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter contact number"
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                disabled
                className={`w-full px-3 py-2 border ${errors.department ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-100`}
              >
                <option value="">Select Department</option>
                <option value="HR">HR</option>
                <option value="Teacher">Teacher</option>
                <option value="HOD">HOD</option>
                <option value="Account">Account</option>
                <option value="Library">Library</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Operations">Operations</option>
                <option value="Administration">Administration</option>
                <option value="Security">Security</option>
                <option value="Maintenance">Maintenance</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${errors.designation ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter designation"
              />
              {errors.designation && (
                <p className="mt-1 text-sm text-red-600">{errors.designation}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {(formData.department !== "Teacher" && formData.department !== "HOD") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary *</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.salary ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter salary"
                />
                {errors.salary && (
                  <p className="mt-1 text-sm text-red-600">{errors.salary}</p>
                )}
              </div>
            )}
            {(formData.department === "Teacher" || formData.department === "HOD") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Leave empty to keep current password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? (
                <span>Updating...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Staff</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === "staff"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              <Users className="w-4 h-4" />
              <span>Staff</span>
              <span className="ml-1 bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                {staff.length}
              </span>
            </button>
          </div>

          <div className="p-6">
            {activeTab === "staff" && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search staff..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm transition-all duration-200"
                      />
                    </div>

                    <div className="relative">
                      <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="appearance-none pl-3 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-48 transition-all duration-200"
                      >
                        <option value="all">All Departments</option>
                        {getUniqueDepartments().map((dept) => (
                          <option key={dept} value={dept.toLowerCase()}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    onClick={handleAddNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md w-full sm:w-auto justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Staff</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {Object.entries(departmentGroups).map(([department, staffInDept]) => {
                    if (staffInDept.length === 0) return null;

                    const isExpanded = expandedDepartments[department] !== false;
                    const departmentName = department === 'other' ? 'Other' :
                      department.charAt(0).toUpperCase() + department.slice(1);
                    const colorClass = getDepartmentColor(department);

                    return (
                      <div
                        key={department}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                      >
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleDepartmentExpansion(department)}
                        >
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mr-3 ${colorClass}`}
                            >
                              {departmentName}
                            </span>
                            <span className="text-sm text-gray-500">
                              {staffInDept.length}{" "}
                              {staffInDept.length === 1 ? "member" : "members"}
                            </span>
                          </div>
                          <div className="text-gray-400">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-gray-100">
                            <div className="overflow-x-auto">
                              <table className="w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Staff Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Position
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                  {staffInDept.map((person) => (
                                    <tr
                                      key={person._id}
                                      className="hover:bg-gray-50 transition-colors"
                                    >
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                            {getInitials(person.name)}
                                          </div>
                                          <div className="ml-4">
                                            <div className="text-sm font-semibold text-gray-900">
                                              {person.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {person.staffId}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {person.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                          <Phone className="w-4 h-4 text-gray-400" />
                                          {person.contactNumber || person.phone || "N/A"}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                          {person.designation}
                                        </div>
                                        {person.salary && (
                                          <div className="text-sm text-gray-500">
                                            ₹{Number(person.salary).toLocaleString()}
                                          </div>
                                        )}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                          <button
                                            onClick={() => handleEdit(person)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                                            title="Edit"
                                          >
                                            <Edit className="w-4 h-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDelete(person._id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                            title="Delete"
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
                      </div>
                    );
                  })}
                </div>

                {filteredAndSortedStaff.length === 0 && (
                  <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <Users className="w-8 h-8" />
                      <p className="text-sm font-medium">No staff found</p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-blue-600 text-xs hover:underline mt-2"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && <AddStaffModal />}
      {showEditModal && <EditStaffModal />}
    </div>
  );
}