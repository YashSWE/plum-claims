'use client';

import { useState } from 'react';

export default function AccuracyMetrics() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runEvaluation = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8008/api/v1/evaluation/run');
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAccuracyColor = (val: number) => {
    if (val >= 0.9) return 'text-green-600';
    if (val >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <main className="pt-32 pb-20 px-8 max-w-[1200px] mx-auto text-on-surface">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter text-primary mb-2">AI Accuracy Metrics</h1>
          <p className="text-on-surface-variant text-lg">Benchmark the adjudication engine against 10 gold-standard ground truth cases.</p>
        </div>
        <button 
          onClick={runEvaluation}
          disabled={loading}
          className={`group flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-primary/20 ${loading ? 'bg-stone-200 text-stone-500' : 'bg-primary text-on-primary hover:scale-[1.02] active:scale-[0.98]'}`}
        >
          <span className={`material-symbols-outlined ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}>refresh</span>
          {loading ? 'Evaluating...' : 'Run Evaluation'}
        </button>
      </div>

      {!results && !loading && (
        <div className="bg-white/40 border border-dashed border-stone-300 rounded-[32px] p-24 text-center">
            <span className="material-symbols-outlined text-stone-300 text-6xl mb-4">analytics</span>
            <p className="text-on-surface-variant font-medium text-xl">Click "Run Evaluation" to start the benchmarking process.</p>
        </div>
      )}

      {results && (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
                label="Overall Passed" 
                value={`${results.passed}/${results.total}`} 
                subtext="Cases entirely matched"
                icon="check_circle"
                color="bg-primary/10 text-primary"
            />
            <MetricCard 
                label="Decision Accuracy" 
                value={`${(results.decision_accuracy * 100).toFixed(1)}%`} 
                subtext="Approved/Rejected match"
                icon="rule"
                color="bg-purple-100 text-purple-700"
            />
            <MetricCard 
                label="Financial Parity" 
                value={`${(results.financial_accuracy * 100).toFixed(1)}%`} 
                subtext="Payout amount match"
                icon="payments"
                color="bg-green-100 text-green-700"
            />
            <MetricCard 
                label="Avg Confidence" 
                value={`${(results.avg_confidence * 100).toFixed(0)}%`} 
                subtext="AI certainty index"
                icon="psychology"
                color="bg-blue-100 text-blue-700"
            />
          </div>

          {/* Detailed Table */}
          <div className="bg-white/80 backdrop-blur-md rounded-[32px] border border-stone-200/60 overflow-hidden shadow-xl shadow-stone-200/40">
            <div className="px-8 py-6 border-b border-stone-100/60 bg-stone-50/50 flex justify-between items-center">
                <h3 className="text-xl font-bold tracking-tight">Case-by-Case Breakdown</h3>
                <span className="text-sm font-semibold text-on-surface-variant bg-white px-3 py-1 rounded-full border border-stone-200/40">10 Total Cases</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50/30 text-[11px] uppercase tracking-widest font-bold text-on-surface-variant/60">
                    <th className="px-8 py-4">Case ID</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4">Expeced vs Actual</th>
                    <th className="px-8 py-4">Approved Amount</th>
                    <th className="px-8 py-4 text-right">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100/60">
                  {results.cases.map((cs: any) => (
                    <tr key={cs.case_id} className="group hover:bg-stone-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-primary">{cs.case_id}</div>
                        <div className="text-xs text-on-surface-variant font-medium mt-0.5">{cs.name}</div>
                      </td>
                      <td className="px-8 py-5">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${cs.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          <span className="material-symbols-outlined text-[14px]">{cs.passed ? 'done' : 'error'}</span>
                          {cs.passed ? 'PASSED' : 'FAILED'}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-tighter">{cs.expected.decision}</span>
                          <span className="material-symbols-outlined text-stone-300 text-[18px]">trending_flat</span>
                          <span className={`text-xs font-bold uppercase tracking-tighter ${cs.expected.decision === cs.actual.decision ? 'text-green-600' : 'text-red-500 font-black'}`}>{cs.actual.decision}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex flex-col">
                            <span className="text-sm font-bold">₹{cs.actual.approved_amount.toLocaleString()}</span>
                            <span className={`text-[10px] font-bold ${cs.variance === 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {cs.variance === 0 ? 'Perfect Match' : `Variance: ₹${cs.variance.toLocaleString()}`}
                            </span>
                         </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                            <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${cs.actual.confidence * 100}%` }}></div>
                            </div>
                            <span className="text-xs font-black text-primary font-mono w-10">{(cs.actual.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function MetricCard({ label, value, subtext, icon, color }: any) {
    return (
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-[28px] border border-stone-200/40 shadow-sm flex flex-col gap-1 hover:border-primary/30 transition-colors">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                <span className="material-symbols-outlined">{icon}</span>
            </div>
            <span className="text-sm font-semibold text-on-surface-variant">{label}</span>
            <span className="text-3xl font-black tracking-tighter text-on-surface">{value}</span>
            <span className="text-[11px] font-bold text-on-surface-variant/60 uppercase tracking-wider">{subtext}</span>
        </div>
    )
}
