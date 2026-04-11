'use client';

import { useState, useEffect } from 'react';
import ReviewDetail from '@/components/admin/ReviewDetail';

export default function CaseReviewPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [verdicts, setVerdicts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [selectedVerdict, setSelectedVerdict] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8008';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [casesRes, verdictsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/admin/cases`),
        fetch(`${API_BASE_URL}/api/v1/admin/verdicts`)
      ]);
      
      const casesData = await casesRes.json();
      const verdictsData = await verdictsRes.json();
      
      setCases(casesData);
      setVerdicts(verdictsData);
    } catch (err) {
      console.error('Error fetching review data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectCase = (caseItem: any) => {
    const caseData = caseItem.data;
    // Find matching verdict by claim_id/case_id
    const verdictRow = verdicts.find(v => v.data.claim_id === caseData.case_id);
    setSelectedCase({ ...caseData, created_at: caseItem.created_at });
    setSelectedVerdict(verdictRow ? verdictRow.data : null);
  };

  const handleOverride = async (updatedVerdict: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/admin/verdict/override`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          claim_id: updatedVerdict.claim_id,
          verdict: updatedVerdict
        })
      });

      if (res.ok) {
        // Refresh data
        await fetchData();
        // Update selected verdict locally
        setSelectedVerdict(updatedVerdict);
      } else {
        alert('Failed to override verdict');
      }
    } catch (err) {
       console.error('Error overriding verdict:', err);
       alert('Connection error');
    }
  };

  const filteredCases = cases.filter(c => {
    const data = c.data;
    if (!data) return false;
    
    const search = searchTerm.toLowerCase();
    const caseId = data.case_id?.toLowerCase() || '';
    const memberName = data.input_data?.member_name?.toLowerCase() || '';
    const memberId = data.input_data?.member_id?.toLowerCase() || '';

    return (
      caseId.includes(search) ||
      memberName.includes(search) ||
      memberId.includes(search)
    );
  });

  return (
    <main className="pt-32 pb-20 px-8 max-w-[1400px] mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-on-surface mb-2">Case Review Dashboard</h1>
          <p className="text-on-surface-variant text-lg font-medium">Audit AI decisions, review uploaded artifacts, and override verdicts.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                type="text" 
                placeholder="Search by ID or Name..." 
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white border border-stone-200 rounded-2xl w-80 outline-none focus:border-primary transition-all shadow-sm"
              />
           </div>
           <button 
             onClick={fetchData} 
             className="w-12 h-12 bg-white border border-stone-200 rounded-2xl flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm"
           >
             <span className="material-symbols-outlined text-on-surface-variant">refresh</span>
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-primary uppercase tracking-[0.2em]">Retreiving Claims from Supabase...</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-100 rounded-[32px] overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-stone-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant border-b border-stone-100">
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Case ID</th>
                <th className="px-8 py-4">Patient / Member</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Date Submitted</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {filteredCases.map((caseItem, idx) => {
                const data = caseItem.data;
                const verdictRow = verdicts.find(v => v.data?.claim_id === data?.case_id);
                const verdict = verdictRow?.data;
                
                return (
                  <tr key={idx} className="hover:bg-stone-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <StatusBadge status={verdict?.decision || 'PENDING'} />
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{data?.case_id || 'N/A'}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-on-surface">{data?.input_data?.member_name || 'Unknown'}</span>
                        <span className="text-[10px] font-black text-on-surface-variant tracking-wider uppercase">{data?.input_data?.member_id || '-'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-on-surface">
                      {verdict ? (
                        <div className="flex flex-col">
                          <span className="text-primary">₹{verdict.approved_amount}</span>
                          <span className="text-[10px] text-on-surface-variant line-through">₹{data?.input_data?.claim_amount}</span>
                        </div>
                      ) : (
                        <span>₹{data?.input_data?.claim_amount || 0}</span>
                      )}
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-xs font-semibold text-on-surface-variant">{new Date(caseItem.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button 
                        onClick={() => handleSelectCase(caseItem)}
                        className="px-6 py-2 bg-stone-100 text-on-surface-variant rounded-xl text-xs font-black uppercase tracking-wider hover:bg-primary hover:text-on-primary transition-all"
                       >
                         Review
                       </button>
                    </td>
                  </tr>
                );
              })}
              {filteredCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-32 text-center">
                    <span className="material-symbols-outlined text-4xl text-stone-300 mb-2">inbox</span>
                    <p className="text-on-surface-variant font-medium">No claims found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedCase && (
        <ReviewDetail 
          caseData={selectedCase} 
          verdictData={selectedVerdict} 
          onClose={() => setSelectedCase(null)}
          onOverride={handleOverride}
        />
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    PARTIAL: 'bg-blue-100 text-blue-700',
    MANUAL_REVIEW: 'bg-amber-100 text-amber-700',
    PENDING: 'bg-stone-100 text-stone-500'
  }[status] || 'bg-stone-100 text-stone-500';

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles}`}>
      {status}
    </span>
  );
}
