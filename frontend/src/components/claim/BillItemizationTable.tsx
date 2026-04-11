"use client";

import React from 'react';
import { BillLineItem } from '@/context/ClaimContext';

interface BillItemizationTableProps {
  lineItems: BillLineItem[];
  onLineItemChange: (index: number, field: keyof BillLineItem, value: any) => void;
  onAddLineItem: () => void;
  onRemoveLineItem: (index: number) => void;
  consultationFee: number;
  diagnosticTests: number;
  medicines: number;
  claimAmount: number;
}

export default function BillItemizationTable({
  lineItems,
  onLineItemChange,
  onAddLineItem,
  onRemoveLineItem,
  consultationFee,
  diagnosticTests,
  medicines,
  claimAmount
}: BillItemizationTableProps) {
  const lineItemsTotal = lineItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const categorizedTotal = consultationFee + diagnosticTests + medicines;

  return (
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
          onClick={onAddLineItem}
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
            {lineItems.map((item, idx) => (
              <tr key={idx} className="group hover:bg-surface-container-low/50 transition-colors">
                <td className="py-4 pl-4">
                  <input
                    value={item.description}
                    onChange={(e) => onLineItemChange(idx, 'description', e.target.value)}
                    className="w-full bg-transparent border-none focus:ring-0 font-bold text-on-surface placeholder:text-on-surface-variant/20"
                    placeholder="Item description..."
                  />
                </td>
                <td className="py-4 text-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onLineItemChange(idx, 'quantity', e.target.value)}
                    className="w-16 bg-surface-container-low/50 rounded-lg px-2 py-1 text-center border-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                  />
                </td>
                <td className="py-4 text-right">
                  <input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => onLineItemChange(idx, 'unit_price', e.target.value)}
                    className="w-24 bg-surface-container-low/50 rounded-lg px-2 py-1 text-right border-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                  />
                </td>
                <td className="py-4 text-right font-bold text-primary">
                  ₹{item.total_price?.toLocaleString()}
                </td>
                <td className="py-4 text-right pr-4">
                  <button
                    onClick={() => onRemoveLineItem(idx)}
                    className="text-error opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-error/5 rounded-lg"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {lineItems.length === 0 && (
          <div className="py-12 text-center text-on-surface-variant opacity-30 flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
            <p className="text-sm font-bold uppercase tracking-widest">No line items extracted</p>
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col md:flex-row justify-end gap-6 bg-surface-container-low rounded-2xl p-8 border border-outline-variant/5 shadow-inner">
        <div className="space-y-3 w-full md:w-80">
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant font-medium">Categorized Total (Fees/Tests)</span>
            <span className="font-bold">₹{categorizedTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-on-surface-variant font-medium">Billed Line Items Total</span>
            <span className="font-bold text-primary">₹{lineItemsTotal.toLocaleString()}</span>
          </div>
          <div className="h-px bg-outline-variant/20 my-4"></div>
          <div className="flex justify-between items-center text-xl">
            <span className="font-black tracking-tight">Final Claim Amount</span>
            <span className="font-black text-primary">₹{claimAmount?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
