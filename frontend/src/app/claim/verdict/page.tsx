"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Verdict = {
  case_id: string;
  decision: 'APPROVED' | 'PARTIAL' | 'REJECTED' | 'MANUAL_REVIEW';
  total_claim_amount: number;
  approved_amount: number;
  rejection_reasons: string[];
  flags: string[];
  deduction_details: Array<{
    category: string;
    amount: number;
    reason: string;
  }>;
  notes: string;
};

import VerdictBanner from '@/components/claim/VerdictBanner';
import FinancialAuditSummary from '@/components/claim/FinancialAuditSummary';

export default function VerdictPage() {
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const router = useRouter();

  const isRejected = verdict?.decision === 'REJECTED';

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

  return (
    <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-[1200px] mx-auto w-full">
      <div className="mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
          Claim ID: {verdict.case_id || '#CAD-PENDING'}
        </span>
        <VerdictBanner 
          decision={verdict.decision}
          approvedAmount={verdict.approved_amount}
          notes={verdict.notes}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-8">
          <FinancialAuditSummary 
            totalClaimAmount={verdict.total_claim_amount}
            approvedAmount={verdict.approved_amount}
            deductionDetails={verdict.deduction_details}
            rejectionReasons={verdict.rejection_reasons}
            flags={verdict.flags}
          />
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
