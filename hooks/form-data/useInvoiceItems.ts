import { invoiceItemsFormSchema } from "@/app/invoices/new/form/components/formSchemas";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

type InvoiceItemsFormData = z.infer<typeof invoiceItemsFormSchema>;

const STORAGE_KEY = "invoiceItemsData";

export function useInvoiceItems() {
  const [invoiceItemsData, setInvoiceItemsData] =
    useState<InvoiceItemsFormData | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedJSON = JSON.parse(saved);
        const parsed = invoiceItemsFormSchema.parse(parsedJSON);
        setInvoiceItemsData(parsed);
      } catch (error) {
        console.warn("Invalid invoice items data in localStorage", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Add or update invoice items data
  const upsertInvoiceItems = useCallback((data: InvoiceItemsFormData) => {
    const validated = invoiceItemsFormSchema.parse(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    setInvoiceItemsData(validated);
  }, []);

  // Delete invoice items data
  const deleteInvoiceItems = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setInvoiceItemsData(null);
  }, []);

  return {
    invoiceItemsData,
    upsertInvoiceItems,
    deleteInvoiceItems,
  };
}
