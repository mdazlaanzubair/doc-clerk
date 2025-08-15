"use client";

import { useCallback } from "react";
import { InvoiceInterface } from "@/types";
import { useSupabase } from "@/provider/SupabaseProvider";
import { toast } from "sonner";

const DB_TABLE = "invoices";

export function useInvoices() {
  // Create a supabase client on the browser with project's credentials
  const { supabase } = useSupabase();

  if (!supabase) return null;

  /**
   * Get single invoice by ID
   */
  const getInvoiceById = useCallback(
    async (invoiceId: string, userId: string) => {
      const { data, error } = await supabase
        .from(DB_TABLE)
        .select("*")
        .eq("id", invoiceId)
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      return data as InvoiceInterface;
    },
    [supabase]
  );

  /**
   * Get all invoices by user ID
   */
  const getInvoices = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from(DB_TABLE)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InvoiceInterface[];
    },
    [supabase]
  );

  /**
   * Add new or update existing invoice
   * (Update only if not published)
   */
  const upsertInvoice = useCallback(
    async (invoice: Partial<InvoiceInterface> & { id?: string }) => {
      if (invoice.id) {
        // Check if published
        const { data: existing } = await supabase
          .from(DB_TABLE)
          .select("isPublished")
          .eq("id", invoice.id)
          .single();

        if (existing?.isPublished) {
          throw new Error("Cannot update a published invoice.");
        }
      }

      const payload = {
        ...invoice,
        isPublished: false,
        downloadCount: invoice.downloadCount ?? 0,
        printCount: invoice.printCount ?? 0,
      };

      const { data, error } = await supabase
        .from(DB_TABLE)
        .upsert(payload)
        .select()
        .single();

      if (error) throw error;
      return data as InvoiceInterface;
    },
    [supabase]
  );

  /**
   * Delete invoice (only if not published)
   */
  const deleteInvoice = useCallback(
    async (invoiceId: string, userId: string) => {
      const { data: existing } = await supabase
        .from(DB_TABLE)
        .select("isPublished")
        .eq("id", invoiceId)
        .eq("user_id", userId)
        .single();

      if (existing?.isPublished) {
        throw new Error("Cannot delete a published invoice.");
      }

      const { error } = await supabase
        .from(DB_TABLE)
        .delete()
        .eq("id", invoiceId);

      if (error) throw error;
      return true;
    },
    [supabase]
  );

  /**
   * Publish invoice (one-time only)
   */
  const publishInvoice = useCallback(
    async (invoiceId: string, userId: string) => {
      const { data: existing } = await supabase
        .from(DB_TABLE)
        .select("isPublished")
        .eq("id", invoiceId)
        .eq("user_id", userId)
        .single();

      if (existing?.isPublished) {
        toast.info("Invoice already published.");
      }

      const { data, error } = await supabase
        .from(DB_TABLE)
        .update({ isPublished: true })
        .eq("id", invoiceId)
        .select()
        .single();

      if (error) throw error;
      return data as InvoiceInterface;
    },
    [supabase]
  );

  /**
   * Toggle archive status
   */
  const toggleArchiveInvoice = useCallback(
    async (invoiceId: string) => {
      const { data: existing } = await supabase
        .from(DB_TABLE)
        .select("isArchive")
        .eq("id", invoiceId)
        .single();

      const newStatus = !existing?.isArchive;

      const { data, error } = await supabase
        .from(DB_TABLE)
        .update({ isArchive: newStatus })
        .eq("id", invoiceId)
        .select()
        .single();

      if (error) throw error;
      return data as InvoiceInterface;
    },
    [supabase]
  );

  /**
   * Increment download count
   */
  const incrementDownload = useCallback(
    async (invoiceId: string) => {
      const { data, error } = await supabase.rpc("increment_invoice_field", {
        field_name: "downloadCount",
        row_id: invoiceId,
      });
      if (error) throw error;
      return data;
    },
    [supabase]
  );

  /**
   * Increment print count
   */
  const incrementPrint = useCallback(
    async (invoiceId: string) => {
      const { data, error } = await supabase.rpc("increment_invoice_field", {
        field_name: "printCount",
        row_id: invoiceId,
      });
      if (error) throw error;
      return data;
    },
    [supabase]
  );

  return {
    getInvoiceById,
    getInvoices,
    upsertInvoice,
    deleteInvoice,
    publishInvoice,
    toggleArchiveInvoice,
    incrementDownload,
    incrementPrint,
  };
}
