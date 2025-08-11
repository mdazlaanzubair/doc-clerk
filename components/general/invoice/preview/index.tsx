"use client";

import { Button } from "@/components/ui/button";
import { Edit2, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  InvoiceHeader,
  RecipientSection,
  InvoiceItemsSection,
  InvoiceFooter,
} from "./components";
import {
  useInvoiceHeader,
  useRecipientData,
  useInvoiceItems,
} from "@/hooks/form-data";
import { useInvoices } from "@/hooks/supabase/useInvoice";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { InvoiceFormInterface, InvoiceInterface } from "@/types";

interface InvoicePreviewProps {
  invoiceId?: string;
  editInvoice?: () => void;
}

const InvoicePreview = ({ invoiceId, editInvoice }: InvoicePreviewProps) => {
  // Initializing custom hooks
  const { invoiceHeaderData } = useInvoiceHeader();
  const { recipientData } = useRecipientData();
  const { invoiceItemsData } = useInvoiceItems();
  const { getInvoiceById, upsertInvoice, publishInvoice } = useInvoices();
  const { userId, isSignedIn } = useAuth();

  // Custom states
  type InvoiceDataType = InvoiceFormInterface | InvoiceInterface | null;
  const [invoiceData, setInvoiceData] = useState<InvoiceDataType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to save invoice to supabase
  const saveInvoice = async () => {
    if (!isSignedIn || !userId || !upsertInvoice) return;

    const reqBody = {
      ...invoiceData,
      userId: userId,
      isPublished: false,
      isArchive: false,
      downloadCount: 0,
      printCount: 0,
    };

    try {
      setIsLoading(true);
      const data = await upsertInvoice(reqBody);
      console.log(data);
      toast(`Invoice saved successfully`);
    } catch (error) {
      const errMsg = "Something went wrong while saving invoice to database";
      console.error(error);
      toast(`Error: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Performing side effect on data fields to set invoice data state
  useEffect(() => {
    if (invoiceId && invoiceId.length > 0 && getInvoiceById) {
      // Fetching from DB
      const fetchInvoiceData = async () => {
        try {
          setIsLoading(true);
          const data: InvoiceInterface = await getInvoiceById(invoiceId);
          setInvoiceData(data);
        } catch (error) {
          const errMsg = "Something went wrong while fetching invoice data";
          console.error(error);
          toast(`Error: ${errMsg}`);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInvoiceData();
    } else if (invoiceHeaderData && recipientData && invoiceItemsData) {
      setInvoiceData({
        ...invoiceHeaderData,
        ...recipientData,
        ...invoiceItemsData,
      });
    }
  }, [invoiceId, invoiceHeaderData, recipientData, invoiceItemsData]);

  if (isLoading) return <SkeletonInvoicePreview />;
  else if (!isLoading && invoiceData) {
    return (
      <div className="w-full h-full max-w-4xl flex flex-col mx-auto gap-5">
        <section
          id="invoice-actions"
          className="w-full max-w-3xl flex items-center justify-between gap-3 mx-auto mt-5"
        >
          <div className="flex items-center gap-3">
            {publishInvoice && invoiceData && "id" in invoiceData && (
              <Button
                variant="default"
                title="Publish"
                onClick={() => publishInvoice(invoiceData?.id)}
              >
                Publish
              </Button>
            )}
            <Button variant="secondary" title="Download">
              Download
            </Button>
            <Button variant="secondary" title="Print">
              Print
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {isSignedIn && (
              <Button
                variant="secondary"
                className="text-green-600 hover:text-green-700"
                title="Save"
                onClick={saveInvoice}
              >
                <Save />
                Save
              </Button>
            )}
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
          className="w-full min-h-[800px] h-auto max-w-3xl flex flex-col border border-muted-foreground/10 shadow-sm rounded-sm p-5 mx-auto gap-5"
        >
          <InvoiceHeader data={invoiceData} />
          <RecipientSection data={invoiceData} />
          <InvoiceItemsSection data={invoiceData} />
          <InvoiceFooter data={invoiceData} />
        </section>
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
