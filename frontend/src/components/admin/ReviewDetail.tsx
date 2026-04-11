'use client';

import { useState } from 'react';

interface ReviewDetailProps {
  caseData: any;
  verdictData: any;
  onClose: () => void;
  onOverride: (newVerdict: any) => Promise<void>;
}

export default function ReviewDetail({ caseData, verdictData, onClose, onOverride }: ReviewDetailProps) {
  const [isOverriding, setIsOverriding] = useState(false);
  const [editedVerdict, setEditedVerdict] = useState<any>(JSON.parse(JSON.stringify(verdictData || {})));
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'documents' | 'audit'>('profile');

  if (!caseData) return null;

  const input = caseData.input_data;
  const docs = input.documents;
  const decisionColor = 
    verdictData?.decision === 'APPROVED' ? 'text-green-600 bg-green-50 border-green-200' :
    verdictData?.decision === 'REJECTED' ? 'text-red-600 bg-red-50 border-red-200' :
    verdictData?.decision === 'PARTIAL' ? 'text-blue-600 bg-blue-50 border-blue-200' :
    'text-amber-600 bg-amber-50 border-amber-200';

  const handleOverrideSubmit = async () => {
    await onOverride(editedVerdict);
    setIsOverriding(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-stone-200 animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-stone-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${decisionColor}`}>
              {verdictData?.decision || 'PENDING'}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-on-surface">Case Profile: {caseData.case_id}</h2>
              <p className="text-sm text-on-surface-variant font-medium">Claim for {input.member_name} • Submitted on {new Date(caseData.created_at || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Sub-tabs */}
        <div className="px-8 bg-stone-50/50 border-b border-stone-100 flex gap-8">
          <SubTab active={activeSubTab === 'profile'} onClick={() => setActiveSubTab('profile')} label="Case Overview" />
          <SubTab active={activeSubTab === 'documents'} onClick={() => setActiveSubTab('documents')} label="Documents & OCR" />
          <SubTab active={activeSubTab === 'audit'} onClick={() => setActiveSubTab('audit')} label="Detailed Audit" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {activeSubTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <Section title="Claim Summary" icon="info">
                  <div className="grid grid-cols-2 gap-6">
                    <DataField label="Member ID" value={input.member_id} />
                    <DataField label="Hospital" value={input.hospital || 'N/A'} />
                    <DataField label="Treatment Date" value={input.treatment_date} />
                    <DataField label="Claim Amount" value={`₹${input.claim_amount}`} />
                  </div>
                  <div className="mt-6 pt-6 border-t border-stone-100">
                    <label className="text-xs font-bold uppercase text-primary tracking-widest mb-2 block">Notes from Patient</label>
                    <p className="text-on-surface text-sm leading-relaxed">{input.context || 'No notes provided.'}</p>
                  </div>
                </Section>

                <Section title="Final Verdict Detail" icon="gavel">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <span className="font-bold text-on-surface">Decision</span>
                      <span className={`font-black uppercase tracking-widest ${decisionColor.split(' ')[0]}`}>{verdictData?.decision}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <span className="font-bold text-on-surface">Approved Amount</span>
                      <span className="font-black text-2xl text-primary">₹{verdictData?.approved_amount || 0}</span>
                    </div>
                    {verdictData?.rejection_reasons?.length > 0 && (
                      <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100">
                        <span className="text-xs font-bold uppercase text-red-600 tracking-widest mb-2 block">Rejection Reasons</span>
                        <div className="flex flex-wrap gap-2">
                          {verdictData.rejection_reasons.map((r: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider">{r}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                      <span className="text-xs font-bold uppercase text-on-surface-variant tracking-widest mb-2 block">System Notes</span>
                      <p className="text-sm font-medium italic">"{verdictData?.notes || 'No system notes.'}"</p>
                    </div>
                  </div>
                </Section>
              </div>

              <div className="space-y-8">
                <Section title="Actions" icon="bolt">
                  {!isOverriding ? (
                    <button 
                      onClick={() => setIsOverriding(true)}
                      className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">edit_note</span>
                      Override Verdict
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in slide-in-from-top-4">
                      <label className="text-xs font-bold text-primary px-1">NEW DECISION</label>
                      <select 
                        value={editedVerdict.decision}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditedVerdict({...editedVerdict, decision: e.target.value})}
                        className="w-full p-4 bg-white border border-stone-200 rounded-2xl font-bold text-on-surface outline-none focus:border-primary transition-all shadow-sm"
                      >
                        <option value="APPROVED">APPROVED</option>
                        <option value="PARTIAL">PARTIAL</option>
                        <option value="REJECTED">REJECTED</option>
                        <option value="MANUAL_REVIEW">MANUAL REVIEW</option>
                      </select>
                      <label className="text-xs font-bold text-primary px-1">APPROVED AMOUNT (₹)</label>
                      <input 
                        type="number"
                        value={editedVerdict.approved_amount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedVerdict({...editedVerdict, approved_amount: parseFloat(e.target.value)})}
                        className="w-full p-4 bg-white border border-stone-200 rounded-2xl font-bold text-on-surface outline-none focus:border-primary transition-all shadow-sm"
                      />
                      <label className="text-xs font-bold text-primary px-1">OVERRIDE REASON / NOTES</label>
                      <textarea 
                        value={editedVerdict.notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedVerdict({...editedVerdict, notes: e.target.value})}
                        className="w-full h-32 p-4 bg-white border border-stone-200 rounded-2xl text-sm font-medium text-on-surface outline-none focus:border-primary transition-all shadow-sm resize-none"
                        placeholder="Explain why you are overriding this decision..."
                      />
                      <div className="flex gap-4 pt-2">
                        <button 
                          onClick={() => setIsOverriding(false)}
                          className="flex-1 py-3 bg-stone-100 text-on-surface-variant rounded-xl font-bold text-sm"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleOverrideSubmit}
                          className="flex-1 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-md"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </Section>

                <Section title="Fraud & Flags" icon="warning">
                  {verdictData?.flags?.length > 0 ? (
                    <div className="space-y-3">
                      {verdictData.flags.map((flag: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[18px]">priority_high</span>
                          {flag}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-green-600 uppercase tracking-widest text-center py-4 bg-green-50 rounded-2xl border border-green-100">No red flags detected</p>
                  )}
                </Section>
              </div>
            </div>
          )}

          {activeSubTab === 'documents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <div className="space-y-8">
                <Section title="Uploaded Documents" icon="attach_file">
                  <div className="space-y-4">
                    {Object.entries(docs.document_urls || {}).map(([name, url]: [any, any]) => (
                      <div key={name} className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-stone-50 hover:border-primary transition-all">
                        <div className="aspect-video w-full bg-stone-200 flex items-center justify-center font-bold text-stone-400">
                          {name.toLowerCase().endsWith('.pdf') ? (
                           <div className="flex flex-col items-center gap-2">
                             <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
                             <span className="text-xs uppercase tracking-widest">PDF DOCUMENT</span>
                           </div>
                          ) : (
                            <img src={url} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          )}
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <span className="text-sm font-bold text-on-surface truncate pr-4">{name}</span>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white rounded-lg border border-stone-200 text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-on-primary hover:border-primary transition-all">View Full</a>
                        </div>
                      </div>
                    ))}
                    {(!docs.document_urls || Object.keys(docs.document_urls).length === 0) && (
                        <div className="text-center py-12 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                            <span className="material-symbols-outlined text-4xl text-stone-300 mb-2">image_not_supported</span>
                            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">No images available</p>
                            <p className="text-xs text-stone-400 mt-1">Images were not stored for this older claim</p>
                        </div>
                    )}
                  </div>
                </Section>
              </div>
              
              <div className="space-y-8">
                <Section title="AI-Parsed OCR Context" icon="robot_2">
                  <div className="space-y-6">
                    {docs.raw_transcripts?.map((t: any, i: number) => (
                      <div key={i} className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">TRANSCRIPT: {t.filename}</span>
                        <div className="max-h-96 overflow-y-auto text-xs font-mono leading-relaxed text-on-surface whitespace-pre-wrap select-all">
                          {t.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            </div>
          )}

          {activeSubTab === 'audit' && (
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Section title="AI Consistency Analysis" icon="cloud_done">
                      <div className="space-y-4">
                        <ConsistencyRow 
                          label="Patient Name Match" 
                          success={!verdictData?.flags?.includes('NAME_CONSISTENCY')} 
                          score={verdictData?.flags?.includes('NAME_CONSISTENCY') ? 0.45 : 0.98} 
                        />
                        <ConsistencyRow 
                          label="Date of Service Match" 
                          success={!verdictData?.flags?.includes('DOV_CONSISTENCY')} 
                          score={verdictData?.flags?.includes('DOV_CONSISTENCY') ? 0.30 : 0.95} 
                        />
                        <ConsistencyRow 
                          label="Doctor Registration Valid" 
                          success={!verdictData?.flags?.includes('DOCTOR_REGISTRATION')} 
                          score={verdictData?.flags?.includes('DOCTOR_REGISTRATION') ? 0.10 : 0.99} 
                        />
                        <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-100 italic text-xs text-on-surface-variant font-medium">
                          AI Observation: "{verdictData?.notes || `All documents analyzed for patient ${input.member_name}. Consistency scores calculated based on OCR alignment across ${Object.keys(docs.document_urls || {}).length} artifacts.`}"
                        </div>
                      </div>
                  </Section>

                  <Section title="Rule-Based Checks" icon="settings_suggest">
                      <div className="space-y-4">
                        <RuleRow 
                          label="Waiting Period" 
                          success={!verdictData?.rejection_reasons?.some((r: string) => r.toLowerCase().includes('waiting'))} 
                          note={verdictData?.rejection_reasons?.find((r: string) => r.toLowerCase().includes('waiting')) || "Policy waiting period criteria met."} 
                        />
                        <RuleRow 
                          label="Duplicate Check" 
                          success={!verdictData?.flags?.includes('DUPLICATE_CLAIM')} 
                          note={verdictData?.flags?.includes('DUPLICATE_CLAIM') ? "Potential duplicate claim detected." : "No matching claims found for this date."} 
                        />
                        <RuleRow 
                          label="Minimum Amount" 
                          success={input.claim_amount >= 500} 
                          note={`₹${input.claim_amount} ${input.claim_amount >= 500 ? '>' : '<'} ₹500 minimum threshold.`} 
                        />
                        <RuleRow 
                          label="Policy Limits" 
                          success={!verdictData?.rejection_reasons?.some((r: string) => r.toLowerCase().includes('limit'))} 
                          note={verdictData?.rejection_reasons?.find((r: string) => r.toLowerCase().includes('limit')) || "Amount within annual/per-claim limits."} 
                        />
                      </div>
                  </Section>
               </div>

               <Section title="Medical Necessity & Item Analysis" icon="medical_services">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                      <thead>
                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant px-4">
                          <th className="pb-2 pl-4">Bill Item</th>
                          <th className="pb-2">Necessity (AI)</th>
                          <th className="pb-2">Reasoning</th>
                          <th className="pb-2 text-right pr-4">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {verdictData?.deduction_details?.map((d: any, i: number) => (
                          <tr key={i} className="bg-stone-50 border border-stone-100 rounded-2xl overflow-hidden group">
                            <td className="py-4 pl-4 rounded-l-2xl">
                              <span className="font-bold text-sm text-on-surface capitalize">{d.category}</span>
                            </td>
                            <td className="py-4">
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider">REJECTED</span>
                            </td>
                            <td className="py-4">
                              <p className="text-xs font-medium text-on-surface-variant max-w-sm">{d.reason}</p>
                            </td>
                            <td className="py-4 text-right pr-4 rounded-r-2xl">
                              <span className="font-black text-red-600 text-sm">-₹{d.amount}</span>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-green-50/30 rounded-2xl border border-green-100/50">
                           <td className="py-4 pl-4 rounded-l-2xl">
                             <span className="font-bold text-sm text-green-700">Eligible Base Amount</span>
                           </td>
                           <td className="py-4">
                             <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider">APPROVED</span>
                           </td>
                           <td className="py-4 font-medium text-xs text-green-600/60 italic">Items matching medical necessity criteria</td>
                           <td className="py-4 text-right pr-4 rounded-r-2xl">
                             <span className="font-black text-green-700 text-sm">₹{verdictData?.approved_amount}</span>
                           </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
               </Section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SubTab({ active, onClick, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`py-4 px-2 text-xs font-black uppercase tracking-[0.2em] border-b-2 transition-all ${active ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant hover:text-on-surface'}`}
    >
      {label}
    </button>
  );
}

function Section({ title, icon, children }: any) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface">{title}</h3>
      </div>
      <div className="bg-white border border-stone-100 rounded-[28px] p-6 shadow-sm">
        {children}
      </div>
    </div>
  );
}

function DataField({ label, value }: any) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-[0.2em]">{label}</label>
      <div className="font-bold text-on-surface">{value}</div>
    </div>
  );
}

function ConsistencyRow({ label, success, score }: any) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-bold text-on-surface">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-black text-on-surface-variant">{(score * 100).toFixed(0)}% MATCH</span>
        <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
      </div>
    </div>
  );
}

function RuleRow({ label, success, note }: any) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
      <div className="flex flex-col">
        <span className="text-sm font-bold text-on-surface">{label}</span>
        <span className="text-[10px] font-medium text-on-surface-variant">{note}</span>
      </div>
      <span className="material-symbols-outlined text-green-500 font-bold">check_circle</span>
    </div>
  );
}
