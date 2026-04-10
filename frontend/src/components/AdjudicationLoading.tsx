"use client";

import { useState, useEffect } from "react";

const PHASES = [
  { top: "CONDUCTING", title: "Clinical Integrity Scan" },
  { top: "CONDUCTING", title: "Policy Coverage Calibration" },
  { top: "CONDUCTING", title: "Limit Constraint Analysis" },
  { top: "CONDUCTING", title: "Medical Protocol Review" },
  { top: "CONDUCTING", title: "Verdict Synthesis" },
];

export default function AdjudicationLoading() {
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase((prev) => (prev < PHASES.length - 1 ? prev + 1 : prev));
    }, 1500); // 1.5s as requested

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .blob {
          position: absolute;
          filter: blur(60px);
          border-radius: 50%;
          background: #ba0036;
          opacity: 0.04;
          animation: float 15s infinite ease-in-out;
        }
      `}</style>
      
      {/* Background Blobs */}
      <div className="blob w-[500px] h-[500px] -top-20 -left-20" />
      <div className="blob w-[400px] h-[400px] top-1/2 -right-20 animation-delay-2000" style={{ animationDelay: '2s' }} />
      <div className="blob w-[300px] h-[300px] -bottom-10 left-1/3 animation-delay-5000" style={{ animationDelay: '5s' }} />

      <div className="relative z-10 w-full max-w-md p-12 bg-white/40 backdrop-blur-xl rounded-[32px] border border-stone-100 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.05)] text-center">
        <div className="mb-12">
          <p className="text-[10px] font-black tracking-[0.3em] text-primary/50 mb-2 uppercase">
            {PHASES[currentPhase].top}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-on-surface">
            {PHASES[currentPhase].title}
          </h2>
        </div>

        <div className="space-y-4">
          {PHASES.map((phase, idx) => (
            <div key={idx} className="flex items-center gap-4 text-left">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                idx < currentPhase 
                  ? "bg-tertiary text-white" 
                  : idx === currentPhase 
                    ? "bg-primary/10 border-2 border-primary border-t-transparent animate-spin h-5 w-5 rounded-full" 
                    : "bg-stone-100"
              }`}>
                {idx < currentPhase && (
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                )}
                {idx === currentPhase && <div className="hidden" />}
              </div>
              <span className={`text-sm font-medium transition-all duration-500 ${
                idx <= currentPhase ? "text-on-surface" : "text-stone-300"
              }`}>
                {phase.title}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <div className="w-full bg-stone-100 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-1000 ease-out" 
              style={{ width: `${((currentPhase + 1) / PHASES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
