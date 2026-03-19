'use client'

import { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Calendar, Clock, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const LeaveApplicationPage = () => {
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [staffLeaveHistory, setStaffLeaveHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedApplicationForRejection, setSelectedApplicationForRejection] = useState(null);

  // Mock data - replace with actual API call
 

  useEffect(() => {
    const fetchLeaveApplication = async () => {
      try{
        setIsLoading(true);
        const response = await fetch('/api/hr/leave');
        console.log("Response",response);
        const data = await response.json();

        console.log("Data",data);

        if(data.success){
          setLeaveApplications(data.data || []);
        }
        else{
          console.error('Failed to fetch leave applications:', data.error);
        }
      }catch{
        console.error('Error fetching leave applications:', error);
      }finally {
        setIsLoading(false);
      }
      fetchLeaveApplication();
    };

    
  }, []);

  const filteredApplications = leaveApplications.filter(app =>
    app.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.leaveType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewHistory = async (staffId, staffName) => {
    setSelectedStaff({ id: staffId, name: staffName });
    setShowHistoryModal(true);
    setHistoryLoading(true);
    
    try {
      const response = await fetch(`/api/hr/leave/${staffId}`);
      const data = await response.json();
      
      if (data.success) {
        setStaffLeaveHistory(data.data || []);
      } else {
        console.error('Failed to fetch leave history:', data.error);
        setStaffLeaveHistory([]);
      }
    } catch (error) {
      console.error('Error fetching leave history:', error);
      setStaffLeaveHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    try {
      const response = await fetch(`/api/hr/leave/${leaveId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approvedBy: 'HR Manager', // Replace with actual current user
          approvedDate: new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setLeaveApplications(prev => 
          prev.map(app => 
            app.id === leaveId 
              ? { ...app, status: 'approved' }
              : app
          )
        );
      } else {
        console.error('Failed to approve application:', data.error);
        alert('Failed to approve application. Please try again.');
      }
    } catch (error) {
      console.error('Error approving leave application:', error);
      alert('Failed to approve application. Please try again.');
    }
  };

  const handleRejectClick = (application) => {
    setSelectedApplicationForRejection(application);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

   try {
      const response = await fetch(`/api/hr/leave/${leaveId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason,
          rejectedBy: 'HR Manager', // Replace with actual current user
          rejectedDate: new Date().toISOString().split('T')[0]
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setLeaveApplications(prev => 
          prev.map(app => 
            app.id === selectedApplicationForRejection.id 
              ? { 
                  ...app, 
                  status: 'rejected',
                  rejectionReason: rejectionReason,
                  rejectedDate: new Date().toISOString().split('T')[0],
                  rejectedBy: 'HR Manager'
                }
              : app
          )
        );

        // Close modal and reset state
        setShowRejectModal(false);
        setSelectedApplicationForRejection(null);
        setRejectionReason('');
      } else {
        console.error('Failed to reject application:', data.error);
        alert('Failed to reject application. Please try again.');
      }
      
    } catch (error) {
      console.error('Error rejecting leave application:', error);
      alert('Failed to reject application. Please try again.');
    }
  };

  const cancelRejection = () => {
    setShowRejectModal(false);
    setSelectedApplicationForRejection(null);
    setRejectionReason('');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLeaveTypeBadge = (leaveType) => {
    switch (leaveType) {
      case 'Sick Leave':
        return 'bg-red-100 text-red-800';
      case 'Annual Leave':
        return 'bg-blue-100 text-blue-800';
      case 'Casual Leave':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">8</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">4</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <X className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6">
            <h1 className="text-2xl font-bold text-gray-800">Leave Applications</h1>
            
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by staff ID, name, or leave type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {application.staffId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeBadge(application.leaveType)}`}>
                          {application.leaveType}
                        </span>
                        <p className="text-sm text-gray-600 mt-1 max-w-xs truncate">
                          {application.reason}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {application.startDate} to {application.endDate}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.days} day{application.days > 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(application.status)}`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewHistory(application.staffId, application.name)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(application.id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRejectClick(application)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No applications found</p>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leave History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Leave History</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedStaff?.name} ({selectedStaff?.id})
                </p>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {historyLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : staffLeaveHistory.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">No Leave History</p>
                  <p className="text-gray-500">This employee has no previous leave records</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {staffLeaveHistory.map((leave) => (
                    <div key={leave.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeBadge(leave.leaveType)}`}>
                            {leave.leaveType}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(leave.status)}`}>
                            {leave.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {leave.days} day{leave.days > 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Leave Period</p>
                          <p className="text-sm text-gray-600">
                            {leave.startDate} to {leave.endDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Applied Date</p>
                          <p className="text-sm text-gray-600">{leave.appliedDate}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Reason</p>
                          <p className="text-sm text-gray-600">{leave.reason}</p>
                        </div>
                        {leave.status === 'approved' && (
                          <div>
                            <p className="text-sm font-medium text-green-700 mb-1">Approved By</p>
                            <p className="text-sm text-green-600">
                              {leave.approvedBy} on {leave.approvedDate}
                            </p>
                          </div>
                        )}
                        {leave.status === 'rejected' && (
                          <>
                            <div>
                              <p className="text-sm font-medium text-red-700 mb-1">Rejected By</p>
                              <p className="text-sm text-red-600">
                                {leave.rejectedBy} on {leave.rejectedDate}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason</p>
                              <p className="text-sm text-red-600">{leave.rejectionReason}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Reject Leave Application</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedApplicationForRejection?.name} ({selectedApplicationForRejection?.staffId})
                </p>
              </div>
              <button
                onClick={cancelRejection}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Application Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-medium">Leave Type</p>
                    <p className="text-gray-900">{selectedApplicationForRejection?.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-medium">Duration</p>
                    <p className="text-gray-900">{selectedApplicationForRejection?.days} day{selectedApplicationForRejection?.days > 1 ? 's' : ''}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 font-medium">Period</p>
                    <p className="text-gray-900">
                      {selectedApplicationForRejection?.startDate} to {selectedApplicationForRejection?.endDate}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600 font-medium">Reason</p>
                    <p className="text-gray-900">{selectedApplicationForRejection?.reason}</p>
                  </div>
                </div>
              </div>

              {/* Rejection Reason Input */}
              <div className="mb-6">
                <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="rejectionReason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejecting this leave application..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This reason will be sent to the employee and stored in their leave history.
                </p>
              </div>

              {/* Predefined Reasons */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Common reasons:</p>
                <div className="space-y-2">
                  {[
                    'Insufficient leave balance',
                    'Peak work period - critical project deadline',
                    'Inadequate notice period',
                    'Overlapping with team member leave',
                    'Documentation incomplete',
                    'Business requirement - cannot spare employee'
                  ].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => setRejectionReason(reason)}
                      className="text-left w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200 rounded-lg transition-colors"
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={cancelRejection}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors"
              >
                Reject Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApplicationPage;