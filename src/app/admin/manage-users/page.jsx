"use client";
import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  Download,
  Upload,
  Save,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import { roles } from "@/data/data";
import LoadingComponent from "@/components/Loading";
import toast, { Toaster } from "react-hot-toast";


const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userPerformance, setUserPerformance] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRoles, setExpandedRoles] = useState({});
  const [dynamicRoles, setDynamicRoles] = useState([]);
  const [isEditingStaff, setIsEditingStaff] = useState(false);
  const [staffDetails, setStaffDetails] = useState(null);

  const staffDepartments = [
    'HR', 'Teacher', 'HOD', 'Account', 'Library', 'IT',
    'Finance', 'Marketing', 'Operations', 'Administration',
    'Security', 'Maintenance'
  ];

  // Merge static roles with dynamic roles for display/styling
  const combinedRoles = React.useMemo(() => {
    const staticMap = new Map(roles.map(r => [r.name.toLowerCase(), r]));
    const roleMap = new Map();

    // 1. Add static roles first (as base, mostly for colors)
    // We only keep static roles that are NOT in dynamic content if we want to fallback? 
    // But to "connect" correctly, we really want to mirror the DB.
    // However, to be safe and keep UI colors, we will use static map for lookups.

    // If we have dynamic roles, we prioritize them.
    if (dynamicRoles.length > 0) {
      dynamicRoles.forEach(r => {
        const staticRole = staticMap.get(r.name.toLowerCase());
        roleMap.set(r.name.toLowerCase(), {
          id: r._id,
          name: r.name,
          color: staticRole ? staticRole.color : 'bg-gray-500', // Use static color if available
          description: r.description || staticRole?.description
        });
      });
    } else {
      // Fallback: if no dynamic roles loaded yet, maybe show static ones?
      // Or just return empty to avoid confusion. Let's return static for now to avoid empty screen flash if API is slow but we have valid static data (though risky for IDs).
      // Actually, standard practice for "connecting" is ensuring source of truth is DB.
      // Let's stick to: Use Dynamic Roles.
      dynamicRoles.forEach(r => {
        const staticRole = staticMap.get(r.name.toLowerCase());
        roleMap.set(r.name.toLowerCase(), {
          id: r._id,
          name: r.name,
          color: staticRole ? staticRole.color : 'bg-gray-500',
          description: r.description
        });
      });
    }

    // If we want to ensure we don't hold onto stale static roles, we only return what's in roleMap.
    // But we need to make sure we populate it.

    // Revised Logic:
    // We want all roles from DB.
    // We want to decorate them with colors from static file.
    return dynamicRoles.map(r => {
      const staticRole = staticMap.get(r.name.toLowerCase());
      return {
        id: r._id,
        name: r.name,
        color: staticRole ? staticRole.color : 'bg-gray-500',
        description: r.description
      };
    });
  }, [dynamicRoles]);

  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      if (data.success) {
        setDynamicRoles(data.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const toggleRoleExpansion = (role) => {
    setExpandedRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  // Group users by role
  const groupUsersByRole = (usersToGroup) => {
    const grouped = {};

    // Initialize groups for all combined roles
    combinedRoles.forEach((role) => {
      grouped[role.name.toLowerCase()] = [];
    });
    grouped["other"] = [];

    // Sort users into groups
    usersToGroup.forEach((user) => {
      if (!user) return;
      const roleKey = user.role?.toLowerCase();

      // Check if this role key exists in our combined roles
      const targetGroup = combinedRoles.find(r => r.name.toLowerCase() === roleKey);

      if (targetGroup) {
        grouped[roleKey].push(user);
      } else {
        grouped["other"].push(user);
      }
    });

    return grouped;
  };

  useEffect(() => {
    // Parallel fetch
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchRoles(), fetchAllUsers()]);
      setLoading(false);
    };
    init();
  }, []);

  // Refresh roles when modals open to ensure dropdowns are up to date
  useEffect(() => {
    if (showAddUserModal || showEditUserModal) {
      fetchRoles();
    }
  }, [showAddUserModal, showEditUserModal]);

  const fetchAllUsers = async () => {
    try {
      // Fetch regular users
      const usersRes = await fetch("/api/userData");
      if (!usersRes.ok) throw new Error("Failed to fetch users");
      const usersData = await usersRes.json();
      const regularUsers = Array.isArray(usersData)
        ? usersData
        : usersData.users || [];

      // Fetch teachers
      const teachersRes = await fetch("/api/teachers");
      if (!teachersRes.ok) throw new Error("Failed to fetch teachers");
      const teachersData = await teachersRes.json();
      const teachers = Array.isArray(teachersData)
        ? teachersData
        : teachersData.teachers || [];

      // Combine and normalize data
      const combinedUsers = [...regularUsers, ...teachers];

      setUsers(combinedUsers);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchUserPerformance = async (userId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/staff-performance/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch performance data");
      const data = await res.json();
      setUserPerformance(data);
      setShowPerformanceModal(true);
    } catch (err) {
      toast.error(err.message);
      console.error("Performance fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (user) => {
    setCurrentUser({
      ...user,
      role: user.role?.toLowerCase(),
    });

    if (user.role?.toLowerCase() === 'staff') {
      setIsEditingStaff(true);
      setLoading(true);
      try {
        const res = await fetch('/api/hr/staff');
        const data = await res.json();
        if (data.success) {
          // Find staff by email
          const staffMember = data.data.find(s => s.email === user.email);
          if (staffMember) {
            setStaffDetails(staffMember);
          } else {
            // If no staff record found, maybe initialize with user data
            setStaffDetails({
              name: user.fullName,
              email: user.email,
              staffId: "", // needs input
              department: "",
              designation: "",
              salary: "",
              contactNumber: user.phone
            });
          }
        }
      } catch (err) {
        console.error("Error fetching staff details:", err);
        toast.error("Could not fetch staff details");
      } finally {
        setLoading(false);
      }
    } else {
      setIsEditingStaff(false);
      setStaffDetails(null);
    }
    setShowEditUserModal(true);
  };

  const handleStaffUpdate = async (updatedData) => {
    try {
      const url = staffDetails._id
        ? `/api/hr/staff?id=${staffDetails._id}`
        : `/api/hr/staff`;
      const method = staffDetails._id ? 'PUT' : 'POST';

      // Ensure we send password only if it's set (StaffForm handles this empty check mostly, but double check)
      const payload = { ...updatedData };
      if (!payload.password) delete payload.password;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const response = await res.json();
      if (!response.success) {
        throw new Error(response.error || 'Failed to update staff');
      }

      toast.success("Staff updated successfully");
      setShowEditUserModal(false);
      fetchAllUsers(); // Refresh main list
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (userId, userRole) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      setLoading(true);

      const endpoint =
        userRole === "teacher" || userRole === "hod"
          ? `/api/teachers/${userId}`
          : `/api/userData/${userId}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchAllUsers();
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const name = user?.fullName || "";
    const email = user?.email || "";
    const role = user?.role?.toLowerCase() || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "all" || role === filterRole.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortBy] || "";
    const bValue = b[sortBy] || "";

    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const roleGroups = groupUsersByRole(sortedUsers);

  if (loading) {
    return <LoadingComponent />;
  }
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="p-6 text-red-600">Error: {error}</div>
      </div>
    );

  const AddUserModal = () => {
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      phone: "",
      role: "",
      roleId: "",
      password: "",
      confirmPassword: "",
      department: "",
      teacherId: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [courseOptions, setCourseOptions] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) throw new Error("Failed to fetch departments");
        const departments = await response.json();

        setCourseOptions(departments.courses);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    useEffect(() => {
      fetchDepartments();
    }, []);

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === 'role') {
        // handle role selection
        const selectedRole = dynamicRoles.find(r => r.name.toLowerCase() === value);
        setFormData(prev => ({
          ...prev,
          role: value,
          roleId: selectedRole ? selectedRole._id : ""
        }));
        setErrors((prev) => ({ ...prev, role: "" }));
        return;
      }

      // Clear any existing error for this field
      setErrors((prev) => ({ ...prev, [name]: "" }));

      // Special handling for password (no spaces allowed)
      if (name === "password" || name === "confirmPassword") {
        const noSpaceValue = value.replace(/\s/g, "");
        setFormData((prev) => ({
          ...prev,
          [name]: noSpaceValue,
        }));
        return;
      }

      // Special validation for fullName (only letters and spaces)
      if (name === "fullName" && value && !/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only alphabetic characters are allowed",
        }));
        return;
      }
      // Special validation for Department (only letters and spaces)
      if (name === "department" && value && !/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only alphabetic characters are allowed",
        }));
        return;
      }

      // Special handling for phone (only numbers, max 10 digits)
      if (name === "phone") {
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

      // Full name validation
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
        newErrors.fullName = "Name should contain only letters";
      }

      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      // Phone validation
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be 10 digits";
      }

      // Role validation
      if (!formData.role) {
        newErrors.role = "Role is required";
      }

      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (/\s/.test(formData.password)) {
        newErrors.password = "Password cannot contain spaces";
      }

      // Teacher/HOD-specific validation
      if (
        formData.role.toLowerCase() === "teacher" ||
        formData.role.toLowerCase() === "hod"
      ) {
        if (!formData.teacherId.trim()) {
          newErrors.teacherId = "Teacher ID is required";
        }
        if (
          formData.role.toLowerCase() === "teacher" &&
          !formData.department.trim()
        ) {
          newErrors.department = "Department is required";
        }
      }

      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        const requestData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          role: formData.role.toLowerCase(),
          roleId: formData.roleId,
        };

        // Add teacher/HOD-specific fields
        if (
          formData.role.toLowerCase() === "teacher" ||
          formData.role.toLowerCase() === "hod"
        ) {
          requestData.teacherId = formData.teacherId;
          if (formData.role.toLowerCase() === "teacher") {
            requestData.department = formData.department;
          }
        }
        console.log("Submitting Add User Payload:", requestData); // DEBUG

        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Registration failed");
        }

        toast.success("User registered successfully!");
        setShowAddUserModal(false);
        fetchAllUsers();
      } catch (err) {
        toast.error(err.message);
        console.error("Registration error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Toaster />
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Add New User</h2>
            <button
              onClick={() => setShowAddUserModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  maxLength={25}
                  className={`w-full px-3 py-2 border ${errors.fullName ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.role ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                >
                  <option value="">Select Role</option>
                  {dynamicRoles.map((role) => (
                    <option key={role._id} value={role.name.toLowerCase()}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>
            </div>

            {(formData.role.toLowerCase() === "teacher" ||
              formData.role.toLowerCase() === "hod") && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {formData.role.toLowerCase() === "teacher" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      {!loadingCourses ? (
                        <select
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required
                          className={
                            "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none bg-gray-100"
                          }
                        >
                          <option value="">{"Select a Department"}</option>
                          {courseOptions.map((course, index) => (
                            <option key={`course-${index}`} value={course.name}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 animate-pulse">
                          Loading courses...
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher ID *
                    </label>
                    <input
                      type="text"
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.teacherId ? "border-red-500" : "border-gray-200"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                      placeholder="Enter teacher ID like T-123"
                    />
                    {errors.teacherId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.teacherId}
                      </p>
                    )}
                  </div>
                </div>
              )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.phone ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter phone number"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Confirm password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
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
                    <span>Add User</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  const EditUserModal = () => {
    const [formData, setFormData] = useState({
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      role: currentUser?.role || "",
      roleId: currentUser?.roleId || "",
      department: currentUser?.department || "",
      teacherId: currentUser?.teacherId || "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courseOptions, setCourseOptions] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/courses");
        if (!response.ok) throw new Error("Failed to fetch departments");
        const departments = await response.json();

        setCourseOptions(departments.courses);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoadingCourses(false);
      }
    };

    useEffect(() => {
      fetchDepartments();
    }, []);

    // Auto-populate roleId if missing but role name matches a dynamic role (Fix for legacy users)
    useEffect(() => {
      if (formData.role && !formData.roleId && dynamicRoles.length > 0) {
        const matchingRole = dynamicRoles.find(r => r.name.toLowerCase() === formData.role.toLowerCase());
        if (matchingRole) {
          console.log("Auto-populating missing roleId for:", formData.role, "->", matchingRole._id);
          setFormData(prev => ({ ...prev, roleId: matchingRole._id }));
        }
      }
    }, [formData.role, dynamicRoles, formData.roleId]);

    const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === 'role') {
        // handle role selection
        console.log("Looking for role:", value);
        console.log("Available Dynamic Roles:", dynamicRoles);
        const selectedRole = dynamicRoles.find(r => r.name.toLowerCase() === value);
        console.log("Found Role Object:", selectedRole);

        setFormData(prev => ({
          ...prev,
          role: value,
          roleId: selectedRole ? selectedRole._id : ""
        }));
        setErrors((prev) => ({ ...prev, role: "" }));
        return;
      }

      // Clear any existing error for this field
      setErrors((prev) => ({ ...prev, [name]: "" }));

      // Special validation for fullName (only letters and spaces)
      if (name === "fullName" && value && !/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only alphabetic characters are allowed",
        }));
        return;
      }

      // Special validation for department (only letters and spaces)
      if (name === "department" && value && !/^[a-zA-Z\s]*$/.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Only alphabetic characters are allowed",
        }));
        return;
      }

      // Special handling for phone (only numbers, max 10 digits)
      if (name === "phone") {
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

      // Full name validation
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
        newErrors.fullName = "Name should contain only letters";
      }

      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }

      // Phone validation
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone is required";
      } else if (!/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = "Phone must be 10 digits";
      }

      // Role validation
      if (!formData.role) {
        newErrors.role = "Role is required";
      }

      // Teacher/HOD-specific validation
      if (
        formData.role.toLowerCase() === "teacher" ||
        formData.role.toLowerCase() === "hod"
      ) {
        if (!formData.teacherId.trim()) {
          newErrors.teacherId = "Teacher ID is required";
        }
        if (
          formData.role.toLowerCase() === "teacher" &&
          !formData.department.trim()
        ) {
          newErrors.department = "Department is required";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsSubmitting(true);

      try {
        const requestData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role.toLowerCase(),
          roleId: formData.roleId,
        };

        // Add teacher-specific fields if role is teacher
        if (formData.role.toLowerCase() === "teacher") {
          requestData.department = formData.department;
          requestData.teacherId = formData.teacherId;
        }
        // Add hod-specific fields if role is hod
        if (formData.role.toLowerCase() === "hod") {
          requestData.department = formData.department;
          requestData.teacherId = formData.teacherId;
        }

        // Determine the endpoint based on current user role
        const endpoint =
          currentUser.role.toLowerCase() === "teacher" ||
            currentUser.role.toLowerCase() === "hod"
            ? `/api/teachers/${currentUser._id}`
            : `/api/userData/${currentUser._id}`;

        const res = await fetch(endpoint, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Update failed");
        }

        toast.success("User updated successfully");
        setShowEditUserModal(false);
        fetchAllUsers();
      } catch (err) {
        toast.error(err.message);
        console.error("Update error:", err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Toaster />
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Edit User</h2>
            <button
              onClick={() => setShowEditUserModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  maxLength={25}
                  className={`w-full px-3 py-2 border ${errors.fullName ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.role ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                >
                  <option value="">Select Role</option>
                  {dynamicRoles.map((role) => (
                    <option key={role._id} value={role.name.toLowerCase()}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>
            </div>

            {(formData.role.toLowerCase() === "teacher" ||
              formData.role.toLowerCase() === "hod") && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {formData.role.toLowerCase() === "teacher" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      {!loadingCourses ? (
                        <select
                          id="department"
                          name="department"
                          value={formData.department}
                          onChange={handleChange}
                          required
                          className={
                            "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition appearance-none bg-gray-100"
                          }
                        >
                          <option value="">{"Select a Department"}</option>
                          {courseOptions.map((course, index) => (
                            <option key={`course-${index}`} value={course.name}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 animate-pulse">
                          Loading courses...
                        </div>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teacher ID *
                    </label>
                    <input
                      type="text"
                      name="teacherId"
                      value={formData.teacherId}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border ${errors.teacherId ? "border-red-500" : "border-gray-200"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                      placeholder="Enter teacher ID like T-123"
                    />
                    {errors.teacherId && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.teacherId}
                      </p>
                    )}
                  </div>
                </div>
              )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.phone ? "border-red-500" : "border-gray-200"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
                  placeholder="Enter phone number"
                  maxLength={10}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditUserModal(false)}
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
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const PerformanceModal = () => {
    if (!userPerformance) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Performance Overview</h2>
            <button
              onClick={() => setShowPerformanceModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userPerformance.attendanceRate}%
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Tasks Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {userPerformance.tasksCompleted}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-purple-600">
                  {userPerformance.avgRating}/5
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Active Days</p>
                <p className="text-2xl font-bold text-orange-600">
                  {userPerformance.activeDays}
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {userPerformance.recentActivity?.map((activity, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${activity.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 text-sm">
            Manage your organization members and their roles
          </p>
        </div>
        <div className="flex gap-3">
          <ExportButton
            data={users.map(u => ({
              Name: u.fullName,
              Email: u.email,
              Role: u.role,
              Phone: u.phone,
              Status: u.status || "Active"
            }))}
            filename="User_List"
          />
          <button
            onClick={() => setShowAddUserModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm shadow-blue-200"
          >
            <UserPlus size={20} />
            Add User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <select
                className="pl-10 pr-8 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                {dynamicRoles.map(r => (
                  <option key={r._id} value={r.name.toLowerCase()}>{r.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            <select
              className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="role">Sort by Role</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {Object.entries(roleGroups).map(([role, usersInRole]) => {
          // Find the role definition for display (color/name)
          const roleDef = combinedRoles.find(r => r.name.toLowerCase() === role) || { name: role, color: 'bg-gray-500' };

          // Hide roles with no users unless it's a dynamic role we might want to show empty?
          // Existing logic seemed to show all. 
          // Let's show if it has users or if it matches dynamic roles?
          if (usersInRole.length === 0) return null;

          const isExpanded = expandedRoles[role] ?? true;

          return (
            <div
              key={role}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div
                className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleRoleExpansion(role)}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${roleDef.color || 'bg-gray-500'
                      }`}
                  >
                    {roleDef.name.toUpperCase()}
                  </span>
                  <h3 className="font-semibold text-gray-700">
                    {roleDef.name} Users
                  </h3>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    {usersInRole.length}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="text-gray-400" size={20} />
                ) : (
                  <ChevronDown className="text-gray-400" size={20} />
                )}
              </div>

              {isExpanded && (
                <div className="divide-y divide-gray-100">
                  {usersInRole.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                          {user.fullName?.charAt(0) || user.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.fullName || user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {user.email} • {user.phone}
                          </p>
                        </div>
                      </div>

                      {/* Permissions Preview (based on Dynamic Role) */}
                      {user.roleId?.permissions && (
                        <div className="hidden md:flex gap-1">
                          {user.roleId.permissions.slice(0, 2).map((p, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                              {p}
                            </span>
                          ))}
                          {user.roleId.permissions.length > 2 && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">
                              +{user.roleId.permissions.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => fetchUserPerformance(user._id)}
                          className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Performance"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.role.toLowerCase())}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      {showAddUserModal && <AddUserModal />}
      {showEditUserModal && <EditUserModal />}
      {showPerformanceModal && <PerformanceModal />}
    </div>
  );
};

export default UserManagementPage;
