"use client";

import React from 'react';

interface FinancialAuditSummaryProps {
  totalClaimAmount: number;
  approvedAmount: number;
  deductionDetails: Array<{
    category: string;
    amount: number;
    reason: string;
  }>;
  rejectionReasons: string[];
  flags: string[];
}

export default function FinancialAuditSummary({
  totalClaimAmount,
  approvedAmount,
  deductionDetails,
  rejectionReasons,
  flags
}: FinancialAuditSummaryProps) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary signature-shadow">
          <span className="material-symbols-outlined">analytics</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface">Financial Audit Summary</h3>
      </div>

      <div className="bg-surface-container-low p-8 rounded-[32px] border border-outline-variant/10 shadow-sm relative overflow-hidden">
         <div className="flex flex-col gap-6 relative z-10">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Total Amount Claimed</span>
              <span className="text-xl font-medium text-stone-500 line-through">Rs {totalClaimAmount?.toFixed(2) || '0.00'}</span>
            </div>

            {deductionDetails && deductionDetails.length > 0 ? (
              <div className="space-y-4 py-6 border-y border-outline-variant/10">
                <p className="text-[10px] font-black tracking-widest text-primary uppercase">Deduction Logs</p>
                {deductionDetails.map((item, i) => (
                  <div key={i} className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-on-surface mb-0.5">{item.category}</p>
                      <p className="text-xs text-on-surface-variant leading-relaxed font-medium">{item.reason}</p>
                    </div>
                    <span className="text-sm font-extrabold text-error whitespace-nowrap">- Rs {item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 border-y border-outline-variant/10 italic text-sm text-stone-400">
                No policy deductions or exclusions were applied to this claim.
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <div>
                <span className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-1 block">Net Approved Payout</span>
                <p className="text-xs text-on-surface-variant font-medium">Verified by Plum Engine V2.1</p>
              </div>
              <span className="text-4xl font-black tracking-tighter text-primary">Rs {approvedAmount.toFixed(2)}</span>
            </div>
         </div>
         <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {(rejectionReasons?.length > 0 || flags?.length > 0) && (
        <div className="bg-surface-container-lowest p-8 rounded-[24px] border-2 border-dashed border-stone-100 italic">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-4">Clinical Integrity Logs</p>
          <ul className="space-y-4">
            {rejectionReasons?.map((reason, i) => (
              <li key={`reason-${i}`} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-lg">warning</span>
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">{reason}</p>
              </li>
            ))}
            {flags?.map((flag, i) => (
              <li key={`flag-${i}`} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">flag</span>
                <p className="text-sm text-on-surface-variant leading-relaxed font-medium">{flag}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
