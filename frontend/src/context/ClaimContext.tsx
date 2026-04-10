"use client";

import React, { createContext, useContext, useState } from 'react';

export type BillLineItem = {
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type Documents = {
  prescription?: {
    doctor_name?: string;
    doctor_reg?: string;
    diagnoses: string[];
    medicines_prescribed?: string[];
    procedures?: string[];
    tests_prescribed?: string[];
    treatment?: string;
  };
  bill?: {
    consultation_fee?: number;
    diagnostic_tests?: number;
    medicines?: number;
    test_names?: string[];
    line_items?: BillLineItem[];
  };
};

export type CaseInput = {
  member_id: string;
  member_name: string;
  member_join_date?: string;
  treatment_date: string;
  claim_amount: number;
  previous_claims_same_day?: number;
  hospital?: string;
  cashless_request?: boolean;
  context?: string;
  documents: Documents;
};

export type CaseData = {
  case_id: string;
  case_name: string;
  description: string;
  input_data: CaseInput;
};

type ClaimContextType = {
  caseData: CaseData | null;
  setCaseData: (data: CaseData | null) => void;
  updateCaseData: (newData: Partial<CaseData>) => void;
  documentUrls: string[];
  setDocumentUrls: (urls: string[]) => void;
};

const ClaimContext = createContext<ClaimContextType | undefined>(undefined);

export function ClaimProvider({ children }: { children: React.ReactNode }) {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);

  const updateCaseData = (newData: Partial<CaseData>) => {
    setCaseData(prev => prev ? { ...prev, ...newData } : null);
  };

  return (
    <ClaimContext.Provider value={{ caseData, setCaseData, updateCaseData, documentUrls, setDocumentUrls }}>
      {children}
    </ClaimContext.Provider>
  );
}

export function useClaimContext() {
  const context = useContext(ClaimContext);
  if (!context) throw new Error("useClaimContext must be used within ClaimProvider");
  return context;
}
