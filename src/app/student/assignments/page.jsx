
'use client';

import React, { useState } from 'react';
import { CalendarDays, Clock, BookOpenCheck, FileText, AlertCircle, CheckCircle, Filter, Search, Calendar } from 'lucide-react';

function formatDate(isoDate) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(isoDate).toLocaleDateString(undefined, options);
}

function getTimeUntilDue(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const timeDiff = due - now;
  
  if (timeDiff < 0) return 'Overdue';
  
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days === 0) return `${hours}h remaining`;
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `${days} days`;
  return `${days} days`;
}

function getAssignmentStatus(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const timeDiff = due - now;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  if (timeDiff < 0) return { status: 'overdue', color: 'red', bgColor: 'bg-red-50' };
  if (days <= 3) return { status: 'urgent', color: 'red', bgColor: 'bg-red-50' };
  if (days <= 7) return { status: 'soon', color: 'yellow', bgColor: 'bg-yellow-50' };
  return { status: 'upcoming', color: 'blue', bgColor: 'bg-maroon-50/50' };
}

export default function AssignmentsPage() {
  // Dummy data for assignments
  const [assignments] = useState([
    {
      _id: '1',
      assignmentNumber: 'Assignment 1',
      subject: 'Programming in C',
      dueDate: '2025-08-01',
      totalMarks: 50,
      type: 'Coding Assignment'
    },
    {
      _id: '2',
      assignmentNumber: 'Assignment 2',
      subject: 'Data Structures',
      dueDate: '2025-07-25',
      totalMarks: 75,
      type: 'Problem Solving'
    },
    {
      _id: '3',
      assignmentNumber: 'Assignment 3',
      subject: 'Web Development',
      dueDate: '2025-07-20',
      totalMarks: 100,
      type: 'Project'
    },
    {
      _id: '4',
      assignmentNumber: 'Assignment 4',
      subject: 'Database Management',
      dueDate: '2025-07-15',
      totalMarks: 60,
      type: 'SQL Queries'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.assignmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const status = getAssignmentStatus(assignment.dueDate).status;
    return matchesSearch && status === filterStatus;
  });

  const totalCount = assignments.length;
  const upcomingCount = assignments.filter(assignment => getAssignmentStatus(assignment.dueDate).status !== 'overdue').length;
  const urgentCount = assignments.filter(assignment => getAssignmentStatus(assignment.dueDate).status === 'urgent').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50/30 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-maroon-50 text-moze-primary rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">Total Assignments</div>
                  <div className="text-3xl font-serif font-bold text-gray-800">{totalCount}</div>
                </div>
                <div className="p-3 bg-moze-primary rounded-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-green-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">Upcoming</div>
                  <div className="text-3xl font-serif font-bold text-gray-800">{upcomingCount}</div>
                </div>
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            
            <div className="bg-purple-100 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-gray-600 text-sm font-medium">Urgent</div>
                  <div className="text-3xl font-serif font-bold text-gray-800">{urgentCount}</div>
                </div>
                <div className="p-3 bg-purple-500 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments by subject or number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-moze-primary focus:border-transparent appearance-none bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Assignments</option>
                <option value="urgent">Urgent</option>
                <option value="soon">This Week</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-600">
                {searchTerm || filterStatus !== 'all' ? 'No assignments match your search criteria.' : 'No assignments available.'}
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAssignments.map((assignment) => {
                const assignmentStatus = getAssignmentStatus(assignment.dueDate);
                const timeUntil = getTimeUntilDue(assignment.dueDate);
                
                return (
                  <div
                    key={assignment._id}
                    className={`bg-white rounded-2xl shadow-lg border-l-4 border-${assignmentStatus.color}-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${assignmentStatus.bgColor}`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-${assignmentStatus.color}-100 rounded-lg`}>
                            <FileText className={`w-5 h-5 text-${assignmentStatus.color}-600`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-serif font-bold text-gray-800">{assignment.assignmentNumber}</h3>
                            <p className="text-gray-600 font-medium">{assignment.subject}</p>
                          </div>
                        </div>
                        
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-${assignmentStatus.color}-100 text-${assignmentStatus.color}-800`}>
                          {timeUntil}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <CalendarDays className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{formatDate(assignment.dueDate)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Total Marks: {assignment.totalMarks}</span>
                        </div>
                      </div>

                      {assignmentStatus.status === 'urgent' && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">Assignment deadline is approaching! Make sure to submit on time.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}