'use client';

import { useState, useEffect } from 'react';

type Tab = 'coverage' | 'waiting' | 'requirements' | 'advanced';

export default function PolicyAdmin() {
  const [policy, setPolicy] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('coverage');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8008/api/v1/policy')
      .then(res => res.json())
      .then(data => {
        setPolicy(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:8008/api/v1/policy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy)
      });
      if (res.ok) {
        setMessage('Policy updated successfully!');
      } else {
        setMessage('Failed to update policy.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    } finally {
      setSaving(false);
    }
  };

  const updateNested = (path: string, value: any) => {
    const newPolicy = { ...policy };
    const parts = path.split('.');
    let current = newPolicy;
    for (let i = 0; i < parts.length - 1; i++) {
        // If the path doesn't exist, create it (for dynamic dicts)
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setPolicy(newPolicy);
  };

  const addListItem = (listPath: string, value: any) => {
    const parts = listPath.split('.');
    const newPolicy = { ...policy };
    let current = newPolicy;
    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }
    const list = current[parts[parts.length - 1]] || [];
    current[parts[parts.length - 1]] = [...list, value];
    setPolicy(newPolicy);
  };

  const removeListItem = (listPath: string, index: number) => {
    const parts = listPath.split('.');
    const newPolicy = { ...policy };
    let current = newPolicy;
    for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = current[parts[parts.length - 1]].filter((_: any, idx: number) => idx !== index);
    setPolicy(newPolicy);
  };

  if (loading) return <div className="pt-32 px-12 text-center text-on-surface-variant font-medium">Loading policy configuration...</div>;

  return (
    <main className="pt-32 pb-20 px-8 max-w-[1240px] mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-primary mb-2">Policy Configuration</h1>
          <p className="text-on-surface-variant text-lg">Define coverage limits, exclusions, and business rules for the adjudication engine.</p>
        </div>
        <div className="flex gap-4">
            <button 
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl font-bold bg-surface-container-high text-on-surface-variant hover:bg-surface-container transition-all"
            >
                Reset
            </button>
            <button 
                onClick={handleSave}
                disabled={saving}
                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/20 ${saving ? 'bg-stone-200 text-stone-500' : 'bg-primary text-on-primary hover:scale-[1.02] active:scale-[0.98]'}`}
            >
                {saving ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </div>

      {message && (
        <div className={`mb-8 p-4 rounded-xl font-medium border animate-in fade-in slide-in-from-top-2 duration-300 ${message.includes('success') ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-surface-container-low p-1.5 rounded-2xl w-fit border border-stone-200/40">
        <TabButton active={activeTab === 'coverage'} onClick={() => setActiveTab('coverage')} label="Limits & Basic" icon="account_balance_wallet" />
        <TabButton active={activeTab === 'waiting'} onClick={() => setActiveTab('waiting')} label="Waiting Periods" icon="schedule" />
        <TabButton active={activeTab === 'requirements'} onClick={() => setActiveTab('requirements')} label="Requirements & Network" icon="verified_user" />
        <TabButton active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')} label="Advanced Coverage" icon="settings_suggest" />
      </div>

      <div className="animate-in fade-in duration-500">
        {activeTab === 'coverage' && <CoverageSection policy={policy} updateNested={updateNested} removeListItem={removeListItem} addListItem={addListItem} />}
        {activeTab === 'waiting' && <WaitingSection policy={policy} updateNested={updateNested} />}
        {activeTab === 'requirements' && <RequirementsSection policy={policy} updateNested={updateNested} removeListItem={removeListItem} addListItem={addListItem} />}
        {activeTab === 'advanced' && <AdvancedSection policy={policy} updateNested={updateNested} removeListItem={removeListItem} addListItem={addListItem} />}
      </div>
    </main>
  );
}

function TabButton({ active, onClick, label, icon }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${active ? 'bg-white shadow-sm text-primary' : 'text-on-surface-variant hover:bg-white/50'}`}
        >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            {label}
        </button>
    )
}

function CoverageSection({ policy, updateNested, removeListItem, addListItem }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title="Financial Limits" icon="payments">
                <div className="space-y-6">
                    <Field label="Annual Limit (₹)" value={policy.coverage_details.annual_limit} onChange={(val: string) => updateNested('coverage_details.annual_limit', parseFloat(val))} type="number" />
                    <Field label="Per Claim Limit (₹)" value={policy.coverage_details.per_claim_limit} onChange={(val: string) => updateNested('coverage_details.per_claim_limit', parseFloat(val))} type="number" />
                    <Field label="Family Floater Limit (₹)" value={policy.coverage_details.family_floater_limit} onChange={(val: string) => updateNested('coverage_details.family_floater_limit', parseFloat(val))} type="number" />
                </div>
            </Section>

            <Section title="Consultation Settings" icon="stethoscope">
                <div className="space-y-6">
                    <ToggleField label="Covered" checked={policy.coverage_details.consultation_fees.covered} onChange={(val: boolean) => updateNested('coverage_details.consultation_fees.covered', val)} />
                    <Field label="Sub-limit (₹)" value={policy.coverage_details.consultation_fees.sub_limit} onChange={(val: string) => updateNested('coverage_details.consultation_fees.sub_limit', parseFloat(val))} type="number" />
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="Copay (%)" value={policy.coverage_details.consultation_fees.copay_percentage} onChange={(val: string) => updateNested('coverage_details.consultation_fees.copay_percentage', parseFloat(val))} type="number" />
                        <Field label="Network Discount (%)" value={policy.coverage_details.consultation_fees.network_discount} onChange={(val: string) => updateNested('coverage_details.consultation_fees.network_discount', parseFloat(val))} type="number" />
                    </div>
                </div>
            </Section>

            <Section title="Exclusions List" icon="block" className="md:col-span-2">
                <ListEditor 
                    items={policy.exclusions} 
                    onAdd={(val: string) => addListItem('exclusions', val)} 
                    onRemove={(idx: number) => removeListItem('exclusions', idx)}
                    placeholder="Add exclusion treatment or condition..."
                />
            </Section>
        </div>
    )
}

function WaitingSection({ policy, updateNested }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title="Standard Waiting Periods" icon="history">
                <div className="space-y-6">
                    <Field label="Initial Waiting Period (Days)" value={policy.waiting_periods.initial_waiting} onChange={(val: string) => updateNested('waiting_periods.initial_waiting', parseInt(val))} type="number" />
                    <Field label="Pre-Existing Diseases (Days)" value={policy.waiting_periods.pre_existing_diseases} onChange={(val: string) => updateNested('waiting_periods.pre_existing_diseases', parseInt(val))} type="number" />
                    <Field label="Maternity Waiting Period (Days)" value={policy.waiting_periods.maternity} onChange={(val: string) => updateNested('waiting_periods.maternity', parseInt(val))} type="number" />
                </div>
            </Section>

            <Section title="Specific Ailments" icon="medical_information">
                <div className="bg-white/40 border border-stone-200/40 rounded-2xl p-6 mb-6">
                    <p className="text-sm text-on-surface-variant mb-6 font-medium">Configure custom waiting periods for specific medical conditions.</p>
                    <div className="space-y-4">
                        {Object.entries(policy.waiting_periods.specific_ailments || {}).map(([ailment, days]: [any, any]) => (
                            <div key={ailment} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-stone-100">
                                <span className="flex-1 font-bold capitalize text-on-surface">{ailment}</span>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        value={days} 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateNested(`waiting_periods.specific_ailments.${ailment}`, parseInt(e.target.value))}
                                        className="w-20 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-sm font-bold text-primary outline-none focus:border-primary"
                                    />
                                    <span className="text-xs font-bold text-on-surface-variant uppercase">Days</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        const newAilments = { ...policy.waiting_periods.specific_ailments };
                                        delete newAilments[ailment];
                                        updateNested('waiting_periods.specific_ailments', newAilments);
                                    }}
                                    className="material-symbols-outlined text-red-400 hover:text-red-600 transition-colors"
                                >
                                    delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2">
                    <input 
                        id="new-ailment"
                        type="text" 
                        placeholder="Add ailment (e.g. Cataract)..."
                        className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm"
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                                const val = (e.currentTarget as HTMLInputElement).value;
                                if (val) {
                                    updateNested(`waiting_periods.specific_ailments.${val.toLowerCase()}`, 90);
                                    e.currentTarget.value = '';
                                }
                            }
                        }}
                    />
                </div>
            </Section>
        </div>
    )
}

function RequirementsSection({ policy, updateNested, removeListItem, addListItem }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title="Submission Requirements" icon="task_alt">
                <div className="space-y-6">
                    <Field label="Submission Timeline (Days)" value={policy.claim_requirements.submission_timeline_days} onChange={(val: string) => updateNested('claim_requirements.submission_timeline_days', parseInt(val))} type="number" />
                    <Field label="Minimum Claim Amount (₹)" value={policy.claim_requirements.minimum_claim_amount} onChange={(val: string) => updateNested('claim_requirements.minimum_claim_amount', parseFloat(val))} type="number" />
                    
                    <div className="space-y-2 mt-8">
                        <label className="text-sm font-semibold text-on-surface-variant px-1">Required Documents</label>
                        <ListEditor 
                            items={policy.claim_requirements.documents_required} 
                            onAdd={(val: string) => addListItem('claim_requirements.documents_required', val)} 
                            onRemove={(idx: number) => removeListItem('claim_requirements.documents_required', idx)}
                            placeholder="Add required document type..."
                        />
                    </div>
                </div>
            </Section>

            <Section title="Cashless & Network" icon="account_tree">
                <div className="space-y-6">
                    <ToggleField label="Cashless Available" checked={policy.cashless_facilities.available} onChange={(val: boolean) => updateNested('cashless_facilities.available', val)} />
                    <ToggleField label="Network Only Cashless" checked={policy.cashless_facilities.network_only} onChange={(val: boolean) => updateNested('cashless_facilities.network_only', val)} />
                    <ToggleField label="Pre-Approval Required" checked={policy.cashless_facilities.pre_approval_required} onChange={(val: boolean) => updateNested('cashless_facilities.pre_approval_required', val)} />
                    <Field label="Instant Approval Limit (₹)" value={policy.cashless_facilities.instant_approval_limit} onChange={(val: string) => updateNested('cashless_facilities.instant_approval_limit', parseFloat(val))} type="number" />
                    
                    <div className="space-y-2 mt-8">
                        <label className="text-sm font-semibold text-on-surface-variant px-1">Network Hospitals</label>
                        <ListEditor 
                            items={policy.network_hospitals} 
                            onAdd={(val: string) => addListItem('network_hospitals', val)} 
                            onRemove={(idx: number) => removeListItem('network_hospitals', idx)}
                            placeholder="Add hospital name..."
                        />
                    </div>
                </div>
            </Section>
        </div>
    )
}

function AdvancedSection({ policy, updateNested, removeListItem, addListItem }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Section title="Diagnostic Tests" icon="biotech">
                <div className="space-y-6">
                    <ToggleField label="Covered" checked={policy.coverage_details.diagnostic_tests.covered} onChange={(val: boolean) => updateNested('coverage_details.diagnostic_tests.covered', val)} />
                    <Field label="Sub-limit (₹)" value={policy.coverage_details.diagnostic_tests.sub_limit} onChange={(val: string) => updateNested('coverage_details.diagnostic_tests.sub_limit', parseFloat(val))} type="number" />
                    <label className="text-sm font-semibold text-on-surface-variant px-1">Covered Tests</label>
                    <ListEditor 
                        items={policy.coverage_details.diagnostic_tests.covered_tests} 
                        onAdd={(val: string) => addListItem('coverage_details.diagnostic_tests.covered_tests', val)} 
                        onRemove={(idx: number) => removeListItem('coverage_details.diagnostic_tests.covered_tests', idx)}
                        placeholder="Add test (e.g. Blood Test)..."
                    />
                </div>
            </Section>

            <Section title="Pharmacy & Drugs" icon="pill">
                <div className="space-y-6">
                    <ToggleField label="Covered" checked={policy.coverage_details.pharmacy.covered} onChange={(val: boolean) => updateNested('coverage_details.pharmacy.covered', val)} />
                    <Field label="Sub-limit (₹)" value={policy.coverage_details.pharmacy.sub_limit} onChange={(val: string) => updateNested('coverage_details.pharmacy.sub_limit', parseFloat(val))} type="number" />
                    <ToggleField label="Generic Mandatory" checked={policy.coverage_details.pharmacy.generic_drugs_mandatory} onChange={(val: boolean) => updateNested('coverage_details.pharmacy.generic_drugs_mandatory', val)} />
                </div>
            </Section>

            <Section title="Dental & Vision" icon="visibility">
                <div className="space-y-6">
                    <div className="p-4 bg-white/40 rounded-2xl border border-stone-100 mb-4">
                        <label className="text-xs font-bold text-primary uppercase mb-2 block">Dental</label>
                        <ToggleField label="Dental Covered" checked={policy.coverage_details.dental.covered} onChange={(val: boolean) => updateNested('coverage_details.dental.covered', val)} />
                        {policy.coverage_details.dental.covered && (
                            <div className="mt-4 space-y-4">
                                <Field label="Sub-limit (₹)" value={policy.coverage_details.dental.sub_limit} onChange={(val: string) => updateNested('coverage_details.dental.sub_limit', parseFloat(val))} type="number" />
                            </div>
                        )}
                    </div>
                    <div className="p-4 bg-white/40 rounded-2xl border border-stone-100">
                        <label className="text-xs font-bold text-primary uppercase mb-2 block">Vision</label>
                        <ToggleField label="Vision Covered" checked={policy.coverage_details.vision.covered} onChange={(val: boolean) => updateNested('coverage_details.vision.covered', val)} />
                        {policy.coverage_details.vision.covered && (
                            <div className="mt-4 space-y-4">
                                <Field label="Sub-limit (₹)" value={policy.coverage_details.vision.sub_limit} onChange={(val: string) => updateNested('coverage_details.vision.sub_limit', parseFloat(val))} type="number" />
                            </div>
                        )}
                    </div>
                </div>
            </Section>

            <Section title="Alternative Medicine" icon="spa">
                <div className="space-y-6">
                    <ToggleField label="Covered" checked={policy.coverage_details.alternative_medicine.covered} onChange={(val: boolean) => updateNested('coverage_details.alternative_medicine.covered', val)} />
                    <Field label="Sub-limit (₹)" value={policy.coverage_details.alternative_medicine.sub_limit} onChange={(val: string) => updateNested('coverage_details.alternative_medicine.sub_limit', parseFloat(val))} type="number" />
                    <label className="text-sm font-semibold text-on-surface-variant px-1">Covered Treatments</label>
                    <ListEditor 
                        items={policy.coverage_details.alternative_medicine.covered_treatments} 
                        onAdd={(val: string) => addListItem('coverage_details.alternative_medicine.covered_treatments', val)} 
                        onRemove={(idx: number) => removeListItem('coverage_details.alternative_medicine.covered_treatments', idx)}
                        placeholder="Add treatment (e.g. Ayurveda)..."
                    />
                </div>
            </Section>
        </div>
    )
}

// UI Components
function Section({ title, icon, children, className = '' }: any) {
    return (
        <section className={`bg-white/50 backdrop-blur-sm border border-stone-200/40 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}>
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined text-primary text-[28px]">{icon}</span>
            <h2 className="text-xl font-bold text-on-surface tracking-tight">{title}</h2>
          </div>
          {children}
        </section>
    )
}

function Field({ label, value, onChange, type = 'text' }: any) {
    return (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-on-surface-variant px-1">{label}</label>
          <input 
            type={type} 
            value={value} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            className="bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all shadow-sm focus:shadow-primary/5 text-on-surface font-medium"
          />
        </div>
    )
}

function ToggleField({ label, checked, onChange }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-white shadow-sm rounded-2xl border border-stone-200/20">
          <span className="font-bold text-on-surface">{label}</span>
          <button 
            onClick={() => onChange(!checked)}
            className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${checked ? 'bg-primary' : 'bg-stone-200'}`}
          >
            <div className={`w-6 h-6 rounded-full bg-white shadow-sm transition-all transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
    )
}

function ListEditor({ items, onAdd, onRemove, placeholder }: any) {
    return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(items || []).map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-2 bg-stone-100/80 text-on-surface-variant px-4 py-2 rounded-full border border-stone-200 text-xs font-bold animate-in zoom-in duration-200">
                {item}
                <button onClick={() => onRemove(i)} className="material-symbols-outlined text-[16px] font-bold hover:text-red-500 transition-colors">close</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder={placeholder}
              className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-primary text-sm shadow-sm"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  const val = (e.currentTarget as HTMLInputElement).value;
                  if (val) {
                    onAdd(val);
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
          </div>
        </div>
    )
}
