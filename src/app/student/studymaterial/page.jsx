'use client';

import { BookOpen, Download, Search, Filter, Calendar, FileText, X, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StudyMaterialPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch("/api/students/fetch-notes"); // 👈 your API that fetches Cloudinary files
        const data = await res.json();

        if (!data.success) throw new Error(data.error || "Failed to fetch notes");

        const mapped = data.data.map((file, index) => ({
          _id: file.asset_id || index,
          title: file.public_id?.split('/').pop() || "Untitled",
          description: file.context?.custom?.description || "No description",
          subject: file.context?.custom?.subject || "General",
          fileUrl: file.secure_url,
          createdAt: file.created_at,
          fileSize: `${(file.bytes / (1024 * 1024)).toFixed(2)} MB`,
          downloads: 0, // you can implement downloads tracking later
          type: file.format?.toUpperCase() || "FILE"
        }));

        setMaterials(mapped);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const getUniqueSubjects = () => {
    return [...new Set(materials.map(m => m.subject))];
  };

  const filteredAndSortedMaterials = () => {
    let filtered = materials.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
        case 'popular': return b.downloads - a.downloads;
        case 'title': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

    return filtered;
  };

  const groupBySubject = (materials) => {
    const grouped = {};
    materials.forEach((material) => {
      const subject = material.subject || 'Unknown Subject';
      if (!grouped[subject]) grouped[subject] = [];
      grouped[subject].push(material);
    });
    return grouped;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSortBy('newest');
  };

  const getFileTypeColor = (type) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-800';
      case 'DOC': return 'bg-maroon-50 text-moze-primary text-blue-800';
      case 'PPT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const processedMaterials = filteredAndSortedMaterials();

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50/30 via-white to-maroon-50/50">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-moze-primary rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Study Materials</h1>
          </div>
          <p className="text-gray-600">Access your course materials, notes, and resources</p>
        </div>

        {/* Filters + Search */}
        {/* ... keep your filter/search UI the same ... */}

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-moze-primary"></div>
            <span className="ml-3 text-gray-500">Loading materials...</span>
          </div>
        ) : processedMaterials.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials found</h3>
            <p className="text-gray-600">No study materials are available right now</p>
          </div>
        ) : (
          Object.entries(groupBySubject(processedMaterials)).map(([subject, items]) => (
            <div key={subject} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{subject}</h2>
                <span className="px-2 py-1 bg-maroon-50 text-moze-primary text-blue-800 text-sm rounded-full">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((material) => (
                  <div key={material._id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-5 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-moze-primary" />
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getFileTypeColor(material.type)}`}>
                          {material.type}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{material.fileSize}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-moze-primary transition-colors">
                      {material.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{material.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(material.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <span>{material.downloads} downloads</span>
                    </div>

                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-moze-primary hover:bg-maroon-800 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
