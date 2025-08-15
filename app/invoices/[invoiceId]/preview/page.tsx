"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import InvoicePreview from "@/components/general/invoice/preview";
import { InvoiceInterface } from "@/types";
import { useInvoices } from "@/hooks/useInvoice";
import { SignedIn, useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { deleteInvoice, getInvoiceById } from "@/lib/utils";

const SingleInvoice = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const router = useRouter();

  // Initializing custom hooks
  const InvoiceAPI = useInvoices();
  const { userId } = useAuth();

  // Custom states
  const [invoiceData, setInvoiceData] = useState<InvoiceInterface | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to delete invoice by id
  const handleDeleteInvoice = async () => {
    if (!userId || userId.length <= 0) {
      deleteInvoice(invoiceId);
      toast.success("Invoice deleted successfully!");
      router.push("/invoices");
    }

    if (userId && InvoiceAPI) {
      try {
        setIsLoading(true);
        await InvoiceAPI.deleteInvoice(invoiceId, userId);
        toast.success("Invoice deleted successfully!");
        router.push("/invoices");
      } catch (error) {
        const errMsg = "Something went wrong while deleting invoice";
        console.error(error);
        toast.error(errMsg);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Function to handle edit invoice by id
  const handleEditInvoice = () => {
    router.push(`/invoices/${invoiceId}/edit`);
  };

  // Function to handle publish invoice
  const handlePublishInvoice = async () => {
    if (!userId || userId.length <= 0 || !InvoiceAPI) return;
    if (invoiceData && invoiceData.isPublished) {
      toast.info("Invoice is already published!");
      return;
    }

    try {
      setIsLoading(true);
      const data: InvoiceInterface = await InvoiceAPI.publishInvoice(
        invoiceId,
        userId
      );
      setInvoiceData(data);
      toast.success("Invoice published successfully!");
    } catch (error) {
      const errMsg = "Something went wrong while fetching invoice data";
      console.error(error);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Performing side effect on data fields to set invoice data state
  useEffect(() => {
    if (!invoiceId || invoiceId.length <= 0) return;

    // If user is not logged in fetch data from local storage
    if (!userId || userId.length <= 0) {
      const data = getInvoiceById(invoiceId);
      setInvoiceData(data);
      return;
    }

    // If storage type is not available check for user ID and Invoice API client
    // if they are not available seth the invoice data as null
    if (InvoiceAPI) {
      // Else fetch the invoice data from database by invoice id
      // Fetching from DB
      const fetchInvoiceData = async () => {
        try {
          setIsLoading(true);
          const data: InvoiceInterface = await InvoiceAPI.getInvoiceById(
            invoiceId,
            userId
          );
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
    }
  }, [invoiceId, userId, InvoiceAPI]);

  if (!invoiceData) router.push("/invoices");
  else {
    return (
      <div className="w-full h-full max-w-4xl flex flex-col mx-auto gap-5 my-5">
        <section
          id="invoice-actions"
          className="w-full max-w-3xl flex items-center justify-between gap-3 mx-auto mt-5"
        >
          <div className="flex items-center gap-3">
            <SignedIn>
              <Button
                variant="default"
                title="Publish"
                onClick={handlePublishInvoice}
                disabled={invoiceData.isPublished}
              >
                Publish
              </Button>
            </SignedIn>
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
              className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-50"
              size="icon"
              title="Edit"
              onClick={handleEditInvoice}
            >
              <Edit2 />
            </Button>
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-50"
              size="icon"
              title="Delete"
              onClick={handleDeleteInvoice}
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
  }
};

export default SingleInvoice;
