"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClaimContext } from '@/context/ClaimContext';

export default function ReviewPage() {
  const { caseData } = useClaimContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!caseData) {
    return (
      <div className="pt-32 text-center">
        <p>No active case data found.</p>
        <button onClick={() => router.push('/')} className="mt-4 text-primary hover:underline">Go back to initiate a claim</button>
      </div>
    );
  }

  const handleAdjudicate = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/adjudicate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });

      if (!res.ok) {
        throw new Error('Adjudication failed');
      }

      const verdict = await res.json();
      // Pass verdict to context or local storage? 
      // We can pass it via session storage for the simple flow
      sessionStorage.setItem('verdict', JSON.stringify(verdict));
      router.push('/claim/verdict');
    } catch (error) {
      console.error(error);
      alert("Adjudication Engine failed. See console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold shadow-md">1</div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Documents</span>
        </div>
        <div className="h-px flex-grow bg-primary mx-4 mb-6"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">2</div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Review</span>
        </div>
        <div className="h-px flex-grow bg-outline-variant/30 mx-4 mb-6"></div>
        <div className="flex flex-col items-center gap-2 opacity-50">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold">3</div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Verdict</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-12 space-y-8">
          <section className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-sm">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Review Parsed Case</h1>
              <p className="text-on-surface-variant">Our AI has extracted the following information from your uploaded documents. Please verify before finalizing.</p>
            </div>

            <div className="space-y-6">
              <div className="bg-surface-container-low rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                 <div>
                   <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Member ID</p>
                   <p className="font-bold mt-1">{caseData.member_id}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Member Name</p>
                   <p className="font-bold mt-1">{caseData.member_name}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Treatment Date</p>
                   <p className="font-bold mt-1">{caseData.treatment_date}</p>
                 </div>
                 <div>
                   <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Claim Auth Total</p>
                   <p className="font-bold text-primary mt-1">${caseData.claim_amount}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-low rounded-xl p-6">
                    <h3 className="font-bold mb-4 border-b border-outline/10 pb-2 text-primary">Prescription Extraction</h3>
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(caseData.documents.prescription || {}, null, 2)}
                    </pre>
                </div>
                <div className="bg-surface-container-low rounded-xl p-6">
                    <h3 className="font-bold mb-4 border-b border-outline/10 pb-2 text-primary">Hospital Bill Extraction</h3>
                    <pre className="text-xs overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(caseData.documents.bill || {}, null, 2)}
                    </pre>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8">
                <button 
                  onClick={() => router.back()}
                  className="px-8 py-3 rounded-lg font-bold text-on-surface hover:bg-surface-container-high transition-all"
                >
                  Back to Edit
                </button>
                <button 
                  onClick={handleAdjudicate}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-primary-container disabled:opacity-50 text-on-primary px-10 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all"
                >
                  {loading ? 'Executing Adjudication Node Graph...' : 'Submit to Claim Engine Run'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
