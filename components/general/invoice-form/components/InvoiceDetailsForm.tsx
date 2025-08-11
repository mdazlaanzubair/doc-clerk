"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

export function InvoiceDetailsForm() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4 p-5 border border-muted rounded-lg shadow">
      <h2 className="text-xl font-bold mb-3">Invoice Details</h2>
      <p className="text-sm mb-5">
        Following fields are pertinent to invoice details
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FormField
            control={control}
            name="invoiceDetails.invoiceTitle"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Invoice Title</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="Title of invoice"
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
            name="invoiceDetails.invoiceNumber"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>
                  Invoice Number <strong className="text-red-500">*</strong>
                </FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="Reference number for invoice"
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
            name="invoiceDetails.invoiceDate"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>
                  Invoice Date <strong className="text-red-500">*</strong>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="secondary"
                        className={cn(
                          "text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value instanceof Date ? field.value : undefined
                      }
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={control}
            name="invoiceDetails.dueDate"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>
                  Due Date <strong className="text-red-500">*</strong>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="secondary"
                        className={cn(
                          "text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Select a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value instanceof Date ? field.value : undefined
                      }
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={control}
            name="invoiceDetails.currency"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>
                  Currency <strong className="text-red-500">*</strong>
                </FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="Currency of payment"
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
            name="invoiceDetails.preparedBy"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Prepared by</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="Person who prepared the invoice"
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
            name="invoiceDetails.poNumber"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="Reference number for purchase order"
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
