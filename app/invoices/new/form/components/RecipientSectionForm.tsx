import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import { recipientFormSchema } from "./formSchemas";
import { useRecipientData } from "@/hooks/form-data/useRecipients";

// Form data type
type FormData = z.infer<typeof recipientFormSchema>;

// Default form values
const defaultFormData = {
  billTo: {
    recipientName: "",
    companyName: "",
    companyAddress: "",
    email: "",
    phone: "",
  },
  isSame: true,
  shipTo: {
    recipientName: "",
    companyName: "",
    companyAddress: "",
    email: "",
    phone: "",
  },
};

// Prop interface
interface RecipientSectionFormProps {
  toPrevStep: () => void;
  toNextStep: () => void;
}

const RecipientSectionForm = ({
  toPrevStep,
  toNextStep,
}: RecipientSectionFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(recipientFormSchema),
    defaultValues: { ...defaultFormData },
    mode: "onBlur", // Validate on blur to reduce re-renders
  });

  // Initializing local-storage custom hook
  const { recipientData, upsertRecipientData } = useRecipientData();

  // Watch the `isSame` checkbox to toggle shipping field behavior
  const isSame = useWatch({ control: form.control, name: "isSame" });

  // Function to submit form data
  function onSubmit(values: z.infer<typeof recipientFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    upsertRecipientData(values);
    toNextStep();
  }

  // Reusable field renderer for DRY code
  const renderField = (
    section: "billTo" | "shipTo",
    name: keyof z.infer<typeof recipientFormSchema>["billTo"],
    label: string,
    placeholder: string,
    required = false,
    type: "input" | "textarea" = "input",
    disabled = false
  ) => (
    <FormField
      control={form.control}
      name={`${section}.${name}`}
      render={({ field }) => (
        <FormItem
          className={`${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <FormLabel>
            {label} {required && <strong className="text-red-500">*</strong>}
          </FormLabel>
          <FormControl>
            {type === "input" ? (
              <Input
                className="focus-visible:ring-0"
                placeholder={placeholder}
                disabled={disabled}
                {...field}
              />
            ) : (
              <Textarea
                className="focus-visible:ring-0 min-h-[3px]"
                placeholder={placeholder}
                rows={1}
                disabled={disabled}
                {...field}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  // React Hook Form logic to reset errors when `isSame` changes to false
  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === "isSame" && values.isSame === true) {
        form.clearErrors("shipTo");
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, form.clearErrors]);

  // Performing side effect on `recipientData` and update the form default value on initial render
  useEffect(() => {
    if (recipientData) form.reset(recipientData);
  }, [recipientData]);

  return (
    <div className="w-full h-auto flex flex-col border border-muted-foreground/10 shadow-sm rounded-sm p-5 mx-auto gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-balance">
          Recipient Details
        </h1>
        <p className="text-sm mt-2 font-semibold text-muted-foreground/50">
          Following fields are pertinent to recipient of the invoice
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        >
          {/* Bill To Section */}
          <div className="flex flex-col col-span-1 gap-3">
            <h1 className="text-lg font-semibold">Bill to</h1>
            {renderField(
              "billTo",
              "recipientName",
              "Recipient Name",
              "e.g. John Doe",
              true
            )}
            {renderField(
              "billTo",
              "companyName",
              "Company Name",
              "Your company name",
              true
            )}
            {renderField(
              "billTo",
              "email",
              "Email",
              "e.g. abc@example.com",
              true
            )}
            {renderField("billTo", "phone", "Phone", "e.g. +92 000 000 0000")}
            {renderField(
              "billTo",
              "companyAddress",
              "Address",
              "Street, City, ZIP",
              true,
              "textarea"
            )}
          </div>

          {/* Ship To Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-lg font-semibold">Ship to</h1>
              <FormField
                control={form.control}
                name="isSame"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 m-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="m-0">Same as Bill to</FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {renderField(
              "shipTo",
              "recipientName",
              "Recipient Name",
              "e.g. John Doe",
              !isSame,
              "input",
              isSame
            )}
            {renderField(
              "shipTo",
              "companyName",
              "Company Name",
              "Your company name",
              !isSame,
              "input",
              isSame
            )}
            {renderField(
              "shipTo",
              "email",
              "Email",
              "e.g. abc@example.com",
              !isSame,
              "input",
              isSame
            )}
            {renderField(
              "shipTo",
              "phone",
              "Phone",
              "e.g. +92 000 000 0000",
              false,
              "input",
              isSame
            )}
            {renderField(
              "shipTo",
              "companyAddress",
              "Address",
              "Street, City, ZIP",
              !isSame,
              "textarea",
              isSame
            )}
          </div>

          {/* Form Actions */}
          <div className="col-span-2 flex items-center justify-center gap-2">
            <Button type="button" variant="secondary" onClick={toPrevStep}>
              Prev
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RecipientSectionForm;
