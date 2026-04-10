"use client";

import React, { createContext, useContext, useState } from 'react';

export type CaseData = {
  member_id: string;
  member_name: string;
  treatment_date: string;
  claim_amount: number;
  previous_claims_same_day: number;
  hospital: string;
  cashless_request: boolean;
  documents: {
    prescription: any;
    bill: any;
  };
};

type ClaimContextType = {
  caseData: CaseData | null;
  setCaseData: (data: CaseData | null) => void;
  documentUrls: string[];
  setDocumentUrls: (urls: string[]) => void;
};

const ClaimContext = createContext<ClaimContextType | undefined>(undefined);

export function ClaimProvider({ children }: { children: React.ReactNode }) {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);

  return (
    <ClaimContext.Provider value={{ caseData, setCaseData, documentUrls, setDocumentUrls }}>
      {children}
    </ClaimContext.Provider>
  );
}

export function useClaimContext() {
  const context = useContext(ClaimContext);
  if (!context) throw new Error("useClaimContext must be used within ClaimProvider");
  return context;
}
