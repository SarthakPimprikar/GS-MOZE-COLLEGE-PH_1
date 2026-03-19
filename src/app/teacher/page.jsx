"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Search,
  Plus,
  Clock,
  Award,
  Trash2,
  CheckCircle,
  XCircle,
  Briefcase,
  FileSearch,
  Calendar,
  Save,
  X
} from "lucide-react";
import { useSession } from "@/context/SessionContext";


const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && <p className="text-sm text-green-600 mt-1">↗ {trend}</p>}
      </div>
      <Icon className="h-8 w-8" style={{ color }} />
    </div>
  </div>
);

export default function TeacherDashboard() {
  const { user } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [talentSubTab, setTalentSubTab] = useState("duty");
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [classes, setClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: "", dueDate: "", total: 25 });
  
  // Talent states
  const [duties, setDuties] = useState([]);
  const [publications, setPublications] = useState([]);
  const [coffRequests, setCoffRequests] = useState([]);
  const [isTalentLoading, setIsTalentLoading] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [studentsRes, assignmentsRes, classesRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/assignments"),
          fetch("/api/classes"),
        ]);
        const studentsData = await studentsRes.json();
        const assignmentsData = await assignmentsRes.json();
        const classesData = await classesRes.json();

        setStudents(studentsData);
        setAssignments(assignmentsData);
        setClasses(classesData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load data");
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchTalentData = async () => {
    if (!user?.id) return;
    setIsTalentLoading(true);
    try {
      const [dutyRes, pubRes, coffRes] = await Promise.all([
        fetch(`/api/talent/election-duty?teacherId=${user.id}`),
        fetch(`/api/talent/publications?teacherId=${user.id}`),
        fetch(`/api/talent/c-off?teacherId=${user.id}`)
      ]);
      const dutyData = await dutyRes.json();
      const pubData = await pubRes.json();
      const coffData = await coffRes.json();
      
      if (dutyData.success) setDuties(dutyData.data);
      if (pubData.success) setPublications(pubData.data);
      if (coffData.success) setCoffRequests(coffData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTalentLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "talent") {
      fetchTalentData();
    }
  }, [activeTab, user?.id]);

  // Handle assignment creation
  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });
      const createdAssignment = await res.json();
      setAssignments([...assignments, createdAssignment]);
      setShowCreateModal(false);
      setNewAssignment({ title: "", dueDate: "", total: 25 });
    } catch (err) {
      setError("Failed to create assignment");
    }
  };

  // Handle assignment deletion
  const handleDeleteAssignment = async (id) => {
    try {
      await fetch("/api/assignments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setAssignments(assignments.filter((assignment) => assignment.id !== id));
    } catch (err) {
      setError("Failed to delete assignment");
    }
  };

  // Filter assignments based on search
  const filteredAssignments = assignments.filter((assignment) =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={Users}
          color="#3B82F6"
          trend={students.length > 0 ? `+${students.length} this week` : ""}
        />
        <StatCard
          title="Active Classes"
          value={classes.length}
          icon={BookOpen}
          color="#10B981"
        />
        <StatCard
          title="Pending Assignments"
          value={assignments.filter((a) => a.status === "active").length}
          icon={FileText}
          color="#F59E0B"
        />
        <StatCard
          title="Average Grade"
          value={
            students.length
              ? (
                  students.reduce((acc, s) => acc + (s.grade === "A" ? 4 : s.grade === "B+" ? 3.3 : 0), 0) /
                  students.length
                ).toFixed(1)
              : "N/A"
          }
          icon={Award}
          color="#8B5CF6"
          trend={students.length ? "+0.2 this month" : ""}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: "Alice Johnson submitted Math Quiz", time: "2 hours ago" },
              { action: "New assignment posted to Science Advanced", time: "4 hours ago" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
          <div className="space-y-3">
            {classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium">{cls.name}</p>
                  <p className="text-sm text-gray-600">{cls.students} students</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-blue-600">{cls.nextClass}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const AssignmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Assignments</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <p>Loading assignments...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{assignment.title}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    assignment.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {assignment.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Due Date:</span>
                  <span className="text-sm font-medium">{assignment.dueDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Submitted:</span>
                  <span className="text-sm font-medium">
                    {assignment.submitted}/{assignment.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-blue-100 text-blue-600 py-2 px-3 rounded-lg hover:bg-blue-200 text-sm">
                  View Details
                </button>
                <button
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="flex-1 bg-red-100 text-red-600 py-2 px-3 rounded-lg hover:bg-red-200 text-sm"
                >
                  <Trash2 className="h-4 w-4 inline-block mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Assignment</h3>
            <form onSubmit={handleCreateAssignment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={newAssignment.title}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={newAssignment.dueDate}
                  onChange={(e) =>
                    setNewAssignment({ ...newAssignment, dueDate: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-600 focus:border-blue-600"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const TalentTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          {[
            { id: "duty", label: "Election Duty", icon: Briefcase },
            { id: "pub", label: "Publications", icon: FileSearch },
            { id: "coff", label: "C-Off Requests", icon: Clock },
          ].map((sub) => (
            <button
              key={sub.id}
              onClick={() => setTalentSubTab(sub.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                talentSubTab === sub.id
                  ? "border-moze-primary text-moze-primary bg-white"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
              }`}
            >
              <sub.icon size={16} />
              {sub.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {talentSubTab === "duty" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Election Duty History</h3>
                <button className="bg-moze-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-maroon-800 transition shadow-sm flex items-center gap-2">
                  <Plus size={14} /> Log New Duty
                </button>
              </div>
              
              {isTalentLoading ? <div className="animate-pulse h-20 bg-gray-50 rounded-xl"></div> : 
               duties.length === 0 ? <p className="text-sm text-gray-400 italic py-10 text-center">No election duty records found.</p> :
               <div className="grid gap-3">
                 {duties.map(d => (
                   <div key={d._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                     <div>
                       <p className="font-bold text-gray-900">{d.dutyName}</p>
                       <p className="text-xs text-gray-500">{d.location} • {new Date(d.startDate).toLocaleDateString()}</p>
                     </div>
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${d.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                       {d.status}
                     </span>
                   </div>
                 ))}
               </div>
              }
            </div>
          )}

          {talentSubTab === "pub" && (
            <div className="space-y-4">
               <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Research & Publications</h3>
                <button className="bg-moze-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-maroon-800 transition shadow-sm flex items-center gap-2">
                  <Plus size={14} /> Submit Paper
                </button>
              </div>
              {isTalentLoading ? <div className="animate-pulse h-20 bg-gray-50 rounded-xl"></div> : 
               publications.length === 0 ? <p className="text-sm text-gray-400 italic py-10 text-center">No research papers recorded.</p> :
               <div className="grid gap-3">
                 {publications.map(p => (
                   <div key={p._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                     <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-sm">{p.title}</h4>
                        <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{p.status}</span>
                     </div>
                     <p className="text-xs text-gray-500 mt-1">{p.journal} • {new Date(p.publicationDate).getFullYear()}</p>
                   </div>
                 ))}
               </div>
              }
            </div>
          )}

          {talentSubTab === "coff" && (
            <div className="space-y-4">
               <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Compensatory Off Tracking</h3>
                <button className="bg-moze-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-maroon-800 transition shadow-sm flex items-center gap-2">
                  <Plus size={14} /> Request C-Off
                </button>
              </div>
              {isTalentLoading ? <div className="animate-pulse h-20 bg-gray-50 rounded-xl"></div> : 
               coffRequests.length === 0 ? <p className="text-sm text-gray-400 italic py-10 text-center">No C-Off requests found.</p> :
               <div className="grid gap-3">
                 {coffRequests.map(c => (
                   <div key={c._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                     <div>
                       <p className="font-bold text-gray-900 text-sm">Earned on {new Date(c.earnedOnDate).toLocaleDateString()}</p>
                       <p className="text-xs text-gray-500">{c.reasonForEarning}</p>
                     </div>
                     <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                       c.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 
                       c.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                     }`}>
                       {c.status}
                     </span>
                   </div>
                 ))}
               </div>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "assignments", label: "Assignments", icon: FileText },
    { id: "talent", label: "Talent Corner", icon: Award },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex space-x-8 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        <div>
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "assignments" && <AssignmentsTab />}
          {activeTab === "talent" && <TalentTab />}
        </div>
      </div>
    </div>
  );
}