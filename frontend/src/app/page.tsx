"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useClaimContext } from '@/context/ClaimContext';
import { supabase } from '@/lib/supabase';

export default function IntakePage() {
  const [memberId, setMemberId] = useState('');
  const [memberName, setMemberName] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Analyze Case with AI');
  const router = useRouter();

  // Wake up Render free-tier backend upon loading the site
  useEffect(() => {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plum-claims.onrender.com';
    fetch(API_BASE_URL).catch(() => {});
  }, []);
  const { setCaseData } = useClaimContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingStatus('AI Analyzing Documents...');

    // If Render takes longer than 8s, update text to notify user of cold start
    const coldStartTimer = setTimeout(() => {
      setLoadingStatus('Waking up server... (This takes ~50s on free tier)');
    }, 8000);
    
    try {
      const formData = new FormData();
      formData.append('member_id', memberId);
      formData.append('member_name', memberName);
      formData.append('context', description); // Sent as 'context' to backend
      formData.append('treatment_date', new Date().toISOString().split('T')[0]);
      files.forEach(file => {
        formData.append('files', file);
      });

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plum-claims.onrender.com';

      // Make the call to FastAPI backend
      const res = await fetch(`${API_BASE_URL}/api/v1/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Extraction via AI failed');
      }

      const data = await res.json();
      setCaseData(data.case);
      router.push('/claim/review');
    } catch (error) {
      console.error(error);
      alert(`AI Extraction Error: ${error instanceof Error ? error.message : 'Unknown Error'}`);
    } finally {
      clearTimeout(coldStartTimer);
      setLoading(false);
      setLoadingStatus('Analyze Case with AI');
    }
  };

  return (
    <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">1</div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Documents</span>
        </div>
        <div className="h-px flex-grow bg-outline-variant mx-4 mb-6"></div>
        <div className="flex flex-col items-center gap-2 opacity-50">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold">2</div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Review</span>
        </div>
        <div className="h-px flex-grow bg-outline-variant/30 mx-4 mb-6"></div>
        <div className="flex flex-col items-center gap-2 opacity-50">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold">3</div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Verdict</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12 space-y-8">
          <section className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">Submit New Claim</h1>
              <p className="text-on-surface-variant text-lg">Upload your medical documents and our AI engine will handle the rest.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Member ID</label>
                  <input required value={memberId} onChange={e => setMemberId(e.target.value)} className="w-full h-12 bg-surface-container-low rounded-xl px-4 border border-outline/20 focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="EMP-1234" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Patient Name</label>
                  <input required value={memberName} onChange={e => setMemberName(e.target.value)} className="w-full h-12 bg-surface-container-low rounded-xl px-4 border border-outline/20 focus:ring-2 focus:ring-primary focus:outline-none transition-all" placeholder="Alexandra Smith" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary">Claim Context / Medical Notes</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full h-24 bg-surface-container-low rounded-xl p-4 border border-outline/20 focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none" placeholder="Provide context about the disease, treatment, or specific requests..." />
                </div>
              </div>

              <div className="mt-8">
                <label className="relative flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-2xl p-12 bg-primary/5 hover:bg-primary/10 hover:border-primary transition-all cursor-pointer group">
                  <div className="bg-surface-container-lowest w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                  </div>
                  <h3 className="text-lg font-bold mb-2">Drag and drop files here</h3>
                  <p className="text-on-surface-variant text-sm mb-6">Invoices, Prescriptions, Laboratory Reports</p>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/50">Supported: PDF, JPG, PNG</span>
                  <input type="file" multiple required className="hidden" onChange={handleFileChange} />
                </label>
                {files.length > 0 && (
                  <div className="mt-4 p-4 bg-surface-container-low rounded-xl text-sm font-medium space-y-2">
                    <p className="text-primary font-bold uppercase text-xs tracking-widest mb-2">Attached Files:</p>
                    {files.map((file, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-on-surface-variant">description</span>
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end pt-8">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary px-10 py-3 rounded-lg font-bold shadow-lg transition-transform active:scale-95"
                >
                  {loadingStatus}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
