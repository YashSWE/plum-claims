"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClaimContext, BillLineItem } from '@/context/ClaimContext';
import CaseHeader from '@/components/claim/CaseHeader';
import BillItemizationTable from '@/components/claim/BillItemizationTable';
import ClinicalInfoForm from '@/components/claim/ClinicalInfoForm';
import AdjudicationLoading from '@/components/AdjudicationLoading';

export default function ReviewPage() {
  const { caseData, updateCaseData } = useClaimContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!caseData) {
    return (
      <div className="pt-32 text-center h-screen flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">find_in_page</span>
        <p className="text-on-surface-variant text-lg font-medium">No active case data found.</p>
        <button onClick={() => router.push('/')} className="mt-6 bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">
          Go back to initiate a claim
        </button>
      </div>
    );
  }

  const { input_data } = caseData;
  const { documents } = input_data;
  const { prescription, bill } = documents;

  const handleUpdateField = (path: string, value: any) => {
    const newData = { ...caseData };
    const keys = path.split('.');
    let current: any = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    updateCaseData(newData);
  };

  const handleLineItemChange = (index: number, field: keyof BillLineItem, value: any) => {
    const newLineItems = [...(bill?.line_items || [])];
    newLineItems[index] = { ...newLineItems[index], [field]: value };

    if (field === 'unit_price' || field === 'quantity') {
      newLineItems[index].total_price = Number(newLineItems[index].unit_price) * Number(newLineItems[index].quantity);
    }

    handleUpdateField('input_data.documents.bill.line_items', newLineItems);

    const newTotal = newLineItems.reduce((sum, item) => sum + (item.total_price || 0), 0) +
      (bill?.consultation_fee || 0) +
      (bill?.diagnostic_tests || 0) +
      (bill?.medicines || 0);
    handleUpdateField('input_data.claim_amount', newTotal);
  };

  const addLineItem = () => {
    const newItem: BillLineItem = { description: '', quantity: 1, unit_price: 0, total_price: 0 };
    handleUpdateField('input_data.documents.bill.line_items', [...(bill?.line_items || []), newItem]);
  };

  const removeLineItem = (index: number) => {
    const newLineItems = (bill?.line_items || []).filter((_, i) => i !== index);
    handleUpdateField('input_data.documents.bill.line_items', newLineItems);
  };

  const handleAdjudicate = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plum-claims.onrender.com';
      const res = await fetch(`${API_BASE_URL}/api/v1/adjudicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ case: caseData }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || 'Adjudication failed');
      }

      const verdict = await res.json();
      sessionStorage.setItem('verdict', JSON.stringify(verdict));
      router.push('/claim/verdict');
    } catch (error) {
      console.error(error);
      alert(`Adjudicator Node Error: ${error instanceof Error ? error.message : 'See console.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-[1240px] mx-auto w-full">
      {loading && <AdjudicationLoading />}
      
      <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold">1</div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Documents</span>
        </div>
        <div className="h-px flex-grow bg-primary mx-4 mb-6"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold shadow-md">2</div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest">Review</span>
        </div>
        <div className="h-px flex-grow bg-outline-variant/30 mx-4 mb-6"></div>
        <div className="flex flex-col items-center gap-2 opacity-50">
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold">3</div>
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Verdict</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-12 space-y-8">
          <CaseHeader 
            memberName={input_data.member_name}
            memberId={input_data.member_id}
            treatmentDate={input_data.treatment_date}
            context={input_data.context}
          />

          <BillItemizationTable 
            lineItems={bill?.line_items || []}
            onLineItemChange={handleLineItemChange}
            onAddLineItem={addLineItem}
            onRemoveLineItem={removeLineItem}
            consultationFee={bill?.consultation_fee || 0}
            diagnosticTests={bill?.diagnostic_tests || 0}
            medicines={bill?.medicines || 0}
            claimAmount={input_data.claim_amount}
          />

          <ClinicalInfoForm 
            diagnoses={prescription?.diagnoses || []}
            doctorName={prescription?.doctor_name || ''}
            doctorReg={prescription?.doctor_reg || ''}
            treatment={prescription?.treatment || ''}
            onUpdateField={handleUpdateField}
          />

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-12 pb-20 border-t border-outline-variant/10">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-on-surface hover:bg-surface-container-high transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Upload
            </button>
            <button
              onClick={handleAdjudicate}
              disabled={loading}
              className="group relative bg-primary text-on-primary px-12 py-4 rounded-[20px] font-black tracking-tighter text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-[20px] pointer-events-none"></div>
              <span className="relative flex items-center gap-3">
                {loading ? 'Adjudicating...' : 'Run Adjudication Engine'}
                {!loading && <span className="material-symbols-outlined font-bold text-xl">bolt</span>}
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
