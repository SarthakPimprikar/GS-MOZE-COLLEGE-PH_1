"use client";
import React, { useState, useEffect } from "react";
import {
    Edit,
    X,
    Plus,
    Trash2,
    Star,
    StarHalf,
    Upload,
    Loader2,
} from "lucide-react";

export default function TestimonialsPage() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ name: "", position: "", avatar: "", rating: 5, content: "" });
    const [isAdding, setIsAdding] = useState(false);
    const [addData, setAddData] = useState({ name: "", position: "", avatar: "", rating: 5, content: "" });
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch("/api/testimonials");
            const data = await response.json();
            setTestimonials(data.testimonials);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
            setErrorMessage("Failed to load testimonials");
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                if (type === 'add') {
                    setAddData(prev => ({ ...prev, avatar: data.url }));
                } else {
                    setEditData(prev => ({ ...prev, avatar: data.url }));
                }
                setSuccessMessage("Image uploaded successfully!");
                setTimeout(() => setSuccessMessage(""), 2000);
            } else {
                setErrorMessage("Upload failed: " + data.message);
            }
        } catch (err) {
            console.error(err);
            setErrorMessage("Error uploading image");
        } finally {
            setUploading(false);
        }
    };

    const handleEditClick = (testimonial) => {
        setEditingId(testimonial._id);
        setEditData({
            name: testimonial.name,
            position: testimonial.position,
            avatar: testimonial.avatar,
            rating: testimonial.rating,
            content: testimonial.content
        });
    };

    const handleSaveEdit = async () => {
        if (!editData.name || !editData.position || !editData.content || editData.rating === undefined) {
            setErrorMessage("Important fields are required");
            return;
        }

        try {
            const response = await fetch("/api/testimonials", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingId, ...editData }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Testimonial updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                setEditingId(null);
                fetchTestimonials();
            } else {
                setErrorMessage(data.message || "Failed to update testimonial");
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
            setErrorMessage("Server error while updating");
        }
    };

    const handleAddSave = async () => {
        if (!addData.name || !addData.position || !addData.content || addData.rating === undefined) {
            setErrorMessage("Important fields are required");
            setTimeout(() => setErrorMessage(""), 3000);
            return;
        }

        try {
            const response = await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(addData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Testimonial added successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                setIsAdding(false);
                setAddData({ name: "", position: "", avatar: "", rating: 5, content: "" });
                fetchTestimonials();
            } else {
                setErrorMessage(data.message || "Failed to add testimonial");
            }
        } catch (error) {
            console.error("Error adding testimonial:", error);
            setErrorMessage("Server error while adding");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;

        try {
            const response = await fetch(`/api/testimonials?id=${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setSuccessMessage("Testimonial deleted successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
                fetchTestimonials();
            } else {
                setErrorMessage("Failed to delete testimonial");
            }
        } catch (error) {
            console.error("Error deleting testimonial:", error);
            setErrorMessage("Server error while deleting");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading testimonials...</p>
                </div>
            </div>
        );
    }

    // Helper to render stars in the card
    const renderStars = (rating) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => {
                    if (i + 1 <= Math.floor(rating)) {
                        return <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-600" strokeWidth={1.5} />;
                    }
                    if (i + 0.5 === rating) {
                        return <StarHalf key={i} className="w-4 h-4 fill-yellow-400 text-yellow-600" strokeWidth={1.5} />;
                    }
                    return <Star key={i} className="w-4 h-4 fill-white text-yellow-600" strokeWidth={1.5} />;
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen p-6 relative">
            {/* Top Controls */}
            <div className="flex justify-center mb-6">
                <div className="hidden md:block">
                    <span className="px-6 py-2 bg-blue-50/70 rounded-full text-sm font-medium text-gray-700 border border-blue-200">
                        Edit Testimonials (Changes Reflect on Landing Page)
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
                    Manage Testimonials
                </h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" /> Add New Testimonial
                </button>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add New Card Slot (Visible when adding) */}
                {isAdding && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-blue-500 scale-105 transform transition duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-800">New Testimonial</h4>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="p-1 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Name"
                                value={addData.name}
                                onChange={(e) => setAddData({ ...addData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Position (e.g. Principal)"
                                value={addData.position}
                                onChange={(e) => setAddData({ ...addData, position: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />

                            {/* File Upload Input */}
                            <div>
                                <label className="text-xs font-medium text-gray-600 block mb-1">
                                    Avatar Image {uploading && <span className="text-blue-500 ml-2 animate-pulse">Uploading...</span>}
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, 'add')}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                                {addData.avatar && (
                                    <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border">
                                            <img src={addData.avatar} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        Image selected
                                    </div>
                                )}
                            </div>


                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Rating:</span>
                                <input
                                    type="number"
                                    min="0" max="5" step="0.5"
                                    value={addData.rating}
                                    onChange={(e) => setAddData({ ...addData, rating: parseFloat(e.target.value) })}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                            </div>

                            <textarea
                                placeholder="Message..."
                                value={addData.content}
                                onChange={(e) => setAddData({ ...addData, content: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                                rows="3"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleAddSave}
                                disabled={uploading}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition shadow-sm disabled:opacity-50"
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

                {testimonials.map((item, index) => (
                    <div
                        key={item._id || index}
                        className={`relative bg-blue-50 p-6 rounded-xl transition duration-200 shadow-sm ${editingId === item._id ? 'ring-2 ring-blue-500 bg-white shadow-lg scale-[1.02] z-10' : 'hover:bg-blue-100 hover:shadow-md group'}`}
                    >
                        {/* Action Buttons (Edit/Delete) - Only show when NOT editing this specific card */}
                        {editingId !== item._id && (
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    onClick={() => handleEditClick(item)}
                                    className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md text-blue-600 hover:text-blue-700"
                                    title="Edit"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md text-red-500 hover:text-red-600"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {/* Card Content (when not editing) */}
                        {editingId !== item._id ? (
                            <div className="flex flex-col h-full">
                                <div className="mb-4">
                                    {renderStars(item.rating || 0)}
                                </div>

                                <p className="text-gray-600 text-sm italic mb-6 leading-relaxed flex-grow">
                                    "{item.content}"
                                </p>

                                <div className="flex items-center gap-3 mt-auto">
                                    <img
                                        src={item.avatar || "/avatars/default.jpg"}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-full object-cover border bg-gray-200"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(item.name) + "&background=random"; }}
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
                                        <p className="text-xs text-gray-500">{item.position}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Edit Form
                            <div className="space-y-3">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold text-gray-800 text-sm">Edit Testimonial</h4>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Position"
                                    value={editData.position}
                                    onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />

                                {/* Edit Image Upload */}
                                <div>
                                    <label className="text-xs font-medium text-gray-600 block mb-1">
                                        Update Avatar {uploading && <span className="text-blue-500 ml-1">...</span>}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border shrink-0">
                                            <img src={editData.avatar || "/avatars/default.jpg"} alt="Current" className="w-full h-full object-cover" />
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, 'edit')}
                                            className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-600">Rating:</span>
                                    <input
                                        type="number"
                                        min="0" max="5" step="0.5"
                                        value={editData.rating}
                                        onChange={(e) => setEditData({ ...editData, rating: parseFloat(e.target.value) })}
                                        className="w-16 px-1 py-1 border border-gray-300 rounded text-sm"
                                    />
                                </div>

                                <textarea
                                    value={editData.content}
                                    onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none focus:ring-1 focus:ring-blue-500 outline-none"
                                    rows="3"
                                />

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={handleSaveEdit}
                                        disabled={uploading}
                                        className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition shadow-sm disabled:opacity-50"
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
