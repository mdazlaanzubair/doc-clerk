"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import { format } from "date-fns";
import { cn, generateRandomID } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { invoiceHeaderFormSchema } from "./formSchemas";
import Link from "next/link";
import { useInvoiceHeader } from "@/hooks/form-data/useInvoiceHeader";

// Define form data type based on Zod schema
type FormData = z.infer<typeof invoiceHeaderFormSchema>;

// Default values for form fields
const currentDate = new Date();
const defaultDueDate = new Date(currentDate);
defaultDueDate.setDate(currentDate.getDate() + 30);

const defaultFormData: FormData = {
  invoiceNumber: "",
  companyName: "",
  companyEmail: "",
  companyAddress: "",
  invoiceDate: currentDate,
  dueDate: defaultDueDate,
  currency: "$",
  invoiceTitle: "INVOICE",
  poNumber: "",
  companyPhone: "",
  companySlogan: "",
};

// Prop interface
interface InvoiceHeaderFormProps {
  toNextStep: () => void;
}

const InvoiceHeaderForm = ({ toNextStep }: InvoiceHeaderFormProps) => {
  // Initialize form with react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(invoiceHeaderFormSchema),
    defaultValues: defaultFormData,
    mode: "onChange", // Validate on blur to reduce re-renders
  });

  // Initializing local-storage custom hook
  const { invoiceHeaderData, upsertInvoiceHeader } = useInvoiceHeader();

  // Generates a unique invoice number using company initials (if provided) and a random ID.
  const generateInvoiceID = () => {
    const randomID = generateRandomID();
    const companyName = form.getValues("companyName");
    const initials = companyName
      ? companyName
          .split(" ")
          .map((word) => word[0])
          .join("") + "-"
      : "";
    form.setValue("invoiceNumber", `${initials}${randomID}`);
  };

  // Handles form submission with validated data
  const onSubmit = (values: FormData) => {
    console.log(values);
    upsertInvoiceHeader(values);
    toNextStep();
    // TODO: Handle form submission logic (API call, state update, etc.)
  };

  // Renders a text input field
  const renderTextField = (
    name: keyof FormData,
    label: string,
    placeholder: string,
    required = false
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-3">
          <FormLabel>
            {label} {required && <strong className="text-red-500">*</strong>}
          </FormLabel>
          <FormControl>
            <Input
              className="focus-visible:ring-0"
              placeholder={placeholder}
              {...field}
              value={
                field.value instanceof Date
                  ? field.value.toISOString().slice(0, 10)
                  : field.value ?? ""
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  // Renders a date picker field
  const renderDateField = (name: keyof FormData, label: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col mb-3">
          <FormLabel>
            {label} <strong className="text-red-500">*</strong>
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
                selected={field.value instanceof Date ? field.value : undefined}
                onSelect={field.onChange}
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  // Performing side effect on `invoiceHeaderData` and update the form default value on initial render
  useEffect(() => {
    if (invoiceHeaderData) form.reset(invoiceHeaderData);
  }, [invoiceHeaderData]);

  return (
    <div className="w-full border border-muted-foreground/10 shadow-sm rounded-sm p-5 mx-auto gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Issuer Details
        </h1>
        <p className="text-sm mt-2 font-semibold text-muted-foreground/50">
          Fill in the fields relevant to your business or the invoice issuer.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start my-5"
        >
          {renderTextField("invoiceTitle", "Invoice Title", "INVOICE")}

          {renderTextField(
            "companyName",
            "Company Name",
            "Your company name",
            true
          )}
          {renderTextField(
            "companySlogan",
            "Company Slogan",
            "Your company slogan"
          )}
          {renderTextField(
            "companyEmail",
            "Email",
            "e.g. abc@example.com",
            true
          )}
          {renderTextField("companyPhone", "Phone", "e.g. +92 000 000 0000")}
          {renderTextField("poNumber", "PO Number", "Purchase order number")}

          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem className="col-span-2 mb-3">
                <FormLabel>
                  Address <strong className="text-red-500">*</strong>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="focus-visible:ring-0 min-h-[3px] max-h-[50px] overflow-x-hidden overflow-y-auto"
                    placeholder="e.g. Street Address, City, ZIP Code"
                    rows={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="invoiceNumber"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel className="flex items-center">
                  Invoice Number <strong className="text-red-500">*</strong>
                  <button
                    type="button"
                    title="Generate Invoice Number"
                    onClick={generateInvoiceID}
                    className="ml-auto text-xs text-blue-500 hover:text-blue-700 transition"
                  >
                    Generate
                  </button>
                </FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="Invoice Number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {renderDateField("invoiceDate", "Invoice Date")}
          {renderDateField("dueDate", "Due Date")}
          {renderTextField("currency", "Currency", "e.g. Rs., $, ₹, etc", true)}

          <div className="col-span-3 flex items-center justify-center gap-2">
            <Button type="button" variant="ghost" asChild>
              <Link href="/invoices">Go back</Link>
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InvoiceHeaderForm;
