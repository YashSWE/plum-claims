"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClaimContext, BillLineItem } from '@/context/ClaimContext';
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

    // Recalculate total if unit_price or quantity changed
    if (field === 'unit_price' || field === 'quantity') {
      newLineItems[index].total_price = Number(newLineItems[index].unit_price) * Number(newLineItems[index].quantity);
    }

    handleUpdateField('input_data.documents.bill.line_items', newLineItems);

    // Also update total claim amount
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
      
      {/* Progress Stepper */}
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
        {/* Main Content Area */}
        <div className="lg:col-span-12 space-y-8">
          {/* Member Header Card - Refined Size */}
          <section className="bg-primary text-on-primary p-6 md:p-8 rounded-[24px] shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-[160px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1 block">Case Header</span>
                <h1 className="text-3xl font-black tracking-tighter mb-1">{input_data.member_name}</h1>
                <div className="flex items-center gap-3 text-[11px] opacity-90">
                  <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest text-[9px]">ID: {input_data.member_id}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest text-[9px]">Date: {input_data.treatment_date}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl max-w-sm border border-white/20 shadow-inner">
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">Claim Context</p>
                <p className="text-xs font-medium leading-relaxed italic line-clamp-2">"{input_data.context || 'No specific context provided.'}"</p>
              </div>
            </div>
          </section>

          {/* Detailed Bill Section */}
          <section className="bg-surface-container-lowest p-8 md:p-10 rounded-[28px] shadow-sm border border-outline-variant/10">
            <div className="flex justify-between items-end mb-8 border-b border-outline-variant/10 pb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-on-surface flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">receipt_long</span>
                  Bill Itemization
                </h2>
                <p className="text-on-surface-variant text-sm mt-1">Extract and verify individual bill line items below.</p>
              </div>
              <button
                onClick={addLineItem}
                className="flex items-center gap-2 text-primary font-bold text-sm hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 border-b border-outline-variant/5">
                    <th className="pb-4 pl-4">Description</th>
                    <th className="pb-4 w-24 text-center">Qty</th>
                    <th className="pb-4 w-32 text-right">Unit Price (₹)</th>
                    <th className="pb-4 w-32 text-right">Total (₹)</th>
                    <th className="pb-4 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {(bill?.line_items || []).map((item, idx) => (
                    <tr key={idx} className="group hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-4 pl-4">
                        <input
                          value={item.description}
                          onChange={(e) => handleLineItemChange(idx, 'description', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 font-bold text-on-surface placeholder:text-on-surface-variant/20"
                          placeholder="Item description..."
                        />
                      </td>
                      <td className="py-4 text-center">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                          className="w-16 bg-surface-container-low/50 rounded-lg px-2 py-1 text-center border-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                        />
                      </td>
                      <td className="py-4 text-right">
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) => handleLineItemChange(idx, 'unit_price', e.target.value)}
                          className="w-24 bg-surface-container-low/50 rounded-lg px-2 py-1 text-right border-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                        />
                      </td>
                      <td className="py-4 text-right font-bold text-primary">
                        ₹{item.total_price?.toLocaleString()}
                      </td>
                      <td className="py-4 text-right pr-4">
                        <button
                          onClick={() => removeLineItem(idx)}
                          className="text-error opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-error/5 rounded-lg"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!bill?.line_items || bill.line_items.length === 0) && (
                <div className="py-12 text-center text-on-surface-variant opacity-30 flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                  <p className="text-sm font-bold uppercase tracking-widest">No line items extracted</p>
                </div>
              )}
            </div>

            {/* Sub-totals Card */}
            <div className="mt-10 flex flex-col md:flex-row justify-end gap-6 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/5 shadow-inner">
              <div className="space-y-3 w-full md:w-80">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Categorized Total (Fees/Tests)</span>
                  <span className="font-bold">₹{((bill?.consultation_fee || 0) + (bill?.diagnostic_tests || 0) + (bill?.medicines || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant font-medium">Billed Line Items Total</span>
                  <span className="font-bold text-primary">₹{(bill?.line_items?.reduce((s, i) => s + (i.total_price || 0), 0) || 0).toLocaleString()}</span>
                </div>
                <div className="h-px bg-outline-variant/20 my-4"></div>
                <div className="flex justify-between items-center text-xl">
                  <span className="font-black tracking-tight">Final Claim Amount</span>
                  <span className="font-black text-primary">₹{input_data.claim_amount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Clinical Info & Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-surface-container-lowest p-8 rounded-[28px] shadow-sm border border-outline-variant/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">medical_information</span>
                Prescription & Diagnosis
              </h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Final Diagnoses</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(prescription?.diagnoses || []).map((diag, i) => (
                      <div key={i} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold text-xs border border-primary/20 hover:bg-primary/20 transition-colors">
                        {diag}
                        <button
                          onClick={() => {
                            const newDiags = (prescription?.diagnoses || []).filter((_, idx) => idx !== i);
                            handleUpdateField('input_data.documents.prescription.diagnoses', newDiags);
                          }}
                          className="material-symbols-outlined text-sm hover:text-error"
                        >close</button>
                      </div>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) {
                            const newDiags = [...(prescription?.diagnoses || []), val];
                            handleUpdateField('input_data.documents.prescription.diagnoses', newDiags);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                      className="w-full bg-surface-container-low px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-primary font-bold transition-all text-sm pr-12"
                      placeholder="Add diagnosis... (Press Enter)"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">add</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/50">Doctor Name & Reg</label>
                  <div className="flex gap-4">
                    <input
                      value={prescription?.doctor_name || ''}
                      onChange={(e) => handleUpdateField('input_data.documents.prescription.doctor_name', e.target.value)}
                      className="flex-1 bg-surface-container-low px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-primary font-semibold text-sm transition-all"
                      placeholder="Doctor Name"
                    />
                    <input
                      value={prescription?.doctor_reg || ''}
                      onChange={(e) => handleUpdateField('input_data.documents.prescription.doctor_reg', e.target.value)}
                      className="w-1/3 bg-surface-container-low px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-primary font-mono text-xs transition-all"
                      placeholder="Reg No"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest p-8 rounded-[28px] shadow-sm border border-outline-variant/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">clinical_notes</span>
                Prescribed Treatment
              </h3>
              <textarea
                value={prescription?.treatment || ''}
                onChange={(e) => handleUpdateField('input_data.documents.prescription.treatment', e.target.value)}
                className="w-full h-32 bg-surface-container-low p-4 rounded-xl border-none focus:ring-1 focus:ring-primary font-medium text-sm leading-relaxed transition-all resize-none"
                placeholder="Briefly describe the prescribed medicines and treatment plan..."
              />
            </section>
          </div>

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
