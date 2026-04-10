"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Verdict = {
  case_id: string;
  decision: 'APPROVED' | 'PARTIAL' | 'REJECTED' | 'MANUAL_REVIEW';
  approved_amount: number;
  reasons: string[];
  notes: string;
};

export default function VerdictPage() {
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('verdict');
    if (stored) {
      try {
        setVerdict(JSON.parse(stored));
      } catch (e) { console.error(e) }
    }
  }, []);

  if (!verdict) {
    return (
      <div className="pt-32 text-center">
        <p>No verdict data found.</p>
        <button onClick={() => router.push('/')} className="mt-4 text-primary hover:underline">Start entirely new claim</button>
      </div>
    );
  }

  const isApproved = verdict.decision === 'APPROVED';
  const isPartial = verdict.decision === 'PARTIAL';
  const isRejected = verdict.decision === 'REJECTED';

  let titleText = "Claim Processed";
  if (isApproved) titleText = "Claim Approved!";
  if (isPartial) titleText = "Claim Partially Approved";
  if (isRejected) titleText = "Claim Rejected";

  return (
    <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
          Claim ID: {verdict.case_id || '#CAD-PENDING'}
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">
          {titleText}
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
          {verdict.notes || "Your claim has been fully processed through the intelligent Plum Engine."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-surface-container-lowest p-8 rounded-[20px] signature-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
            <div className="flex justify-between items-start mb-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`material-symbols-outlined ${isRejected ? 'text-error' : 'text-tertiary'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isRejected ? 'cancel' : 'check_circle'}
                  </span>
                  <span className={`text-sm font-bold uppercase tracking-wider ${isRejected ? 'text-error' : 'text-tertiary'}`}>
                    {isRejected ? 'Payment Denied' : 'Payment Finalized'}
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-on-surface">${verdict.approved_amount.toFixed(2)}</h2>
                <p className="text-on-surface-variant">{isRejected ? 'Covered Amount' : 'Reimbursed Amount'}</p>
              </div>
              {!isRejected && (
                <button className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-container transition-all">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download Receipt
                </button>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg text-on-surface border-b border-surface-container-low pb-2">Breakdown</h3>
              {/* This breakdown is simplified as the backend only gives approved_amount directly */}
              <div className="flex justify-between items-center py-1">
                <span className="text-on-surface-variant">Adjudicated Final Amount</span>
                <span className={`font-medium ${isRejected ? 'text-error' : 'text-tertiary'}`}>
                   ${verdict.approved_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-surface-container mt-4">
                <span className="font-bold text-on-surface">Status</span>
                <span className={`text-xl font-extrabold ${isRejected ? 'text-error' : 'text-primary'}`}>
                  {verdict.decision}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-[20px] space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary signature-shadow">
                <span className="material-symbols-outlined">info</span>
              </div>
              <h3 className="text-xl font-bold">
                {isRejected ? 'Why was this rejected?' : 'Adjudication Log'}
              </h3>
            </div>
            <div className="pt-4">
              {verdict.reasons && verdict.reasons.length > 0 ? (
                <div className="space-y-4">
                  {verdict.reasons.map((reason, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-bold text-sm uppercase tracking-widest text-on-surface-variant">Engine Flag {i + 1}</p>
                      <p className="text-on-surface-variant leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-on-surface-variant">All checks passed seamlessly with no exclusions triggered.</p>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-surface-container-highest p-6 rounded-[20px] flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant uppercase">Processed On</p>
              <p className="font-bold text-lg">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-[20px] border-l-4 border-primary">
            <h4 className="font-bold text-lg mb-4">What's next?</h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-primary font-bold">01</span>
                <p className="text-on-surface-variant text-sm">
                  {isRejected 
                    ? "The claim has been officially filed as closed with 0 payout."
                    : "The funds will appear in your bank account ending in **8842 within 3-5 business days."}
                </p>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">02</span>
                <p className="text-on-surface-variant text-sm">You'll receive an automated notification.</p>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/')} 
              className="w-full py-4 bg-surface-container-high hover:bg-surface-container text-on-surface font-bold rounded-xl transition-colors active:scale-[0.98]"
            >
              Return to Home
            </button>
            <button className="w-full py-4 text-primary font-bold hover:underline">
              Something wrong? File an Appeal
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
