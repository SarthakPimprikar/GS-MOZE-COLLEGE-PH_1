"use client";
import React, { useState, useEffect } from "react";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    X,
    Loader2,
    Eye,
    EyeOff,
    Image as ImageIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const BlogsPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: "",
        image: "",
        isPublished: false,
        author: "SuperAdmin",
    });

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/blogs");
            const data = await res.json();
            if (data.success) {
                setBlogs(data.data);
            } else {
                toast.error("Failed to load blogs");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading blogs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleOpenModal = (blog = null) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title,
                description: blog.description,
                content: blog.content,
                image: blog.image || "",
                isPublished: blog.isPublished,
                author: blog.author || "SuperAdmin",
            });
        } else {
            setEditingBlog(null);
            setFormData({
                title: "",
                description: "",
                content: "",
                image: "",
                isPublished: false,
                author: "SuperAdmin",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingBlog(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            return toast.error("Title and Content are required");
        }

        try {
            const url = editingBlog
                ? `/api/blogs/${editingBlog._id}`
                : "/api/blogs";
            const method = editingBlog ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(editingBlog ? "Blog updated" : "Blog created");
                fetchBlogs();
                handleCloseModal();
            } else {
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;
        try {
            const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success) {
                toast.success("Blog deleted");
                fetchBlogs();
            } else {
                toast.error("Delete failed");
            }
        } catch (error) {
            toast.error("Error deleting blog");
        }
    };

    const handleTogglePublish = async (blog) => {
        try {
            const res = await fetch(`/api/blogs/${blog._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !blog.isPublished }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(blog.isPublished ? "Blog unpublished" : "Blog published");
                fetchBlogs();
            }
        } catch (error) {
            toast.error("Error updating status");
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster />
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Blog Management</h1>
                    <p className="text-gray-500 text-sm">Create and manage content for the landing page</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Create Blog
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p>No blogs found. Create your first post!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div key={blog._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all group">
                            {blog.image ? (
                                <div className="relative h-48 w-full">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-md shadow-sm ${blog.isPublished
                                                ? "bg-green-100/90 text-green-700 border border-green-200"
                                                : "bg-yellow-100/90 text-yellow-700 border border-yellow-200"
                                            }`}>
                                            {blog.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative">
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${blog.isPublished
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {blog.isPublished ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                    <ImageIcon className="text-blue-200 w-16 h-16" />
                                </div>
                            )}

                            <div className="p-5">
                                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{blog.title}</h3>
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">{blog.description}</p>

                                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                    <div className="text-xs text-gray-400">
                                        By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleTogglePublish(blog)}
                                            className={`p-2 rounded-lg transition-colors ${blog.isPublished
                                                    ? "text-green-600 hover:bg-green-50"
                                                    : "text-yellow-600 hover:bg-yellow-50"
                                                }`}
                                            title={blog.isPublished ? "Unpublish" : "Publish"}
                                        >
                                            {blog.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(blog)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingBlog ? "Edit Blog" : "Create New Blog"}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="blogForm" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                        <textarea
                                            required
                                            rows={2}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                        <textarea
                                            required
                                            rows={8}
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Supports basic text for now.</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="https://..."
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 pt-6">
                                        <input
                                            type="checkbox"
                                            id="isPublished"
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                            checked={formData.isPublished}
                                            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                                        />
                                        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                                            Publish immediately
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="blogForm"
                                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-md shadow-blue-200"
                            >
                                {editingBlog ? "Save Changes" : "Create Blog"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogsPage;
