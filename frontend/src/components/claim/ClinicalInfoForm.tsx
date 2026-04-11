"use client";

import React from 'react';

interface ClinicalInfoFormProps {
  diagnoses: string[];
  doctorName: string;
  doctorReg: string;
  treatment: string;
  onUpdateField: (path: string, value: any) => void;
}

export default function ClinicalInfoForm({
  diagnoses,
  doctorName,
  doctorReg,
  treatment,
  onUpdateField
}: ClinicalInfoFormProps) {
  return (
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
              {diagnoses.map((diag, i) => (
                <div key={i} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold text-xs border border-primary/20 hover:bg-primary/20 transition-colors">
                  {diag}
                  <button
                    onClick={() => {
                      const newDiags = diagnoses.filter((_, idx) => idx !== i);
                      onUpdateField('input_data.documents.prescription.diagnoses', newDiags);
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
                      const newDiags = [...diagnoses, val];
                      onUpdateField('input_data.documents.prescription.diagnoses', newDiags);
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
                value={doctorName}
                onChange={(e) => onUpdateField('input_data.documents.prescription.doctor_name', e.target.value)}
                className="flex-1 bg-surface-container-low px-4 py-3 rounded-xl border-none focus:ring-1 focus:ring-primary font-semibold text-sm transition-all"
                placeholder="Doctor Name"
              />
              <input
                value={doctorReg}
                onChange={(e) => onUpdateField('input_data.documents.prescription.doctor_reg', e.target.value)}
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
          value={treatment}
          onChange={(e) => onUpdateField('input_data.documents.prescription.treatment', e.target.value)}
          className="w-full h-32 bg-surface-container-low p-4 rounded-xl border-none focus:ring-1 focus:ring-primary font-medium text-sm leading-relaxed transition-all resize-none"
          placeholder="Briefly describe the prescribed medicines and treatment plan..."
        />
      </section>
    </div>
  );
}
