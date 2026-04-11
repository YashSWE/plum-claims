"use client";

import React from 'react';

interface VerdictBannerProps {
  decision: 'APPROVED' | 'PARTIAL' | 'REJECTED' | 'MANUAL_REVIEW';
  approvedAmount: number;
  notes: string;
}

export default function VerdictBanner({ decision, approvedAmount, notes }: VerdictBannerProps) {
  const isApproved = decision === 'APPROVED';
  const isPartial = decision === 'PARTIAL';
  const isRejected = decision === 'REJECTED';

  let titleText = "Claim Processed";
  if (isApproved) titleText = "Claim Approved!";
  if (isPartial) titleText = "Claim Partially Approved";
  if (isRejected) titleText = "Claim Rejected";

  return (
    <div className="mb-12">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-4">
        {titleText}
      </h1>
      <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
        {notes || "Your claim has been fully processed through the intelligent Plum Engine."}
      </p>

      <section className="mt-8 bg-surface-container-lowest p-8 rounded-[20px] signature-shadow relative overflow-hidden">
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
            <h2 className="text-4xl font-bold text-on-surface">Rs {approvedAmount.toFixed(2)}</h2>
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
          <div className="flex justify-between items-center py-1">
            <span className="text-on-surface-variant">Adjudicated Final Amount</span>
            <span className={`font-medium ${isRejected ? 'text-error' : 'text-tertiary'}`}>
               Rs {approvedAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-surface-container mt-4">
            <span className="font-bold text-on-surface">Status</span>
            <span className={`text-xl font-extrabold ${isRejected ? 'text-error' : 'text-primary'}`}>
              {decision}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
