import React from "react";
import {
  InvoiceHeader,
  RecipientSection,
  InvoiceItemsSection,
  InvoiceFooter,
} from "./components";
import { InvoiceInterface } from "@/types";

interface InvoicePreviewProps {
  invoiceData: InvoiceInterface | null;
  isLoading: boolean;
}

const InvoicePreview = ({ invoiceData, isLoading }: InvoicePreviewProps) => {
  if (isLoading) return <SkeletonInvoicePreview />;
  else if (!isLoading && invoiceData) {
    return (
      <div className="w-full h-full max-w-4xl flex flex-col mx-auto gap-5">
        <InvoiceHeader data={invoiceData} />
        <RecipientSection data={invoiceData} />
        <InvoiceItemsSection data={invoiceData} />
        <InvoiceFooter data={invoiceData} />
      </div>
    );
  }
};

export default InvoicePreview;

function SkeletonInvoicePreview() {
  return (
    <div className="w-full min-h-[800px] h-auto max-w-3xl mx-auto p-5 bg-white rounded-sm shadow-sm border border-muted-foreground/10">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-3">
          <div className="w-48 h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-64 h-4 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-40 h-4 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="text-right space-y-2">
          <div className="w-24 h-6 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
          <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Billing & Shipping */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-40 h-4 bg-gray-200 animate-pulse rounded"></div>
              <div className="w-36 h-4 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
      </div>

      {/* Table */}
      <div className="w-full border border-gray-300 rounded-lg overflow-hidden mb-6">
        <div className="grid grid-cols-4 bg-gray-100 p-3">
          <div className="w-10 h-4 bg-gray-300 rounded"></div>
          <div className="w-32 h-4 bg-gray-300 rounded"></div>
          <div className="w-16 h-4 bg-gray-300 rounded"></div>
          <div className="w-16 h-4 bg-gray-300 rounded"></div>
        </div>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 p-3 border-t border-gray-200"
          >
            <div className="w-10 h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>

      {/* Comments */}
      <div className="space-y-2 mb-6">
        <div className="w-40 h-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-full h-4 bg-gray-200 animate-pulse rounded"></div>
      </div>

      {/* Totals */}
      <div className="flex justify-end space-y-2 flex-col items-end mb-6">
        <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-32 h-4 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-32 h-5 bg-gray-300 animate-pulse rounded"></div>
      </div>

      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 bg-gray-200 animate-pulse rounded"></div>
      </div>

      {/* Footer */}
      <div className="w-64 h-4 mx-auto bg-gray-200 animate-pulse rounded"></div>
    </div>
  );
}
