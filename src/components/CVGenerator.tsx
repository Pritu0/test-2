import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import html2pdf from 'html2pdf.js';
import { 
  X, Download, FileText, Layout, CheckCircle2, Edit3, User, Briefcase, 
  GraduationCap, Award, Settings, Mail, MapPin, Phone, Plus, Trash2, Globe, Languages, Users, Sparkles, Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { portfolioData as initialData } from '../data';

type Template = 'modern' | 'classic' | 'minimal' | 'executive' | 'professional';
type Mode = 'cv' | 'cover-letter' | 'resume';

export function CVGenerator({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [template, setTemplate] = useState<Template>('modern');
  const [mode, setMode] = useState<Mode>('cv');
  const [data, setData] = useState(() => {
    const d = { ...initialData };
    d.name = d.name.replace(/^Eng\.\s+/i, '');
    d.coverLetter = d.coverLetter.replace(/Eng\.\s+Inas Bin Yousuf/gi, 'Inas Bin Yousuf');
    return d;
  });
  const [activeTab, setActiveTab] = useState<'templates' | 'edit' | 'ai'>('templates');
  const [mobileView, setMobileView] = useState<'edit' | 'preview'>('edit');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [aiTheme, setAiTheme] = useState({ color: '#4f46e5', font: 'Inter' });
  const cvRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const optimizeWithAI = async () => {
    if (!jobDescription.trim()) return;
    setIsOptimizing(true);
    try {
      const model = "gemini-3-flash-preview";
      const prompt = `
        You are a professional CV/Resume writer. 
        I will provide you with my current CV data in JSON format and a Job Description.
        Please optimize the "objective", "experience" descriptions, and "skills" to be perfectly tailored for this job.
        Make it professional, impact-oriented, and concise. Use strong action verbs.
        
        Also, suggest the best visual style for this job with these constraints:
        - template: 'modern', 'classic', or 'minimal'
        - themeColor: a hex color based on the template:
          * If 'modern': use '#4f46e5' or '#3b82f6'
          * If 'classic': use a muted grey (e.g., #71717a) or sepia tone (e.g., #78350f)
          * If 'minimal': use a very light grey (e.g., #f4f4f5) or white (#ffffff)
        - font: must be one of 'Inter', 'Roboto', 'Open Sans', or 'Lato'
        
        Return ONLY a JSON object with this structure:
        {
          "updatedData": { ...same structure as input data... },
          "theme": { "color": "#hex", "font": "Font Name", "template": "modern|classic|minimal" }
        }
        
        Job Description: ${jobDescription}
        Current Data: ${JSON.stringify(data)}
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        if (result.updatedData) {
          setData(result.updatedData);
        }
        if (result.theme) {
          setAiTheme({ color: result.theme.color, font: result.theme.font });
          if (result.theme.template) setTemplate(result.theme.template as Template);
        }
        setActiveTab('edit');
      }
    } catch (error) {
      console.error("AI Optimization failed:", error);
      alert("AI optimization failed. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all changes?")) {
      const d = { ...initialData };
      d.name = d.name.replace(/^Eng\.\s+/i, '');
      d.coverLetter = d.coverLetter.replace(/Eng\.\s+Inas Bin Yousuf/gi, 'Inas Bin Yousuf');
      setData(d);
      setAiTheme({ color: '#4f46e5', font: 'Inter' });
      setTemplate('modern');
    }
  };

  const handlePrint = () => {
    const element = cvRef.current;
    if (!element) return;

    setIsOptimizing(true);

    // Apply print-specific class for perfect A4 rendering
    element.classList.add('pdf-export-mode');

    // Use a timeout to allow the browser to re-render the element with new styles
    setTimeout(async () => {
      try {
        const opt = {
          margin: [0, 0, -1, 0] as any, // Slight negative margin at bottom to curb overflow
          filename: `${data.name.replace(/\s+/g, '_')}_${mode}.pdf`,
          image: { type: 'jpeg' as const, quality: 1.0 },
          html2canvas: { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            letterRendering: true,
            allowTaint: false,
            scrollY: 0,
            x: 0,
            y: 0,
            backgroundColor: '#ffffff'
          },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const, compress: true },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] as any }
        };

        await html2pdf().from(element).set(opt).save();
      } catch (err: any) {
        console.error("PDF Error:", err);
      } finally {
        element.classList.remove('pdf-export-mode');
        setIsOptimizing(false);
      }
    }, 500);
  };

  const handleDownloadWord = () => {
    const printContent = cvRef.current;
    if (!printContent) return;

    const imageUrl = data.profileImage.startsWith('http') ? data.profileImage : window.location.origin + data.profileImage;

    const html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>${mode === 'cover-letter' ? 'Cover Letter' : 'CV'} - ${data.name}</title>
      <style>
        @page {
          size: 21cm 29.7cm;
          margin: 1.5cm;
        }
        body { 
          font-family: 'Calibri', 'Arial', sans-serif; 
          line-height: 1.4;
          color: #333;
        }
        .header { text-align: center; margin-bottom: 20pt; }
        .profile-img { width: 100pt; height: 100pt; border-radius: 50%; margin-bottom: 10pt; }
        h1 { font-size: 24pt; color: #000; margin-bottom: 0; text-transform: uppercase; }
        h2 { font-size: 14pt; color: ${aiTheme.color}; border-bottom: 1.5pt solid ${aiTheme.color}; margin-top: 15pt; padding-bottom: 3pt; text-transform: uppercase; font-weight: bold; }
        h3 { font-size: 11pt; color: #000; margin-top: 8pt; margin-bottom: 2pt; font-weight: bold; }
        p, li { font-size: 10pt; margin: 0; }
        .contact-info { font-size: 9pt; color: #666; margin-top: 5pt; }
        .experience-item { margin-bottom: 12pt; }
        .education-item { margin-bottom: 8pt; }
        .skill-category { font-weight: bold; }
        ul { margin-top: 3pt; margin-bottom: 3pt; padding-left: 20pt; }
      </style>
      </head>
      <body>
        <div class="header">
          ${mode !== 'cover-letter' ? `<img src="${imageUrl}" width="100" height="100" style="border-radius: 50%;" />` : ''}
          <h1>${data.name}</h1>
          <p style="font-size: 14pt; color: ${aiTheme.color}; margin-top: 0; font-weight: bold;">${data.title}</p>
          <p class="contact-info">
            ${data.email} | ${data.phone} | ${data.location}
            <br/>
            ${data.linkedin}
          </p>
        </div>

        ${mode === 'cover-letter' ? `
          <div style="margin-top: 20pt;">
            <p>To,</p>
            <p>The Hiring Manager,</p>
            <br/>
            <div style="white-space: pre-line;">${data.coverLetter}</div>
          </div>
        ` : `
          <h2>Professional Summary</h2>
          <p>${data.objective}</p>

          <h2>Work Experience</h2>
          ${data.experience.map(exp => `
            <div class="experience-item">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left"><strong>${exp.role}</strong></td>
                  <td align="right"><em>${exp.period}</em></td>
                </tr>
              </table>
              <p style="color: ${aiTheme.color}; margin: 1pt 0;"><strong>${exp.company}</strong></p>
              <ul>
                ${exp.description.map(d => `<li>${d}</li>`).join('')}
              </ul>
            </div>
          `).join('')}

          <h2>Educational Qualifications</h2>
          ${data.education.map(edu => `
            <div class="education-item">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left"><strong>${edu.degree}</strong></td>
                  <td align="right"><em>${edu.period}</em></td>
                </tr>
              </table>
              <p><strong>${edu.school}</strong> ${edu.result ? `| Result: ${edu.result}` : ''}</p>
            </div>
          `).join('')}

          <h2>Technical Skills</h2>
          ${data.skills.map(s => `
            <p style="margin-bottom: 2pt;"><span class="skill-category">${s.category}:</span> ${s.items.join(', ')}</p>
          `).join('')}

          ${data.projects.length > 0 ? `
            <h2>Key Projects</h2>
            ${data.projects.map(p => `
              <div style="margin-bottom: 8pt;">
                <strong>${p.title}</strong>
                <p>${p.description}</p>
              </div>
            `).join('')}
          ` : ''}

          <h2>Languages & Personal Info</h2>
          <p><strong>Languages:</strong> ${data.languages.map(l => `${l.name} (${l.proficiency})`).join(', ')}</p>
          <p><strong>Date of Birth:</strong> ${data.personalDetails.dob}</p>
          <p><strong>Father's Name:</strong> ${data.personalDetails.fatherName}</p>
          <p><strong>Mother's Name:</strong> ${data.personalDetails.motherName}</p>
        `}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CV_${data.name.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const updateField = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addListItem = (field: keyof typeof data, newItem: any) => {
    setData(prev => ({
      ...prev,
      [field]: [...(prev[field] as any[]), newItem]
    }));
  };

  const removeListItem = (field: keyof typeof data, index: number) => {
    setData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full md:max-w-7xl h-full md:h-[90vh] bg-white dark:bg-zinc-900 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        >
          {/* Mobile View Toggle */}
          <div className="flex md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-2 sticky top-0 z-10">
            <button 
              onClick={() => setMobileView('edit')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mobileView === 'edit' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-500'
              }`}
            >
              <Edit3 size={16} />
              Editor
            </button>
            <button 
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                mobileView === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-500'
              }`}
            >
              <Layout size={16} />
              Preview
            </button>
          </div>

          {/* Sidebar Controls */}
          <div className={`w-full md:w-[450px] bg-zinc-50 dark:bg-zinc-800/50 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full ${mobileView === 'preview' ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 md:p-6 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                  <FileText className="text-indigo-600" />
                  CV Builder
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg md:hidden">
                  <X size={20} />
                </button>
              </div>

              <div className="flex p-1 bg-zinc-200 dark:bg-zinc-800 rounded-xl mb-4">
                <button 
                  onClick={() => setMode('cv')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'cv' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600' : 'text-zinc-500'
                  }`}
                >
                  CV (Full)
                </button>
                <button 
                  onClick={() => setMode('resume')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'resume' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600' : 'text-zinc-500'
                  }`}
                >
                  Resume (1P)
                </button>
                <button 
                  onClick={() => setMode('cover-letter')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    mode === 'cover-letter' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600' : 'text-zinc-500'
                  }`}
                >
                  Cover Letter
                </button>
              </div>

              <div className="flex p-1 bg-zinc-200 dark:bg-zinc-800 rounded-xl">
                <button 
                  onClick={() => setActiveTab('templates')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'templates' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600' : 'text-zinc-500'
                  }`}
                >
                  <Layout size={16} />
                  <span className="hidden sm:inline">Templates</span>
                  <span className="sm:hidden">Design</span>
                </button>
                <button 
                  onClick={() => setActiveTab('edit')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'edit' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600' : 'text-zinc-500'
                  }`}
                >
                  <Edit3 size={16} />
                  <span className="hidden sm:inline">Edit Info</span>
                  <span className="sm:hidden">Edit</span>
                </button>
                <button 
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                    activeTab === 'ai' ? 'bg-white dark:bg-zinc-700 shadow-sm text-indigo-600' : 'text-zinc-500'
                  }`}
                >
                  <Sparkles size={16} />
                  AI Help
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {activeTab === 'templates' && (
                <div className="space-y-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">Select Layout Template</label>
                    <div className="grid gap-3">
                      {(['modern', 'classic', 'minimal', 'executive', 'professional'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTemplate(t)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left group ${
                            template === t 
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 shadow-sm' 
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${template === t ? 'bg-indigo-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                            <Layout size={18} />
                          </div>
                          <div className="flex-grow">
                            <span className="font-bold capitalize block text-sm">{t}</span>
                            <span className="text-[10px] text-zinc-500 leading-tight block mt-0.5">
                              {t === 'modern' && 'Sleek, tech-focused design with color accents.'}
                              {t === 'classic' && 'Timeless, serif-based layout for stability.'}
                              {t === 'minimal' && 'Clean, distraction-free and ATS friendly.'}
                              {t === 'executive' && 'Premium header with sophisticated spacing.'}
                              {t === 'professional' && 'Formal two-column layout for experienced pros.'}
                            </span>
                          </div>
                          {template === t && <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white"><CheckCircle2 size={12} /></div>}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">Brand Color & Accent</label>
                    <div className="flex flex-wrap gap-3">
                      {['#4f46e5', '#3b82f6', '#2563eb', '#059669', '#d33d44', '#7c3aed', '#18181b'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setAiTheme(prev => ({ ...prev, color: c }))}
                          className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-110 active:scale-95 ${
                            aiTheme.color === c ? 'border-white dark:border-zinc-800 ring-2 ring-indigo-500' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                      <div className="relative">
                        <input 
                          type="color" 
                          value={aiTheme.color} 
                          onChange={(e) => setAiTheme(prev => ({ ...prev, color: e.target.value }))}
                          className="w-10 h-10 rounded-full border-none p-0 cursor-pointer overflow-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 block">Typography Style</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Inter', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Lora', 'Playfair Display'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setAiTheme(prev => ({ ...prev, font: f }))}
                          className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                            aiTheme.font === f 
                              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600' 
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                          }`}
                          style={{ fontFamily: f.includes('Display') || f === 'Lora' ? `"${f}", serif` : `"${f}", sans-serif` }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-600 rounded-lg text-white">
                        <Sparkles size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-indigo-900 dark:text-indigo-100">AI CV Optimizer</h3>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">Powered by Gemini AI</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Job Description / Requirements</label>
                      <textarea 
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        placeholder="Paste the job description or requirements here to tailor your CV..."
                        className="cv-input h-32 resize-none text-sm"
                      />
                      <p className="text-[10px] text-zinc-400">AI will rewrite your content to match these requirements perfectly.</p>
                    </div>

                    <button 
                      onClick={optimizeWithAI}
                      disabled={isOptimizing}
                      className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isOptimizing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Optimizing...
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          Tailor My {mode === 'cv' ? 'CV' : 'Cover Letter'}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">AI Smart Tips</h4>
                    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5" />
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          AI will suggest a professional theme color and font based on the industry.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5" />
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          Cover Letter mode is optimized for 1 page, while CV mode allows for 2 pages.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'edit' && (
                <div className="space-y-8">
                  {/* 1. Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <User size={14} /> 1. Personal Information
                    </h3>
                    <div className="space-y-3">
                      <input type="text" value={data.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Full Name" className="cv-input" />
                      <input type="text" value={data.title} onChange={(e) => updateField('title', e.target.value)} placeholder="Professional Title" className="cv-input" />
                      <input type="text" value={data.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Phone Number" className="cv-input" />
                      <input type="email" value={data.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email Address" className="cv-input" />
                      <input type="text" value={data.location} onChange={(e) => updateField('location', e.target.value)} placeholder="Address (City, Country)" className="cv-input" />
                      <input type="text" value={data.linkedin} onChange={(e) => updateField('linkedin', e.target.value)} placeholder="LinkedIn / Portfolio" className="cv-input" />
                    </div>
                  </div>

                  {/* 2. Career Objective */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <Settings size={14} /> 2. Career Objective
                    </h3>
                    <textarea value={data.objective} onChange={(e) => updateField('objective', e.target.value)} rows={3} placeholder="Short summary about your goals..." className="cv-input resize-none" />
                  </div>

                  {/* 2.1 Cover Letter */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <FileText size={14} /> 2.1 Cover Letter
                    </h3>
                    <textarea value={data.coverLetter} onChange={(e) => updateField('coverLetter', e.target.value)} rows={8} placeholder="Write your cover letter here..." className="cv-input resize-none" />
                  </div>

                  {/* 3. Education */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <GraduationCap size={14} /> 3. Education
                      </h3>
                      <button onClick={() => addListItem('education', { degree: '', school: '', period: '' })} className="text-indigo-600 hover:text-indigo-700"><Plus size={16} /></button>
                    </div>
                    {data.education.map((edu, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 space-y-2 relative group">
                        <button onClick={() => removeListItem('education', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        <input type="text" value={edu.degree} onChange={(e) => {
                          const newList = [...data.education];
                          newList[i].degree = e.target.value;
                          updateField('education', newList);
                        }} placeholder="Degree" className="cv-input-sm" />
                        <input type="text" value={edu.school} onChange={(e) => {
                          const newList = [...data.education];
                          newList[i].school = e.target.value;
                          updateField('education', newList);
                        }} placeholder="Institution" className="cv-input-sm" />
                        <input type="text" value={edu.period} onChange={(e) => {
                          const newList = [...data.education];
                          newList[i].period = e.target.value;
                          updateField('education', newList);
                        }} placeholder="Year / Period" className="cv-input-sm" />
                        <input type="text" value={edu.result || ''} onChange={(e) => {
                          const newList = [...data.education];
                          newList[i].result = e.target.value;
                          updateField('education', newList);
                        }} placeholder="Result (e.g. CGPA 3.8)" className="cv-input-sm" />
                      </div>
                    ))}
                  </div>

                  {/* 4. Work Experience */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Briefcase size={14} /> 4. Work Experience
                      </h3>
                      <button onClick={() => addListItem('experience', { company: '', role: '', period: '', description: [] })} className="text-indigo-600 hover:text-indigo-700"><Plus size={16} /></button>
                    </div>
                    {data.experience.map((exp, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 space-y-2 relative group">
                        <button onClick={() => removeListItem('experience', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        <input type="text" value={exp.company} onChange={(e) => {
                          const newList = [...data.experience];
                          newList[i].company = e.target.value;
                          updateField('experience', newList);
                        }} placeholder="Company Name" className="cv-input-sm" />
                        <input type="text" value={exp.role} onChange={(e) => {
                          const newList = [...data.experience];
                          newList[i].role = e.target.value;
                          updateField('experience', newList);
                        }} placeholder="Job Title" className="cv-input-sm" />
                        <input type="text" value={exp.period} onChange={(e) => {
                          const newList = [...data.experience];
                          newList[i].period = e.target.value;
                          updateField('experience', newList);
                        }} placeholder="Duration" className="cv-input-sm" />
                      </div>
                    ))}
                  </div>

                  {/* 5. Skills */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <Award size={14} /> 5. Skills
                    </h3>
                    {data.skills.map((skillGroup, i) => (
                      <div key={i} className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">{skillGroup.category}</label>
                        <textarea 
                          value={skillGroup.items.join(', ')} 
                          onChange={(e) => {
                            const newList = [...data.skills];
                            newList[i].items = e.target.value.split(',').map(s => s.trim());
                            updateField('skills', newList);
                          }}
                          placeholder="Skill 1, Skill 2..."
                          className="cv-input-sm resize-none"
                        />
                      </div>
                    ))}
                  </div>

                  {/* 6. Certifications */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Award size={14} /> 6. Certifications
                      </h3>
                      <button onClick={() => addListItem('certifications', '')} className="text-indigo-600 hover:text-indigo-700"><Plus size={16} /></button>
                    </div>
                    <div className="space-y-2">
                      {data.certifications.map((cert, i) => (
                        <div key={i} className="flex gap-2 group">
                          <input 
                            type="text" 
                            value={cert} 
                            onChange={(e) => {
                              const newList = [...data.certifications];
                              newList[i] = e.target.value;
                              updateField('certifications', newList);
                            }} 
                            placeholder="Certification Name" 
                            className="cv-input-sm" 
                          />
                          <button onClick={() => removeListItem('certifications', i)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7. Projects */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Globe size={14} /> 7. Projects
                      </h3>
                      <button onClick={() => addListItem('projects', { title: '', description: '', tech: '' })} className="text-indigo-600 hover:text-indigo-700"><Plus size={16} /></button>
                    </div>
                    {data.projects.map((proj, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 space-y-2 relative group">
                        <button onClick={() => removeListItem('projects', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        <input type="text" value={proj.title} onChange={(e) => {
                          const newList = [...data.projects];
                          newList[i].title = e.target.value;
                          updateField('projects', newList);
                        }} placeholder="Project Title" className="cv-input-sm" />
                        <textarea value={proj.description} onChange={(e) => {
                          const newList = [...data.projects];
                          newList[i].description = e.target.value;
                          updateField('projects', newList);
                        }} placeholder="Description" className="cv-input-sm resize-none" />
                      </div>
                    ))}
                  </div>

                  {/* 8. Languages */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Languages size={14} /> 8. Languages
                      </h3>
                      <button onClick={() => addListItem('languages', { name: '', proficiency: '' })} className="text-indigo-600 hover:text-indigo-700"><Plus size={16} /></button>
                    </div>
                    {data.languages.map((lang, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2 relative group">
                        <input type="text" value={lang.name} onChange={(e) => {
                          const newList = [...data.languages];
                          newList[i].name = e.target.value;
                          updateField('languages', newList);
                        }} placeholder="Language" className="cv-input-sm" />
                        <input type="text" value={lang.proficiency} onChange={(e) => {
                          const newList = [...data.languages];
                          newList[i].proficiency = e.target.value;
                          updateField('languages', newList);
                        }} placeholder="Level" className="cv-input-sm" />
                        <button onClick={() => removeListItem('languages', i)} className="absolute -right-6 top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>

                  {/* 9. Personal Details */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                      <Users size={14} /> 9. Personal Details
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" value={data.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Full Name" className="cv-input-sm" />
                      <input type="text" value={data.personalDetails.fatherName} onChange={(e) => updateField('personalDetails', { ...data.personalDetails, fatherName: e.target.value })} placeholder="Father's Name" className="cv-input-sm" />
                      <input type="text" value={data.personalDetails.motherName} onChange={(e) => updateField('personalDetails', { ...data.personalDetails, motherName: e.target.value })} placeholder="Mother's Name" className="cv-input-sm" />
                      <input type="text" value={data.personalDetails.dob} onChange={(e) => updateField('personalDetails', { ...data.personalDetails, dob: e.target.value })} placeholder="Date of Birth" className="cv-input-sm" />
                      <input type="text" value={data.personalDetails.nationality} onChange={(e) => updateField('personalDetails', { ...data.personalDetails, nationality: e.target.value })} placeholder="Nationality" className="cv-input-sm" />
                      <input type="text" value={data.personalDetails.religion} onChange={(e) => updateField('personalDetails', { ...data.personalDetails, religion: e.target.value })} placeholder="Religion" className="cv-input-sm" />
                    </div>
                  </div>

                  {/* 10. References */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                        <Users size={14} /> 10. References
                      </h3>
                      <button onClick={() => addListItem('references', { name: '', position: '', contact: '' })} className="text-indigo-600 hover:text-indigo-700"><Plus size={16} /></button>
                    </div>
                    {data.references.map((ref, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 space-y-2 relative group">
                        <button onClick={() => removeListItem('references', i)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                        <input type="text" value={ref.name} onChange={(e) => {
                          const newList = [...data.references];
                          newList[i].name = e.target.value;
                          updateField('references', newList);
                        }} placeholder="Reference Name" className="cv-input-sm" />
                        <input type="text" value={ref.position} onChange={(e) => {
                          const newList = [...data.references];
                          newList[i].position = e.target.value;
                          updateField('references', newList);
                        }} placeholder="Position" className="cv-input-sm" />
                        <input type="text" value={ref.contact} onChange={(e) => {
                          const newList = [...data.references];
                          newList[i].contact = e.target.value;
                          updateField('references', newList);
                        }} placeholder="Contact Info" className="cv-input-sm" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 md:p-6 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handlePrint} 
                  disabled={isOptimizing}
                  className="btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 text-sm"
                >
                  {isOptimizing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}
                  Download PDF
                </button>
                <button onClick={handleDownloadWord} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 font-bold text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  <FileText size={18} /> Word
                </button>
              </div>
              <button 
                onClick={handleReset}
                className="w-full py-2 text-[10px] uppercase tracking-widest font-bold text-zinc-400 hover:text-red-500 transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className={`flex-grow overflow-y-auto p-4 md:p-12 bg-zinc-100 dark:bg-zinc-950/50 custom-scrollbar ${mobileView === 'edit' ? 'hidden md:block' : 'block'}`}>
            <div 
              ref={cvRef} 
              className={`cv-preview-container cv-preview-shadow mx-auto ${mode !== 'cv' ? 'h-[296.8mm] overflow-hidden' : 'min-h-[296.8mm]'}`}
              style={{ 
                fontFamily: `"${aiTheme.font}", ${template === 'classic' || template === 'executive' || aiTheme.font === 'Lora' || aiTheme.font === 'Playfair Display' ? 'serif' : 'sans-serif'}`,
                '--theme-color': aiTheme.color 
              } as any}
            >
              {/* ATS Optimized Header */}
              <div className={`mb-8 pb-6 border-b-2 flex flex-col md:flex-row items-center gap-6 md:gap-8 ${template === 'classic' ? 'border-zinc-900 text-center flex-col' : ''} ${template === 'executive' ? 'border-zinc-800 text-left bg-zinc-50 -mx-6 md:-mx-16 p-6 md:p-16 mb-12' : ''}`} style={{ borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>
                {template !== 'minimal' && (
                  <img src={data.profileImage} alt={data.name} className={`object-cover border-2 ${template === 'classic' ? 'w-24 h-24 rounded-full border-zinc-900' : ''} ${template === 'executive' ? 'w-32 h-32 rounded-lg border-zinc-800 rotate-2' : 'w-28 h-28 rounded-2xl'}`} style={{ borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }} referrerPolicy="no-referrer" />
                )}
                <div className={template === 'classic' ? 'text-center w-full' : 'flex-grow text-center md:text-left'}>
                  <h1 className={`text-2xl md:text-4xl font-extrabold mb-1 tracking-tight text-zinc-900 uppercase ${template === 'executive' ? 'italic' : ''}`}>{data.name}</h1>
                  <p className={`text-base md:text-lg font-bold uppercase tracking-wide ${template === 'classic' || template === 'executive' ? 'text-zinc-900' : ''}`} style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>{data.title}</p>
                  <div className={`mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-zinc-700 font-bold ${template === 'classic' ? 'justify-center' : 'justify-center md:justify-start'}`}>
                    <span className="flex items-center gap-1.5"><Mail size={13} className="text-zinc-400" /> {data.email}</span>
                    <span className="flex items-center gap-1.5"><Phone size={13} className="text-zinc-400" /> {data.phone}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-zinc-400" /> {data.location}</span>
                  </div>
                </div>
              </div>

              <div className={mode === 'cover-letter' ? 'cv-grid-single gap-6' : template === 'professional' || mode === 'resume' ? 'cv-grid-two-column' : 'cv-grid-single gap-10'}>
                {(template === 'professional' || mode === 'resume') && mode !== 'cover-letter' ? (
                  <>
                    {/* Sidebar Column */}
                    <div className="cv-column-sidebar">
                      {/* Skills */}
                      <div className="cv-section">
                        <h2 className="cv-section-title" style={{ borderColor: template === 'professional' ? '#000' : aiTheme.color, color: template === 'professional' ? '#000' : aiTheme.color }}>Skills</h2>
                        <div className="space-y-3">
                          {data.skills.map((s, i) => (
                            <div key={i}>
                              <div className="text-[10px] font-bold text-zinc-900 uppercase tracking-tighter">{s.category}</div>
                              <p className="text-[10px] text-zinc-600 leading-tight">{s.items.join(', ')}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Languages */}
                      <div className="cv-section">
                        <h2 className="cv-section-title" style={{ borderColor: template === 'professional' ? '#000' : aiTheme.color, color: template === 'professional' ? '#000' : aiTheme.color }}>Languages</h2>
                        <div className="space-y-1">
                          {data.languages.map((lang, i) => (
                            <div key={i} className="flex justify-between text-[11px]">
                              <span className="font-bold">{lang.name}</span>
                              <span className="text-zinc-500">{lang.proficiency}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Personal Details - Reduced in Resume mode */}
                      <div className="cv-section">
                        <h2 className="cv-section-title" style={{ borderColor: template === 'professional' ? '#000' : aiTheme.color, color: template === 'professional' ? '#000' : aiTheme.color }}>Details</h2>
                        <div className="space-y-1.5 text-[10px]">
                          {mode === 'cv' && (
                            <>
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-800">Father's Name:</span>
                                <span className="text-zinc-600">{data.personalDetails.fatherName}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-bold text-zinc-800">Mother's Name:</span>
                                <span className="text-zinc-600">{data.personalDetails.motherName}</span>
                              </div>
                            </>
                          )}
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-800">Date of Birth:</span>
                            <span className="text-zinc-600">{data.personalDetails.dob}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-zinc-800">Nationality:</span>
                            <span className="text-zinc-600">{data.personalDetails.nationality}</span>
                          </div>
                        </div>
                      </div>

                      {/* References */}
                      {data.references.length > 0 && (
                        <div className="cv-section">
                          <h2 className="cv-section-title" style={{ borderColor: template === 'professional' ? '#000' : aiTheme.color, color: template === 'professional' ? '#000' : aiTheme.color }}>References</h2>
                          <div className="space-y-3">
                            {data.references.map((ref, i) => (
                              <div key={i} className="text-[10px]">
                                <div className="font-bold">{ref.name}</div>
                                <div className="text-zinc-600">{ref.position}</div>
                                <div className="text-zinc-500">{ref.contact}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Main Column */}
                    <div className="cv-column-main">
                      {/* Objective */}
                      <div className="cv-section">
                        <h2 className="cv-section-title" style={{ borderColor: template === 'professional' ? '#000' : aiTheme.color, color: template === 'professional' ? '#000' : aiTheme.color }}>Summary</h2>
                        <p className="text-[12px] leading-relaxed text-zinc-700">{data.objective}</p>
                      </div>

                      {/* Experience */}
                      <div className="cv-section">
                        <h2 className="cv-section-title" style={{ borderColor: template === 'professional' ? '#000' : aiTheme.color, color: template === 'professional' ? '#000' : aiTheme.color }}>Experience</h2>
                        {data.experience.slice(0, mode === 'resume' ? 2 : undefined).map((exp, i) => (
                          <div key={i} className="mb-4">
                            <div className="cv-item-header">
                              <span className="cv-item-title text-[13px]">{exp.role}</span>
                              <span className="cv-item-date">{exp.period}</span>
                            </div>
                            <div className="cv-item-subtitle text-[12px] mb-1 font-bold text-zinc-800">{exp.company}</div>
                            <ul className="cv-list space-y-0.5">
                              {exp.description.slice(0, mode === 'resume' ? 3 : undefined).map((d, j) => <li key={j} className="text-[11px] leading-snug">{d}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Education */}
                      <div className="cv-section">
                        <h2 className="cv-section-title" style={{ borderColor: template === 'professional' ? '#000' : aiTheme.color, color: template === 'professional' ? '#000' : aiTheme.color }}>Education</h2>
                        {data.education.map((edu, i) => (
                          <div key={i} className="mb-3">
                            <div className="cv-item-header">
                              <span className="cv-item-title text-[12px]">{edu.degree}</span>
                              <span className="cv-item-date">{edu.period}</span>
                            </div>
                            <div className="text-[11px] font-bold text-zinc-700">{edu.school}</div>
                            {edu.result && <div className="text-[10px] font-bold text-zinc-500">{edu.result}</div>}
                          </div>
                        ))}
                      </div>

                      {/* Projects */}
                      {data.projects.length > 0 && (
                        <div className="cv-section">
                          <h2 className="cv-section-title" style={{ borderColor: template === 'professional' ? '#000' : aiTheme.color, color: template === 'professional' ? '#000' : aiTheme.color }}>Projects</h2>
                          {data.projects.slice(0, mode === 'resume' ? 2 : undefined).map((proj, i) => (
                            <div key={i} className="mb-2">
                              <div className="text-[12px] font-bold">{proj.title}</div>
                              <p className="text-[11px] text-zinc-600 leading-tight">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Signature Section - Only for 2-page CV */}
                      {mode === 'cv' && (
                        <div className="mt-auto pt-8 flex flex-col items-end">
                          <div className="w-32 border-b border-zinc-300 pb-1 mb-1">
                            <img 
                              src="https://i.postimg.cc/sgf0Hgn2/image.png" 
                              alt="Signature" 
                              className="h-10 w-auto object-contain mx-auto" 
                              style={{ filter: 'grayscale(1)' }} 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Authorized Signature</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-8">
                    {mode === 'cv' && (
                      <>
                        {/* Objective */}
                        <div className="cv-section">
                          <h2 className="cv-section-title" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color, borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>{mode === 'cv' ? 'Career Objective' : 'Personal Statement'}</h2>
                          <p className="text-[12px] leading-relaxed text-zinc-700">{data.objective}</p>
                        </div>

                        {/* Experience */}
                        <div className="cv-section">
                          <h2 className="cv-section-title" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color, borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>Professional Experience</h2>
                          {data.experience.map((exp, i) => (
                            <div key={i} className="mb-5">
                              <div className="cv-item-header">
                                <span className="cv-item-title text-[13px]">{exp.role}</span>
                                <span className="cv-item-date">{exp.period}</span>
                              </div>
                              <div className="cv-item-subtitle text-[12px] mb-1.5" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>{exp.company}</div>
                              <ul className="cv-list space-y-1">
                                {exp.description.map((d, j) => <li key={j} className="text-[11.5px] leading-relaxed">{d}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Education in CV mode (moved here for single column flow) */}
                        <div className="cv-section">
                          <h2 className="cv-section-title" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color, borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>Education</h2>
                          {data.education.map((edu, i) => (
                            <div key={i} className="mb-3">
                              <div className="cv-item-header">
                                <span className="cv-item-title">{edu.degree}</span>
                                <span className="cv-item-date">{edu.period}</span>
                              </div>
                              <div className="cv-item-subtitle" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>{edu.school}</div>
                              {edu.result && <div className="text-[11px] font-bold text-zinc-600 mt-0.5">{edu.result}</div>}
                            </div>
                          ))}
                        </div>

                        {/* Projects */}
                        {data.projects.length > 0 && (
                          <div className="cv-section">
                            <h2 className="cv-section-title" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color, borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>Projects</h2>
                            {data.projects.map((proj, i) => (
                              <div key={i} className="mb-3">
                                <div className="cv-item-title">{proj.title}</div>
                                <p className="text-[12px] text-zinc-600">{proj.description}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Skills in CV mode */}
                        <div className="cv-section">
                          <h2 className="cv-section-title" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color, borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>Skills</h2>
                          <div className="grid grid-cols-2 gap-4">
                            {data.skills.map((s, i) => (
                              <div key={i} className="mb-2">
                                <div className="text-[11px] font-bold text-zinc-900">{s.category}</div>
                                <p className="text-[11px] text-zinc-600">{s.items.join(', ')}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Personal Details in CV mode */}
                        <div className="cv-section">
                          <h2 className="cv-section-title" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color, borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>Personal Details</h2>
                          <div className="space-y-2">
                            <div className="personal-detail-item">
                              <span className="personal-detail-label">Name:</span>
                              <span className="personal-detail-value">{data.name}</span>
                            </div>
                            <div className="personal-detail-item">
                              <span className="personal-detail-label">Father's Name:</span>
                              <span className="personal-detail-value">{data.personalDetails.fatherName}</span>
                            </div>
                            <div className="personal-detail-item">
                              <span className="personal-detail-label">Mother's Name:</span>
                              <span className="personal-detail-value">{data.personalDetails.motherName}</span>
                            </div>
                            <div className="personal-detail-item">
                              <span className="personal-detail-label">Date of Birth:</span>
                              <span className="personal-detail-value">{data.personalDetails.dob}</span>
                            </div>
                            <div className="personal-detail-item">
                              <span className="personal-detail-label">Nationality:</span>
                              <span className="personal-detail-value">{data.personalDetails.nationality}</span>
                            </div>
                            <div className="personal-detail-item">
                              <span className="personal-detail-label">Religion:</span>
                              <span className="personal-detail-value">{data.personalDetails.religion}</span>
                            </div>
                          </div>
                        </div>

                        {/* References in CV mode */}
                        {data.references.length > 0 && (
                          <div className="cv-section">
                            <h2 className="cv-section-title" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color, borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>References</h2>
                            <div className="space-y-4">
                              {data.references.map((ref, i) => (
                                <div key={i} className="mb-2 text-[11px]">
                                  <div className="font-bold">{ref.name}</div>
                                  <div className="text-zinc-600">{ref.position}</div>
                                  <div className="text-zinc-500">{ref.contact}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Signature Section */}
                        {mode === 'cv' && (
                          <div className="mt-12 flex flex-col items-end">
                            <div className="w-32 border-b border-zinc-300 pb-1 mb-1">
                              <img 
                                src="https://i.postimg.cc/sgf0Hgn2/image.png" 
                                alt="Signature" 
                                className="h-10 w-auto object-contain mx-auto" 
                                style={{ filter: 'grayscale(1)' }} 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Authorized Signature</span>
                          </div>
                        )}
                      </>
                    )}

                    {mode === 'cover-letter' && (
                      <div className="space-y-6">
                        <div className="text-[12px] text-zinc-500 mb-8">
                          Date: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        
                        <div className="cv-section">
                          <h2 className="cv-section-title" style={{ color: template === 'classic' || template === 'executive' ? undefined : aiTheme.color, borderColor: template === 'classic' || template === 'executive' ? undefined : aiTheme.color }}>Cover Letter</h2>
                          <div className="text-[13px] leading-relaxed text-zinc-700 whitespace-pre-wrap">
                            {data.coverLetter}
                          </div>
                        </div>

                        {/* Signature Section for Cover Letter - Hidden by default for 1-pagers */}
                        {mode === 'cv' && (
                          <div className="mt-12 flex flex-col items-end">
                            <div className="w-32 border-b border-zinc-300 pb-1 mb-1">
                              <img 
                                src="https://i.postimg.cc/sgf0Hgn2/image.png" 
                                alt="Signature" 
                                className="h-10 w-auto object-contain mx-auto" 
                                style={{ filter: 'grayscale(1)' }} 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Authorized Signature</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button onClick={onClose} className="hidden md:flex absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/20">
            <X size={24} />
          </button>

          {/* Mobile Floating Download Button */}
          <div className="md:hidden fixed bottom-6 right-6 z-50">
            <button 
              onClick={handlePrint}
              disabled={isOptimizing}
              className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-50"
            >
              {isOptimizing ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Download size={24} />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
