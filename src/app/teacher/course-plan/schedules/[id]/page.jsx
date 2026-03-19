"use client";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  BookOpen,
  FileText,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CoursePlanPage() {
  const router = useRouter();
  const { id } = useParams();
  const [coursePlan, setCoursePlan] = useState({
    title: "",
    description: "",
    loadType: "Theory",
    modules: [],
  });
  const [subject, setSubject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log(id);
       
        // First fetch subject details
        const subjectRes = await fetch(`/api/courses/subject/${id}`);
        if (!subjectRes.ok) throw new Error("Failed to fetch subject");
        const subjectData = await subjectRes.json();
        const singleSubjectData = subjectData.subject
        setSubject(singleSubjectData);
 
       
        // Then try to fetch existing course plan
        const planRes = await fetch(`/api/courses/course-plan/${id}`);
 
        console.log(planRes);
       
        if (planRes.ok) {
          const planData = await planRes.json();
          console.log(planData);
          console.log("planning = ",planData)
          if (planData) {
            setCoursePlan(planData);
          } else {
            // Initialize new plan with subject details
            setCoursePlan(prev => ({
              ...prev,
              title: singleSubjectData.name,
              description: `${singleSubjectData.name} for ${singleSubjectData.year} year ${singleSubjectData.department} department`,
              branch: singleSubjectData.department,
              year: singleSubjectData.year,
              division: singleSubjectData.division || "-",
              modules:[]
            }));
          }
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  // Fetch course plan data
  useEffect(() => {
 
 //samplle
    fetchData();
  }, [id]);
  console.log("courseeeee = ",coursePlan)
  const handleSave = async () => {
    try {
      setIsLoading(true);
      console.log("courseplandID",coursePlan)
      const method = coursePlan._id ? "PUT" : "POST";
      const url = coursePlan._id ? `/api/courses/${coursePlan._id}` : "/api/courses";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...coursePlan,
          subject: id,
          teacherId: subject.teacher,
           branch: subject.department,
          year: subject.year,
          division: subject.division,
        }),
      });

      console.log(JSON.stringify({
          ...coursePlan,
          subject: id,
          teacherId: subject.teacher,
           branch: subject.department,
          year: subject.year,
          division: subject.division,
        }));
      
      if (!response.ok) throw new Error("Failed to save course plan");

      const data = await response.json();
      console.log(data);
      setCoursePlan(data);
      
      toast.success("Course plan saved successfully!");

      window.location.reload()
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Module handlers
  const addModule = () => {
    const newModule = {
      _id: Date.now().toString(),
      title: "New Module",
      duration: 0,
      lessons: [],
    };
    setCoursePlan(prev => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }));
    setEditingModuleId(newModule._id);
    setExpandedModules(prev => ({ ...prev, [newModule._id]: true }));
  };

  const updateModule = (moduleId, updates) => {
    setCoursePlan(prev => ({
      ...prev,
      modules: prev.modules.map(module =>
        module._id === moduleId ? { ...module, ...updates } : module
      ),
    }));
  };

  const deleteModule = moduleId => {
    setCoursePlan(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module._id !== moduleId),
    }));
  };

  // Lesson handlers
  const addLesson = moduleId => {
    const newLesson = {
      _id: Date.now().toString(),
      title: "New Lesson",
      duration: 0,
      completed: false,
      description: "",
    };
    updateModule(moduleId, {
      lessons: [...coursePlan.modules.find(m => m._id === moduleId).lessons, newLesson],
    });
    setEditingLessonId(newLesson._id);
  };

  const updateLesson = (moduleId, lessonId, updates) => {
    const module = coursePlan.modules.find(m => m._id === moduleId);
    if (!module) return;

    updateModule(moduleId, {
      lessons: module.lessons.map(lesson =>
        lesson._id === lessonId ? { ...lesson, ...updates } : lesson
      ),
    });
  };

  const deleteLesson = (moduleId, lessonId) => {
    const module = coursePlan.modules.find(m => m._id === moduleId);
    if (!module) return;

    updateModule(moduleId, {
      lessons: module.lessons.filter(lesson => lesson._id !== lessonId),
    });
  };

  const toggleModule = moduleId => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  if (isLoading && !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {coursePlan._id ? "Edit" : "Create"} Course Plan
              </h1>
              {subject && (
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} />
                    {subject.code} - {subject.name}
                  </span>
                  <span>{subject.year} Year</span>
                  <span>{subject.department}</span>
                  <span>Division: {subject.division || "-"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Plan Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Plan Title
              </label>
              <input
                type="text"
                value={coursePlan.title}
                onChange={e => setCoursePlan({ ...coursePlan, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter course plan title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Load Type
              </label>
              <select
                value={coursePlan.loadType}
                onChange={e => setCoursePlan({ ...coursePlan, loadType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="Theory">Theory</option>
                <option value="Lab">Lab</option>
                <option value="Audit">Audit</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={coursePlan.description}
              onChange={e => setCoursePlan({ ...coursePlan, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe your course plan"
            />
          </div>
        </div>

        {/* Modules Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Modules</h2>
            <button
              onClick={addModule}
              disabled={isLoading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              Add Module
            </button>
          </div>

          {coursePlan.modules?.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No modules added yet. Start by adding your first module.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {coursePlan?.modules?.map(module => (
                <div key={module._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Module Header */}
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleModule(module._id)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {expandedModules[module._id] ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </button>
                      
                      {editingModuleId === module._id ? (
                        <input
                          type="text"
                          value={module.title}
                          onChange={e => updateModule(module._id, { title: e.target.value })}
                          className="font-medium text-gray-900 border-b border-gray-300 focus:outline-none focus:border-indigo-500 px-1"
                          autoFocus
                          onBlur={() => setEditingModuleId(null)}
                          onKeyDown={e => e.key === "Enter" && setEditingModuleId(null)}
                        />
                      ) : (
                        <h3
                          className="font-medium text-gray-900 cursor-pointer"
                          onClick={() => setEditingModuleId(module._id)}
                        >
                          {module.title}
                        </h3>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock size={16} />
                        {module.duration} min
                      </span>
                      <button
                        onClick={() => deleteModule(module._id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Module Content */}
                  {expandedModules[module._id] && (
                    <div className="p-4 space-y-6">
                      {/* Module Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duration (minutes)
                          </label>
                          <input
                            type="number"
                            value={module.duration}
                            onChange={e => updateModule(module._id, { duration: parseInt(e.target.value) || 0 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            min="0"
                          />
                        </div>
                      </div>

                      {/* Lessons */}
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-800">Lessons</h4>
                          <button
                            onClick={() => addLesson(module._id)}
                            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                          >
                            <Plus size={16} />
                            Add Lesson
                          </button>
                        </div>

                        {module.lessons?.length === 0 ? (
                          <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg">
                            No lessons in this module yet.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {module.lessons.map(lesson => (
                              <div key={lesson._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-start gap-3 w-full">
                                    <button
                                      onClick={() => updateLesson(module._id, lesson._id, { completed: !lesson.completed })}
                                      className={`mt-1 ${lesson.completed ? "text-green-500" : "text-gray-300"}`}
                                    >
                                      {lesson.completed ? (
                                        <CheckCircle size={18} />
                                      ) : (
                                        <XCircle size={18} />
                                      )}
                                    </button>
                                    
                                    <div className="flex-1 space-y-2">
                                      {editingLessonId === lesson._id ? (
                                        <input
                                          type="text"
                                          value={lesson.title}
                                          onChange={e => updateLesson(module._id, lesson._id, { title: e.target.value })}
                                          className="font-medium text-gray-900 w-full border-b border-gray-300 focus:outline-none focus:border-indigo-500 px-1 bg-transparent"
                                          autoFocus
                                          onBlur={() => setEditingLessonId(null)}
                                          onKeyDown={e => e.key === "Enter" && setEditingLessonId(null)}
                                        />
                                      ) : (
                                        <h5
                                          className="font-medium text-gray-900 cursor-pointer"
                                          onClick={() => setEditingLessonId(lesson._id)}
                                        >
                                          {lesson.title}
                                        </h5>
                                      )}
                                      
                                      <textarea
                                        value={lesson.description}
                                        onChange={e => updateLesson(module._id, lesson._id, { description: e.target.value })}
                                        className="w-full text-sm text-gray-700 bg-white border border-gray-200 rounded p-2 focus:border-indigo-300 focus:outline-none"
                                        placeholder="Add description"
                                        rows={2}
                                      />
                                      
                                      <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock size={14} />
                                        <input
                                          type="number"
                                          value={lesson.duration}
                                          onChange={e => updateLesson(module._id, lesson._id, { duration: parseInt(e.target.value) || 0 })}
                                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                                          min="0"
                                        />
                                        <span>minutes</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <button
                                    onClick={() => deleteLesson(module._id, lesson._id)}
                                    className="text-red-400 hover:text-red-600 p-1 ml-2"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm disabled:opacity-70"
          >
            {isLoading ? "Saving..." : "Save Course Plan"}
          </button>
        </div>
      </div>
    </div>
  );
}
