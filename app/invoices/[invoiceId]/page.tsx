"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Save, Trash2 } from "lucide-react";
import InvoicePreview from "@/components/general/invoice/preview";
import { InvoiceInterface } from "@/types";
import { useInvoices } from "@/hooks/useInvoice";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const SingleInvoice = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();

  // Initializing custom hooks
  const { getInvoiceById } = useInvoices();
  const { userId, isSignedIn } = useAuth();

  // Custom states
  const [invoiceData, setInvoiceData] = useState<InvoiceInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Performing side effect on data fields to set invoice data state
  useEffect(() => {
    if (!invoiceId || !isSignedIn || !userId || !getInvoiceById) return;
    if (userId.length <= 0 || invoiceId.length <= 0) return;

    // Fetching from DB
    const fetchInvoiceData = async () => {
      try {
        setIsLoading(true);
        const data: InvoiceInterface = await getInvoiceById(invoiceId, userId);
        setInvoiceData(data);
      } catch (error) {
        const errMsg = "Something went wrong while fetching invoice data";
        console.error(error);
        toast.error(errMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceData();
  }, [invoiceId, isSignedIn, userId, getInvoiceById]);

  return (
    <div className="w-full h-full max-w-4xl flex flex-col mx-auto gap-5 my-5">
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
            className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-50"
            title="Save"
          >
            <Save />
            Save
          </Button>
          <Button
            variant="secondary"
            className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-50"
            size="icon"
            title="Edit"
          >
            <Edit2 />
          </Button>
          <Button
            variant="ghost"
            className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-50"
            size="icon"
            title="Delete"
          >
            <Trash2 />
          </Button>
        </div>
      </section>
      <section
        id="single-invoice-section"
        className="w-full min-h-[800px] h-auto max-w-3xl flex flex-col py-3 border border-muted-foreground/10 shadow-sm rounded-sm p-5 mx-auto gap-5"
      >
        <InvoicePreview invoiceData={invoiceData} isLoading={isLoading} />
      </section>
    </div>
  );
};

export default SingleInvoice;
