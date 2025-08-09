"use client";

import { Button } from "@/components/ui/button";
import { Edit2, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import InvoiceHeader from "./components/InvoiceHeader";
import RecipientSection from "./components/RecipientSection";
import InvoiceItemsSection from "./components/InvoiceItemsSection";
import InvoiceFooter from "./components/InvoiceFooter";
import { useInvoiceHeader } from "@/hooks/form-data/useInvoiceHeader";
import { useRecipientData } from "@/hooks/form-data/useRecipients";
import { useInvoiceItems } from "@/hooks/form-data/useInvoiceItems";

interface InvoicePreviewProps {
  invoiceId?: string;
  editInvoice?: () => void;
}

const InvoicePreview = ({ invoiceId, editInvoice }: InvoicePreviewProps) => {
  const { invoiceHeaderData } = useInvoiceHeader();
  const { recipientData } = useRecipientData();
  const { invoiceItemsData } = useInvoiceItems();

  const [invoiceData, setInvoiceData] = useState<any | null>(null);

  useEffect(() => {
    if (invoiceId && invoiceId.length > 0) {
      // Fetch from database
      return;
    } else if (
      invoiceHeaderData &&
      JSON.stringify(invoiceHeaderData).length &&
      recipientData &&
      JSON.stringify(recipientData).length &&
      invoiceItemsData &&
      JSON.stringify(invoiceItemsData).length
    ) {
      setInvoiceData({
        ...invoiceHeaderData,
        ...recipientData,
        ...invoiceItemsData,
      });
    }
  }, [invoiceId, invoiceHeaderData, recipientData, invoiceItemsData]);

  if (!invoiceData) return <div>No data</div>;

  return (
    <div className="w-full h-full max-w-4xl flex flex-col mx-auto gap-5">
      <section
        id="invoice-actions"
        className="w-full max-w-3xl flex items-center justify-between gap-3 mx-auto mt-5"
      >
        <div className="flex items-center gap-3">
          <Button variant="default" title="Publish">
            Publish
          </Button>
          <Button variant="secondary" title="Download">
            Download
          </Button>
          <Button variant="secondary" title="Print">
            Print
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="text-green-600 hover:text-green-700"
            title="Save"
          >
            <Save />
            Save
          </Button>
          {editInvoice && (
            <Button
              variant="secondary"
              className="text-blue-600 hover:text-blue-700"
              size="icon"
              title="Edit"
              onClick={editInvoice}
            >
              <Edit2 />
            </Button>
          )}
        </div>
      </section>
      <section
        id="single-invoice-section"
        className="w-full min-h-[800px] h-auto max-w-3xl flex flex-col py-3 border border-muted-foreground/10 shadow-sm rounded-sm p-5 mx-auto gap-5"
      >
        <InvoiceHeader data={invoiceData} />
        <RecipientSection data={invoiceData} />
        <InvoiceItemsSection data={invoiceData} />
        <InvoiceFooter data={invoiceData} />
      </section>
    </div>
  );
};

export default InvoicePreview;
