"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

export function InvoiceFooterForm() {
  const { register, control } = useFormContext();

  return (
    <div className="space-y-4 p-5 border border-muted rounded-lg shadow">
      <h2 className="text-xl font-bold">Invoice Footer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <FormField
            control={control}
            name="invoiceFooter.notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes or Special Instructions:</FormLabel>
                <FormControl>
                  <Textarea
                    className="focus-visible:ring-0"
                    placeholder="Any relevant information not already covered"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={control}
            name="invoiceFooter.terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms</FormLabel>
                <FormControl>
                  <Textarea
                    className="focus-visible:ring-0"
                    placeholder="Terms & Conditions, late fee interest or payment schedule"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2 col-span-1 md:col-span-2">
          <FormField
            control={control}
            name="invoiceFooter.thanksMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thanks Message</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="Thanks message for client/customer"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
