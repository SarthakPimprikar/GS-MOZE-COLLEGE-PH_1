"use client"

import React, { useState } from 'react';
import {
    FileText,
    ChevronDown,
    CheckCircle2,
    Clock,
    XCircle,
    Download,
    Info
} from 'lucide-react';

const CertificatePage = () => {
    const [selectedCertificate, setSelectedCertificate] = useState('');
    const [reason, setReason] = useState('');
    const [requests, setRequests] = useState([
        {
            id: 1,
            type: 'Bonafide Certificate',
            reason: 'Bank account opening',
            date: '2023-06-10',
            status: 'approved',
            downloadUrl: '#'
        },
        {
            id: 2,
            type: 'Course Completion Certificate',
            reason: 'Job application requirements',
            date: '2023-05-22',
            status: 'pending'
        },
        {
            id: 3,
            type: 'Transfer Certificate',
            reason: 'Changing institutions',
            date: '2023-04-15',
            status: 'rejected',
            rejectionReason: 'Outstanding fees must be cleared first'
        }
    ]);

    const certificateTypes = [
        'Bonafide Certificate',
        'Course Completion Certificate',
        'Transfer Certificate',
        'Leaving Certificate',
        'Character Certificate',
        'Migration Certificate',
        'Degree Certificate',
        'Transcript Request'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCertificate || !reason) return;

        const newRequest = {
            id: requests.length + 1,
            type: selectedCertificate,
            reason,
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        };

        setRequests([newRequest, ...requests]);
        setSelectedCertificate('');
        setReason('');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3" /> Approved
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        <XCircle className="w-3 h-3" /> Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-gray-800">Certificate Requests</h1>
                        <p className="text-gray-600">Apply for institutional certificates and documents</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Request Form */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">New Request</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Certificate Type
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedCertificate}
                                            onChange={(e) => setSelectedCertificate(e.target.value)}
                                            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary appearance-none"
                                            required
                                        >
                                            <option value="">Select certificate type</option>
                                            {certificateTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Reason for Request
                                    </label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-moze-primary"
                                        placeholder="Explain why you need this certificate..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 bg-moze-primary text-white rounded-lg hover:bg-maroon-800 transition-colors"
                                >
                                    Submit Request
                                </button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-start gap-3 p-3 bg-maroon-50/50 rounded-lg">
                                    <Info className="w-5 h-5 text-moze-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-800">Important Information</h3>
                                        <ul className="mt-1 text-xs text-blue-700 list-disc list-inside space-y-1">
                                            <li>Processing time: 3-5 working days</li>
                                            <li>Some certificates may require additional verification</li>
                                            <li>You'll be notified when your document is ready</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Request History */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">Your Requests</h2>

                                {requests.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Certificate Type
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Reason
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Status
                                                    </th>
                                                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {requests.map(request => (
                                                    <tr key={request.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {request.type}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-800 max-w-xs">
                                                            <div className="line-clamp-1" title={request.reason}>
                                                                {request.reason}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">
                                                            {new Date(request.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            {getStatusBadge(request.status)}
                                                            {request.status === 'rejected' && (
                                                                <div className="text-xs text-red-600 mt-1">
                                                                    {request.rejectionReason}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            {request.status === 'approved' ? (
                                                                <button className="text-moze-primary hover:text-blue-800 flex items-center gap-1">
                                                                    <Download className="w-4 h-4" />
                                                                    Download
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-500">—</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900">No certificate requests yet</h3>
                                        <p className="text-gray-500 mt-1">Submit a request using the form</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Certificate Information */}
                        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">About Certificates</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Common Certificate Types</h3>
                                    <ul className="space-y-2 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <span className="font-medium">Bonafide:</span>
                                            <span>Proof of enrollment for bank accounts, scholarships, etc.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-medium">Transfer/Leaving:</span>
                                            <span>Required when changing schools or colleges</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-medium">Character:</span>
                                            <span>Certifies your conduct during your time at the institution</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="font-medium">Transcript:</span>
                                            <span>Official record of your academic performance</span>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium text-gray-800 mb-2">Processing Information</h3>
                                    <ul className="space-y-3 text-sm text-gray-700">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Digital copies are usually available within 3 working days</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Physical copies may take 5-7 days and may require pickup</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>Some certificates may require administrative approval</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>You'll receive email notifications at each stage</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificatePage;