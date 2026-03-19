"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Shield,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    Loader2,
    AlertCircle
} from "lucide-react";
import ExportButton from "@/components/ExportButton";
import toast, { Toaster } from "react-hot-toast";
import { adminSidebarItems } from "@/data/data";
import { useSession } from "@/context/SessionContext";

// Module definitions for permissions
const PERMISSION_MODULES = [
    {
        name: "Users",
        key: "user",
        actions: [
            { label: "View Users", value: "view" },
            { label: "Create Users", value: "create" },
            { label: "Update Users", value: "update" },
            { label: "Delete Users", value: "delete" },
        ],
    },
    {
        name: "Roles & Permissions",
        key: "role",
        actions: [
            { label: "Manage Roles", value: "manage" },
        ],
    },
    {
        name: "Finance",
        key: "finance",
        actions: [
            { label: "View Invoices", value: "view_invoices" },
            { label: "Create Invoices", value: "create_invoices" },
            { label: "Approve Invoices", value: "approve_invoices" },
        ],
    },
    {
        name: "Reports",
        key: "report",
        actions: [
            { label: "View Reports", value: "view" },
            { label: "Export Reports", value: "export" },
        ],
    },
    {
        name: "Sidebar Navigation",
        key: "sidebar",
        actions: adminSidebarItems.map((item) => ({
            label: item.label,
            value: item.id,
        })),
    },
];

// Memoized Role Card Component for better performance
const RoleCard = React.memo(({ role, index, onEdit, onDelete }) => {
    const solidColors = [
        'bg-blue-600',
        'bg-purple-600',
        'bg-green-600',
        'bg-orange-600',
        'bg-cyan-600',
        'bg-indigo-600'
    ];
    const iconBgColors = [
        'bg-blue-100 text-blue-600',
        'bg-purple-100 text-purple-600',
        'bg-green-100 text-green-600',
        'bg-orange-100 text-orange-600',
        'bg-cyan-100 text-cyan-600',
        'bg-indigo-100 text-indigo-600'
    ];
    const solidColor = solidColors[index % solidColors.length];
    const iconBgClass = iconBgColors[index % iconBgColors.length];

    // Memoize permission filtering to avoid recalculation on every render
    const validPermissions = useMemo(() => {
        return role.permissions.filter(p => {
            if (!p.startsWith('sidebar.')) return false;
            const id = p.split('sidebar.')[1];
            return adminSidebarItems.some(item => item.id === id);
        });
    }, [role.permissions]);

    const permissionCount = useMemo(() => new Set(validPermissions).size, [validPermissions]);
    const displayPermissions = useMemo(() => validPermissions.slice(0, 5), [validPermissions]);
    const hasMore = validPermissions.length > 5;

    return (
        <div
            key={role._id}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
            <div className={`${solidColor} h-2`}></div>

            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-4 flex-1">
                        <div className={`p-3 rounded-xl ${iconBgClass} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                            <Shield size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate">{role.name}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                Created {new Date(role.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(role)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(role._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-5 min-h-[40px] line-clamp-2">
                    {role.description || "No description provided."}
                </p>

                <div className="border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Permissions
                        </p>
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
                            {permissionCount}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {displayPermissions.map((perm, idx) => {
                            const itemId = perm.split('sidebar.')[1];
                            const itemLabel = adminSidebarItems.find(i => i.id === itemId)?.label || itemId;
                            return (
                                <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-200 font-medium hover:bg-blue-100 hover:shadow-sm transition-all">
                                    {itemLabel}
                                </span>
                            );
                        })}
                        {hasMore && (
                            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-lg font-semibold border border-blue-200">
                                +{validPermissions.length - 5} more
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

RoleCard.displayName = 'RoleCard';

export default function RolesPage() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const { refreshSession } = useSession();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        permissions: [],
    });

    const fetchRoles = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/roles");
            const data = await res.json();
            if (data.success) {
                setRoles(data.data);
            } else {
                toast.error(data.message || "Failed to fetch roles");
            }
        } catch (error) {
            toast.error("Error fetching roles");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleOpenModal = useCallback((role = null) => {
        if (role) {
            setEditingRole(role);

            // Strictly sanitize permissions on open
            // 1. Filter out invalid sidebar items (ghosts)
            // 2. Remove duplicates
            const rawPermissions = role.permissions || [];
            const sanitizedPermissions = rawPermissions.filter(p => {
                if (p.startsWith('sidebar.')) {
                    const id = p.split('sidebar.')[1];
                    return adminSidebarItems.some(item => item.id === id);
                }
                return true;
            });
            const uniquePermissions = [...new Set(sanitizedPermissions)];

            setFormData({
                name: role.name,
                description: role.description || "",
                permissions: uniquePermissions,
            });
        } else {
            setEditingRole(null);
            setFormData({
                name: "",
                description: "",
                permissions: [],
            });
        }
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRole(null);
    };

    const handlePermissionChange = (moduleKey, actionValue) => {
        const permission = `${moduleKey}.${actionValue}`;
        setFormData((prev) => {
            const exists = prev.permissions.includes(permission);
            let newPermissions;
            if (exists) {
                newPermissions = prev.permissions.filter((p) => p !== permission);
            } else {
                newPermissions = [...prev.permissions, permission];
            }
            return { ...prev, permissions: newPermissions };
        });
    };

    const handleToggleModule = (moduleKey, allActions) => {
        const allModulePermissions = allActions.map(a => `${moduleKey}.${a.value}`);
        const currentModulePermissions = formData.permissions.filter(p => p.startsWith(`${moduleKey}.`));

        const isAllSelected = currentModulePermissions.length === allActions.length;

        setFormData(prev => {
            let newPermissions = [...prev.permissions];
            if (isAllSelected) {
                // Deselect all
                newPermissions = newPermissions.filter(p => !p.startsWith(`${moduleKey}.`));
            } else {
                // Select all (add missing ones)
                allModulePermissions.forEach(p => {
                    if (!newPermissions.includes(p)) newPermissions.push(p);
                });
            }
            return { ...prev, permissions: newPermissions };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error("Role Name is required");

        try {
            const url = editingRole
                ? `/api/admin/roles/${editingRole._id}`
                : "/api/admin/roles";
            const method = editingRole ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingRole ? "Role updated!" : "Role created!");
                refreshSession(); // Refresh session to update sidebar immediately
                fetchRoles();
                handleCloseModal();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handleDelete = useCallback(async (id) => {
        if (!confirm("Are you sure you want to delete this role?")) return;
        try {
            const res = await fetch(`/api/admin/roles/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                toast.success("Role deleted");
                fetchRoles();
            } else {
                toast.error(data.message || "Delete failed");
            }
        } catch (error) {
            toast.error("Error deleting role");
        }
    }, [fetchRoles]);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>
                    <p className="text-gray-500 text-sm">Manage user roles and access control</p>
                </div>
                <div className="flex gap-3">
                    <ExportButton
                        data={roles.map(r => ({
                            Name: r.name,
                            Description: r.description,
                            PermissionCount: r.permissions?.length || 0,
                            CreatedDate: new Date(r.createdAt).toLocaleDateString()
                        }))}
                        filename="Roles_List"
                    />
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                    >
                        <Plus size={20} />
                        Create Role
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role, index) => (
                        <RoleCard
                            key={role._id}
                            role={role}
                            index={index}
                            onEdit={handleOpenModal}
                            onDelete={handleDelete}
                        />
                    ))}

                    {
                        roles.length === 0 && (
                            <div className="col-span-full flex flex-col items-center justify-center p-12 text-gray-400">
                                <Shield size={48} className="mb-4 opacity-20" />
                                <p>No roles found. Create a new role to get started.</p>
                            </div>
                        )
                    }
                </div >
            )}

            {/* Role Manager Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {editingRole ? "Edit Role" : "Create New Role"}
                                    </h2>
                                    <p className="text-sm text-gray-500">Define role details and assignment permissions</p>
                                </div>
                                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                <form id="roleForm" onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                                placeholder="e.g. Finance Manager"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <input
                                                type="text"
                                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                                placeholder="e.g. Can manage all financial records"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                                Permissions Configuration
                                                <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs normal-case">
                                                    {/* Calculate total valid permissions selected */}
                                                    <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs normal-case">
                                                        {/* Calculate total valid permissions selected by iterating modules */}
                                                        {/* This ensures we only count what is visible in the UI */}
                                                        {PERMISSION_MODULES.reduce((total, module) => {
                                                            const moduleCount = module.actions.filter(a =>
                                                                formData.permissions.includes(`${module.key}.${a.value}`)
                                                            ).length;
                                                            return total + moduleCount;
                                                        }, 0)} selected
                                                    </span>
                                                </span>
                                            </h3>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            {PERMISSION_MODULES.filter(m => m.key === 'sidebar').map((module) => {
                                                const modulePermissions = module.actions.map(a => `${module.key}.${a.value}`);

                                                // Calculate count by checking which valid actions are actually selected
                                                // This prevents counting "ghost" permissions that don't match actions
                                                const selectedCount = module.actions.filter(a =>
                                                    formData.permissions.includes(`${module.key}.${a.value}`)
                                                ).length;

                                                const isAllSelected = selectedCount === module.actions.length;

                                                return (
                                                    <div key={module.key} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                                        <div className="bg-gray-50/80 px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-gray-800">{module.name}</span>
                                                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                                                                    {selectedCount} / {module.actions.length}
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleToggleModule(module.key, module.actions)}
                                                                className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${isAllSelected
                                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                                                    }`}
                                                            >
                                                                {isAllSelected ? "Deselect All" : "Select All"}
                                                            </button>
                                                        </div>
                                                        <div className="p-5 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {module.actions.map((action) => {
                                                                const permString = `${module.key}.${action.value}`;
                                                                const isChecked = formData.permissions.includes(permString);

                                                                return (
                                                                    <label
                                                                        key={action.value}
                                                                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${isChecked
                                                                            ? 'bg-blue-50/50 border-blue-200 shadow-sm'
                                                                            : 'border-gray-100 hover:bg-gray-50'
                                                                            }`}
                                                                    >
                                                                        <div className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all mr-3 ${isChecked
                                                                            ? 'bg-blue-600 border-blue-600'
                                                                            : 'border-gray-300 bg-white'
                                                                            }`}>
                                                                            {isChecked && <Check size={12} className="text-white" />}
                                                                        </div>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="hidden"
                                                                            checked={isChecked}
                                                                            onChange={() => handlePermissionChange(module.key, action.value)}
                                                                        />
                                                                        <span className={`text-sm select-none ${isChecked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                                                            {action.label}
                                                                        </span>
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="roleForm"
                                    className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md shadow-blue-200 transition-all"
                                >
                                    {editingRole ? "Save Changes" : "Create Role"}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
