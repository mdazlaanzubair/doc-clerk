import { invoiceHeaderFormSchema } from "@/app/invoices/new/form/components/formSchemas";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

type InvoiceFormData = z.infer<typeof invoiceHeaderFormSchema>;

const STORAGE_KEY = "invoiceHeaderData";

export function useInvoiceHeader() {
  const [invoiceHeaderData, setInvoiceHeaderData] =
    useState<InvoiceFormData | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedJSON = JSON.parse(saved);

        // Convert date strings to Date objects
        if (parsedJSON.invoiceDate) {
          parsedJSON.invoiceDate = new Date(parsedJSON.invoiceDate);
        }
        if (parsedJSON.dueDate) {
          parsedJSON.dueDate = new Date(parsedJSON.dueDate);
        }

        const parsed = invoiceHeaderFormSchema.parse(parsedJSON);
        setInvoiceHeaderData(parsed);
      } catch (error) {
        console.warn("Invalid invoice header data in localStorage", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Add or update header data
  const upsertInvoiceHeader = useCallback((data: InvoiceFormData) => {
    const validated = invoiceHeaderFormSchema.parse(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    setInvoiceHeaderData(validated);
  }, []);

  // Delete header data
  const deleteInvoiceHeader = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setInvoiceHeaderData(null);
  }, []);

  return {
    invoiceHeaderData,
    upsertInvoiceHeader,
    deleteInvoiceHeader,
  };
}
