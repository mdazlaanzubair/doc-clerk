import { recipientFormSchema } from "@/components/general/invoice/form/components/formSchemas";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

type RecipientFormData = z.infer<typeof recipientFormSchema>;

const STORAGE_KEY = "recipientData";

export function useRecipientData() {
  const [recipientData, setRecipientData] = useState<RecipientFormData | null>(
    null
  );

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsedJSON = JSON.parse(saved);
        const parsed = recipientFormSchema.parse(parsedJSON);
        setRecipientData(parsed);
      } catch (error) {
        console.warn("Invalid recipient data in localStorage", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Add or update recipient data
  const upsertRecipientData = useCallback((data: RecipientFormData) => {
    const validated = recipientFormSchema.parse(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    setRecipientData(validated);
  }, []);

  // Delete recipient data
  const deleteRecipientData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecipientData(null);
  }, []);

  return {
    recipientData,
    upsertRecipientData,
    deleteRecipientData,
  };
}
