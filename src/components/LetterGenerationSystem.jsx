'use client'
import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Printer, 
  Settings, 
  Eye, 
  ChevronRight,
  Database,
  CheckCircle2,
  Clock,
  ArrowRight,
  History,
  Layout,
  User as UserIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const LetterGenerationSystem = ({ currentUser }) => {
  const [activeView, setActiveView] = useState('templates'); // templates, generate, history
  const [templates, setTemplates] = useState([]);
  const [generatedLetters, setGeneratedLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  
  // Generation State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [placeholderValues, setPlaceholderValues] = useState({});
  const [previewContent, setPreviewContent] = useState('');
  
  const printRef = useRef();

  useEffect(() => {
    fetchTemplates();
    fetchHistory();
  }, []);

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/letters/templates');
      const data = await res.json();
      if (data.success) setTemplates(data.data);
    } catch (err) { toast.error("Failed to load templates"); }
    finally { setLoading(false); }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/letters/generate');
      const data = await res.json();
      if (data.success) setGeneratedLetters(data.data);
    } catch (err) { console.error(err); }
  };

  const handleSearchRecipient = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(`/api/letters/search?query=${searchQuery}`);
      const data = await res.json();
      if (data.users && data.users.length > 0) {
        setSearchResults(data.users);
      } else {
        toast.error("No student or staff found with this email");
        setSearchResults([]);
      }
    } catch (error) { toast.error("Search failed"); }
  };

  const handleSelectRecipient = (user) => {
    setSelectedRecipient(user);
    setSearchResults([]);
    
    // Auto-populate based on template placeholders
    const initialValues = {};
    if (selectedTemplate) {
      selectedTemplate.placeholders.forEach(p => {
        // Map common fields
        if (p.includes('name')) initialValues[p] = user.fullName || user.username;
        if (p.includes('id')) initialValues[p] = user.studentId || user._id;
        if (p.includes('branch')) initialValues[p] = user.branch || user.department || 'Engineering';
        if (p.includes('year')) initialValues[p] = user.currentYear || '2026';
        if (p.includes('date')) initialValues[p] = new Date().toLocaleDateString();
        // Fallback for others
        if (!initialValues[p]) initialValues[p] = '';
      });
    }
    setPlaceholderValues(initialValues);
  };

  const updatePreview = () => {
    if (!selectedTemplate) return;
    let content = selectedTemplate.content;
    Object.entries(placeholderValues).forEach(([placeholder, value]) => {
      content = content.replaceAll(placeholder, value);
    });
    setPreviewContent(content);
  };

  useEffect(() => {
    if (selectedTemplate && selectedRecipient) updatePreview();
  }, [placeholderValues, selectedTemplate, selectedRecipient]);

  const handleFinalize = async () => {
    if (!selectedTemplate || !selectedRecipient || !previewContent) return;
    
    try {
      const res = await fetch('/api/letters/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate._id,
          recipientId: selectedRecipient._id,
          role: selectedRecipient.role || 'Student',
          content: previewContent,
          generatedBy: currentUser._id
        })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Letter generated and saved!");
        fetchHistory();
        setActiveView('history');
      }
    } catch (error) { toast.error("Failed to save letter"); }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Print Letter</title></head>
        <body style="margin: 0;">${previewContent}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-6 lg:p-10 text-gray-900">
      <Toaster />
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-5">
           <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 rotate-3 font-black">
              <FileText size={28} />
           </div>
           <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-900">Document Issuance</h1>
              <p className="text-gray-500 font-medium">Generate academic certificates and official letters</p>
           </div>
        </div>

        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
           {[
             { id: 'templates', label: 'Templates', icon: Layout },
             { id: 'generate', label: 'New Letter', icon: Plus },
             { id: 'history', label: 'Archive', icon: History }
           ].map(view => (
             <button
               key={view.id}
               onClick={() => setActiveView(view.id)}
               className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                 activeView === view.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               <view.icon size={16} />
               {view.label}
             </button>
           ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
           <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent shadow-xl"></div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          
          {activeView === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
               {templates.map(t => (
                 <div key={t._id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group border-b-4 border-b-transparent hover:border-b-blue-600">
                    <div className="flex justify-between items-start mb-6 text-black">
                       <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{t.category}</span>
                       <Settings className="text-gray-200 group-hover:text-blue-500 cursor-pointer transition-colors" size={20} />
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-gray-900">{t.name}</h3>
                    <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-8">{t.description}</p>
                    <button 
                      onClick={() => { setSelectedTemplate(t); setActiveView('generate'); }}
                      className="w-full py-4 bg-gray-50 text-gray-900 font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-600 hover:text-white transition-all uppercase tracking-widest text-xs"
                    >
                      Use Template
                      <ArrowRight size={16} />
                    </button>
                 </div>
               ))}
               <div className="bg-white border-2 border-dashed border-gray-200 p-8 rounded-[32px] flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-300 transition-all">
                  <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                     <Plus size={32} />
                  </div>
                  <p className="font-black text-gray-400 group-hover:text-blue-600">Create Template</p>
               </div>
            </div>
          )}

          {activeView === 'generate' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-right-10 duration-500">
               {/* Controls */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
                     <h2 className="text-xl font-black mb-6 flex items-center gap-3">
                        <Database className="text-blue-600" />
                        Configure Letter
                     </h2>
                     
                     <div className="space-y-6">
                        <div>
                           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Selected Template</label>
                           <select 
                             className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                             value={selectedTemplate?._id || ''}
                             onChange={(e) => setSelectedTemplate(templates.find(t => t._id === e.target.value))}
                           >
                              <option value="">Select a template...</option>
                              {templates.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                           </select>
                        </div>

                        <div>
                           <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">Search Recipient (Email)</label>
                           <div className="relative">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                              <input 
                                type="email"
                                placeholder="Student or Staff Email ID..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchRecipient()}
                              />
                           </div>
                           {searchResults.length > 0 && (
                             <div className="mt-3 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 text-black z-20 relative">
                                {searchResults.map(user => (
                                  <div 
                                    key={user._id} 
                                    onClick={() => handleSelectRecipient(user)}
                                    className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-50 flex items-center justify-between"
                                  >
                                     <div>
                                        <p className="font-bold text-sm tracking-tight">{user.fullName}</p>
                                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{user.email}</p>
                                        <p className="text-[9px] text-gray-400 font-medium">{user.role} • {user.department || user.branch}</p>
                                     </div>
                                     <ChevronRight size={14} className="text-gray-300" />
                                  </div>
                                ))}
                             </div>
                           )}
                        </div>

                        {selectedRecipient && (
                          <div className="bg-blue-50 p-5 rounded-2xl flex items-center gap-4 text-black text-sm">
                             <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                <UserIcon size={18} />
                             </div>
                             <div className="flex-1">
                                <p className="font-black">{selectedRecipient.fullName}</p>
                                <p className="text-xs text-gray-500">{selectedRecipient._id}</p>
                             </div>
                             <CheckCircle2 className="text-blue-600" size={20} />
                          </div>
                        )}
                     </div>
                  </div>

                  {selectedTemplate && selectedRecipient && (
                    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 animate-in slide-in-from-bottom-10">
                       <h2 className="text-xl font-black mb-6">Field Data</h2>
                       <div className="space-y-5">
                          {selectedTemplate.placeholders.map(p => (
                            <div key={p}>
                               <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block mb-2">{p.replace('{{', '').replace('}}', '').replace('_', ' ')}</label>
                               <input 
                                 type="text"
                                 className="w-full px-5 py-3.5 bg-gray-50 rounded-xl border-none font-bold text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                                 value={placeholderValues[p] || ''}
                                 onChange={(e) => setPlaceholderValues({...placeholderValues, [p]: e.target.value})}
                               />
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
               </div>

               {/* Preview */}
               <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="bg-white p-2 rounded-[32px] shadow-2xl border border-gray-100 shadow-blue-100 min-h-[800px] flex flex-col">
                     <div className="flex justify-between items-center p-6 border-b border-gray-50">
                        <span className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                           <Eye size={16} /> 
                           Live Document Preview
                        </span>
                        <div className="flex gap-3">
                           <button onClick={handlePrint} className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all"><Printer size={20} /></button>
                           <button onClick={() => toast("PDF Generation downloading...")} className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 rounded-xl transition-all"><Download size={20} /></button>
                        </div>
                     </div>
                     <div className="flex-1 overflow-auto p-1 bg-gray-200/20 rounded-b-[32px]">
                        <div className="bg-white w-[794px] min-h-[1123px] mx-auto my-10 shadow-lg origin-top" style={{ transform: 'scale(1)' }}>
                           <div dangerouslySetInnerHTML={{ __html: previewContent || '<div style="padding: 100px; text-align: center; color: #ccc;">Select template and recipient to preview...</div>' }} />
                        </div>
                     </div>
                  </div>
                  
                  <button 
                    disabled={!selectedTemplate || !selectedRecipient}
                    onClick={handleFinalize}
                    className="py-5 bg-blue-600 text-white font-black rounded-3xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all uppercase tracking-widest disabled:opacity-50 disabled:bg-gray-300 disabled:shadow-none"
                  >
                    Generate & Save to Archive
                  </button>
               </div>
            </div>
          )}

          {activeView === 'history' && (
             <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden text-black animate-in fade-in duration-500">
                <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                   <h2 className="text-2xl font-black text-gray-900">Document Archive</h2>
                   <p className="text-blue-600 font-black text-sm uppercase tracking-widest">{generatedLetters.length} Official Records</p>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                         <tr>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Serial Number</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Type</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Generated By</th>
                            <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Print</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {generatedLetters.map(letter => (
                           <tr key={letter._id} className="hover:bg-gray-50/50 transition-colors group">
                              <td className="px-10 py-8">
                                 <span className="font-black text-gray-900">{letter.serialNumber}</span>
                                 <p className="text-[10px] text-gray-400 mt-1 font-bold italic">{new Date(letter.date).toLocaleString()}</p>
                              </td>
                              <td className="px-10 py-8">
                                 <p className="font-bold text-sm">{letter.content.includes('Mr.') ? 'Student' : 'Staff'}</p>
                                 <p className="text-xs text-gray-500 font-medium">Record ID: {letter.recipientId?.slice(-6)}</p>
                              </td>
                              <td className="px-10 py-8">
                                 <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-blue-400" />
                                    <p className="font-black text-gray-700">{letter.templateId?.name}</p>
                                 </div>
                              </td>
                              <td className="px-10 py-8">
                                 <p className="text-sm font-medium">{letter.generatedBy?.fullName}</p>
                              </td>
                              <td className="px-10 py-8">
                                 <button onClick={() => {
                                   const win = window.open('', '_blank');
                                   win.document.write(letter.content);
                                   win.document.close();
                                   win.print();
                                 }} className="p-3 bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-600 rounded-xl transition-all">
                                    <Printer size={18} />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          )}

        </div>
      )}
    </div>
  );
};

export default LetterGenerationSystem;
