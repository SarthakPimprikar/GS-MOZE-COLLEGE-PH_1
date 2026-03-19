'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HRDashboard() {
  //const router = typeof window !== 'undefined' ? useRouter() : null;
  const router = useRouter();
  // Sample data - replace with actual data from your backend
  const [stats, setStats] = useState({
    totalStaff: 124,
    presentToday: 98,
    pendingLeave: 16,
    recentHires: 5,
    upcomingBirthdays: 3
  });

  const [recentWorks, setRecentWorks] = useState([
    { id: 1, title: 'Payroll Processing', description: 'Completed July payroll for all employees', date: '2023-07-28', status: 'completed' },
    { id: 2, title: 'New Hire Onboarding', description: 'Onboarding materials prepared for 3 new hires', date: '2023-07-27', status: 'in-progress' },
    { id: 3, title: 'Policy Update', description: 'Revised employee handbook for Q3', date: '2023-07-25', status: 'pending' }
  ]);

  const [quickActions, setQuickActions] = useState([
    { id: 1, title: 'Add New Employee', icon: '👤', route: '/hr/staff' },
    { id: 2, title: 'Process Leave', icon: '📅', route: '/hr/leave' },
    { id: 3, title: 'Generate Reports', icon: '📊', route: '/reports' },
    { id: 4, title: 'Schedule Meeting', icon: '📝', route: '/meetings/new' }
  ]);

  const handleActionClick = (route) => {
    if (router) {
      router.push(route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Overview of your human resources activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Staff Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-500">Total Staff</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalStaff}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Present Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-500">Today's Present</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stats.presentToday}</p>
                  <p className="text-sm text-gray-500">{Math.round((stats.presentToday/stats.totalStaff)*100)}% attendance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Leave Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-500">Pending Leave</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stats.pendingLeave}</p>
                  <p className="text-sm text-gray-500">{stats.recentHires} new approvals needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Recent Works */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Recent Works</h2>
              <div className="space-y-4">
                {recentWorks.map((work) => (
                  <div key={work.id} className="border-l-4 pl-4 py-2" 
                    style={{ borderLeftColor: 
                      work.status === 'completed' ? '#10B981' : 
                      work.status === 'in-progress' ? '#F59E0B' : '#EF4444' 
                    }}>
                    <h3 className="font-medium text-gray-900">{work.title}</h3>
                    <p className="text-sm text-gray-600">{work.description}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">{work.date}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        work.status === 'completed' ? 'bg-green-100 text-green-800' :
                        work.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {work.status.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => handleActionClick('/works')}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                View all works →
              </button>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action.route)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <h3 className="font-medium text-gray-900">{action.title}</h3>
                  </button>
                ))}
              </div>
              
              {/* Upcoming Events Section */}
              <div className="mt-6 pt-4 border-t">
                <h3 className="text-md font-medium text-gray-900 mb-3">Upcoming Events</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Quarterly Review Meeting</p>
                      <p className="text-sm text-gray-600">Aug 15, 2023 • 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 text-purple-800 p-2 rounded-lg mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{stats.upcomingBirthdays} Birthdays this week</p>
                      <p className="text-sm text-gray-600">Send greetings to employees</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}