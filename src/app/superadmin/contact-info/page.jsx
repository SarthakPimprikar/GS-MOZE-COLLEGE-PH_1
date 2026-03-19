"use client";
import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Save, Link as LinkIcon } from "lucide-react";

export default function ContactInfoPage() {
    const [formData, setFormData] = useState({
        email: "",
        phone1: "",
        phone2: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        businessHours: "",
        googleMapUrl: "",
    });

    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const response = await fetch("/api/contact_info");
            const data = await response.json();
            if (data.contactInfo) {
                setFormData(data.contactInfo);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching contact info:", error);
            setErrorMessage("Failed to load contact info");
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/contact_info", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                setSuccessMessage("Contact info updated successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                setErrorMessage(data.message || "Failed to update contact info");
            }
        } catch (error) {
            console.error("Error updating contact info:", error);
            setErrorMessage("Server error while updating");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !formData.email) {
        return (
            <div className="min-h-screen p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading contact information...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            {/* Messages */}
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

            {/* Main Container */}
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Edit Contact Information</h2>
                    <p className="text-blue-100">Update the contact details displayed on the landing page.</p>
                </div>

                {/* Form Body */}
                <div className="p-8 space-y-8">
                    {/* Section: Email & Phone */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                            <Phone className="w-5 h-5 text-blue-600" /> Contact Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400"><Mail className="w-4 h-4" /></span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Hours</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400"><Clock className="w-4 h-4" /></span>
                                    <input
                                        type="text"
                                        name="businessHours"
                                        value={formData.businessHours}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 1 (Primary)</label>
                                <input
                                    type="text"
                                    name="phone1"
                                    value={formData.phone1}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 2 (Optional)</label>
                                <input
                                    type="text"
                                    name="phone2"
                                    value={formData.phone2}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section: Address */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-600" /> Address Location
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                <input
                                    type="text"
                                    name="addressLine1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    placeholder="e.g. Office Number 101, Nirman Ajinkatara"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                                <input
                                    type="text"
                                    name="addressLine2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    placeholder="e.g. Adjacent to Sinhagad Science College"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 3 (City/Zip)</label>
                                <input
                                    type="text"
                                    name="addressLine3"
                                    value={formData.addressLine3}
                                    onChange={handleChange}
                                    placeholder="e.g. Vadgaon, Pune - 411041"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section: Map */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                            <LinkIcon className="w-5 h-5 text-blue-600" /> Google Map Embed URL
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Embed URL (src attribute)</label>
                            <input
                                type="text"
                                name="googleMapUrl"
                                value={formData.googleMapUrl}
                                readOnly
                                disabled
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-500 cursor-not-allowed outline-none transition"
                            />
                            <p className="text-xs text-red-500 mt-2">
                                Modification of the map URL is restricted.
                            </p>
                        </div>
                    </section>

                    {/* Actions */}
                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>Saving...</>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
