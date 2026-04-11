"use client";

import React from 'react';

interface CaseHeaderProps {
  memberName: string;
  memberId: string;
  treatmentDate: string;
  context?: string;
}

export default function CaseHeader({ memberName, memberId, treatmentDate, context }: CaseHeaderProps) {
  return (
    <section className="bg-primary text-on-primary p-6 md:p-8 rounded-[24px] shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-[160px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-1 block">Case Header</span>
          <h1 className="text-3xl font-black tracking-tighter mb-1">{memberName}</h1>
          <div className="flex items-center gap-3 text-[11px] opacity-90">
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest text-[9px]">ID: {memberId}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest text-[9px]">Date: {treatmentDate}</span>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl max-w-sm border border-white/20 shadow-inner">
          <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-70">Claim Context</p>
          <p className="text-xs font-medium leading-relaxed italic line-clamp-2">"{context || 'No specific context provided.'}"</p>
        </div>
      </div>
    </section>
  );
}
