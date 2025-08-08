"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Percent, Plus, TriangleAlert, X } from "lucide-react";
import { invoiceItemsFormSchema } from "./formSchemas";
import { Textarea } from "@/components/ui/textarea";
import { useInvoiceItems } from "@/hooks/form-data/useInvoiceItems";

// Form data type
type FormData = z.infer<typeof invoiceItemsFormSchema>;

// Default item values
const defaultItem = {
  itemDesc: "",
  qty: 1,
  cost: 1,
};

// Default form values
const defaultFormData = {
  items: [defaultItem],
  discount: 0,
  isDiscountAmt: true,
  tax: 0,
  isTaxAmt: true,
  shipping: 0,
  amountPaid: 0,
  notes: "Make all checks payable to [Company Name]",
  thanksMessage: "THANK YOU FOR YOUR BUSINESS!",
  terms: "",
};

// Prop interface
interface InvoiceItemsFormProps {
  toPrevStep: () => void;
}

const InvoiceItemsForm = ({ toPrevStep }: InvoiceItemsFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(invoiceItemsFormSchema),
    defaultValues: { ...defaultFormData },
    mode: "onChange", // Validate on blur to reduce re-renders
  });
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // Initializing local-storage custom hook
  const { invoiceItemsData, upsertInvoiceItems } = useInvoiceItems();

  // States to handling dynamic rendering of form fields
  const [optionalFields, setOptionalFields] = useState({
    discount: false,
    tax: false,
    shipping: false,
  });
  const toggleField = (field: keyof typeof optionalFields) => {
    setOptionalFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // State to hold calculations
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    total: 0,
    balanceDue: 0,
  });

  // Field array hook for dynamic rows
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "items",
  });

  // Observing changes in fields for calculation
  const isTaxAmt = watch("isTaxAmt");
  const isDiscountAmt = watch("isDiscountAmt");
  const discount = Number(watch("discount") || 0);
  const tax = Number(watch("tax") || 0);
  const shipping = Number(watch("shipping") || 0);
  const amountPaid = Number(watch("amountPaid") || 0);
  const items = watch("items") || [];

  // Preforming side effect on form fields and calculating sum on form values change
  useEffect(() => {
    // Calculate the subtotal by summing up the cost of all items
    let subtotal = items.reduce(
      (sum, item) => sum + (Number(item.cost) || 0) * (Number(item.qty) || 0),
      0
    );
    subtotal = Number(subtotal.toFixed(2));

    // Calculate discount based on whether it's an amount or percentage
    // Only calculate discount when it is set true in optional fields
    let discountValue = 0;
    if (optionalFields.discount) {
      discountValue = isDiscountAmt ? discount : (subtotal * discount) / 100;
      discountValue = Number(discountValue.toFixed(2));
    }

    // Calculate tax based on whether it's an amount or percentage
    // Only calculate tax when it is set true in optional fields
    let taxValue = 0;
    if (optionalFields.tax) {
      taxValue = isTaxAmt ? tax : ((subtotal - discountValue) * tax) / 100;
      taxValue = Number(taxValue.toFixed(2));
    }

    // Only calculate shipping when it is set true in optional fields
    let shippingValue = 0;
    if (optionalFields.shipping) {
      shippingValue = shipping;
    }

    // Calculate the total amount after applying discount, tax, and shipping
    let total = subtotal - discountValue + taxValue + shippingValue;
    total = Number(total.toFixed(2));

    // Calculate the balance due after deducting the amount paid
    let balanceDue = total - amountPaid;
    balanceDue = Number(balanceDue.toFixed(2));

    // Updating state with calculated values
    setCalculations({
      subtotal,
      total,
      balanceDue,
    });
  }, [
    isDiscountAmt,
    isTaxAmt,
    discount,
    tax,
    shipping,
    amountPaid,
    JSON.stringify(items),
  ]);

  // Performing side effect on `optionalFields` and updating their values in form accordingly
  useEffect(() => {
    if (!optionalFields.discount) form.setValue("discount", 0);
    if (!optionalFields.tax) form.setValue("tax", 0);
    if (!optionalFields.shipping) form.setValue("shipping", 0);
  }, [JSON.stringify(optionalFields)]);

  // Function to submit form data
  function onSubmit(values: z.infer<typeof invoiceItemsFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    upsertInvoiceItems(values);
  }

  // Performing side effect on `invoiceItemsData` and update the form default value on initial render
  useEffect(() => {
    if (invoiceItemsData) form.reset(invoiceItemsData);
    if (invoiceItemsData?.discount) toggleField("discount");
    if (invoiceItemsData?.tax) toggleField("tax");
    if (invoiceItemsData?.shipping) toggleField("shipping");
  }, [invoiceItemsData]);

  return (
    <div className="w-full h-auto flex flex-col border border-muted-foreground/10 shadow-sm rounded-sm p-5 mx-auto gap-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-balance">
          Invoice Item(s)
        </h1>
        <p className="text-sm mt-2 font-semibold text-muted-foreground/50">
          Following are the billing fields for which invoice is being prepared
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Form error messages */}
          {Array.isArray(errors.items) && (
            <ul className="flex items-center gap-2 text-xs text-red-500 bg-red-100 border border-red-200 rounded-sm mb-3">
              <li className="w-full px-3 py-1">
                <strong className="flex items-center gap-2 ">
                  <TriangleAlert className="w-3" />
                  Error
                </strong>
                <ul className="w-full list-disc ml-4 max-h-[5rem] overflow-auto">
                  {errors.items.map((itemError, idx) => (
                    <React.Fragment key={idx}>
                      {itemError?.itemDesc && (
                        <li>
                          <strong>Row {idx + 1}:</strong>{" "}
                          {itemError.itemDesc.message}
                        </li>
                      )}
                      {itemError?.qty && (
                        <li>
                          <strong>Row {idx + 1}:</strong>{" "}
                          {itemError.qty.message}
                        </li>
                      )}
                      {itemError?.cost && (
                        <li>
                          <strong>Row {idx + 1}:</strong>{" "}
                          {itemError.cost.message}
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </li>
            </ul>
          )}

          {/* Form header */}
          <header className="grid grid-cols-12">
            <div className="col-span-1 bg-black text-white text-center text-xs uppercase font-semibold px-1 py-2">
              #
            </div>
            <div className="col-span-4 bg-black text-white text-center text-xs uppercase font-bold px-1 py-2">
              Items Description
            </div>
            <div className="col-span-2 bg-black text-white text-center text-xs uppercase font-bold px-1 py-2">
              Quantity
            </div>
            <div className="col-span-2 bg-black text-white text-center text-xs uppercase font-bold px-1 py-2">
              Unit Price
            </div>
            <div className="col-span-2 bg-black text-white text-center text-xs uppercase font-bold px-1 py-2">
              Amount
            </div>
            <div className="col-span-1 bg-black text-white text-center text-xs uppercase font-bold px-1 py-2"></div>
          </header>

          {/* Table body */}
          {fields.map((field, index) => {
            const qty = watch(`items.${index}.qty`) || 0;
            const cost = watch(`items.${index}.cost`) || 0;
            const amount = qty * cost;

            return (
              <div
                className="grid grid-cols-12 items-center gap-4 py-3 border-b border-muted"
                key={field.id}
              >
                {/* Index Number */}
                <div className="text-center col-span-1">{index + 1}</div>

                {/* Item Description */}
                <FormField
                  control={control}
                  name={`items.${index}.itemDesc`}
                  render={({ field }) => (
                    <FormItem className="col-span-4">
                      <FormControl>
                        <Input
                          type="text"
                          className="focus-visible:ring-0 "
                          placeholder="e.g. Computer, Phone, Car, etc."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Quantity */}
                <FormField
                  control={control}
                  name={`items.${index}.qty`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input
                          className="focus-visible:ring-0 "
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Unit Price */}
                <FormField
                  control={control}
                  name={`items.${index}.cost`}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input
                          className="focus-visible:ring-0 "
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <div className="text-center font-medium col-span-2 overflow-x-auto whitespace-nowrap">
                  $ {amount.toFixed(2)}
                </div>

                {/* Delete Button */}
                <div className="col-span-1">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (fields.length > 1) remove(index);
                      }}
                      className="hover:bg-transparent hover:rotate-180 text-red-500 hover:text-red-700"
                      disabled={fields.length === 1} // Prevent deleting last row
                    >
                      <X />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex items-center justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => append(defaultItem)}
              className="ml-auto hover:bg-transparent text-blue-500 hover:text-blue-700"
            >
              <Plus /> Add Item
            </Button>
          </div>

          <div className="grid grid-cols-12 gap-3 my-5 text-sm items-start">
            <div className="col-span-6 flex flex-col gap-5">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-2 mb-3">
                    <FormLabel className="text-sm font-extrabold tracking-tight">
                      Comments or Special Instructions:{" "}
                      <em className="font-normal text-muted-foreground/30">
                        (optional)
                      </em>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="focus-visible:ring-0"
                        placeholder="Any relevant information not already covered"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="col-span-2 mb-3">
                    <FormLabel className="text-sm font-extrabold tracking-tight">
                      Terms:{" "}
                      <em className="font-normal text-muted-foreground/30">
                        (optional)
                      </em>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="focus-visible:ring-0"
                        placeholder="Terms & Conditions, late fee interest or payment schedule"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-5 font-semibold">
                <div className="text-end">Subtotal</div>
                <div className="">$ {calculations.subtotal}</div>
              </div>

              {!optionalFields.discount ||
              !optionalFields.tax ||
              !optionalFields.shipping ? (
                <div className="flex items-center justify-end">
                  {!optionalFields.discount && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleField("discount")}
                      className="hover:bg-transparent text-green-500 hover:text-green-700"
                    >
                      <Plus /> Discount
                    </Button>
                  )}

                  {!optionalFields.tax && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleField("tax")}
                      className="hover:bg-transparent text-green-500 hover:text-green-700"
                    >
                      <Plus /> Tax
                    </Button>
                  )}

                  {!optionalFields.shipping && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleField("shipping")}
                      className="hover:bg-transparent text-green-500 hover:text-green-700"
                    >
                      <Plus /> Shipping
                    </Button>
                  )}
                </div>
              ) : null}

              {optionalFields.discount && (
                <FormField
                  control={control}
                  name="discount"
                  render={({ field }) => (
                    <FormItem className="mb-3 w-full">
                      <div className="grid grid-cols-2 gap-5">
                        <FormLabel className="justify-end">Discount</FormLabel>
                        <div className="flex items-center gap-1">
                          <FormControl>
                            <Input
                              className="focus-visible:ring-0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>

                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() =>
                              setValue("isDiscountAmt", !isDiscountAmt)
                            }
                          >
                            {isDiscountAmt ? <Banknote /> : <Percent />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => toggleField("discount")}
                            className="hover:bg-transparent hover:rotate-180 text-green-500 hover:text-green-700"
                          >
                            <X />
                          </Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {optionalFields.tax && (
                <FormField
                  control={control}
                  name="tax"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <div className="grid grid-cols-2 gap-5">
                        <FormLabel className="justify-end">Tax</FormLabel>
                        <div className="flex items-center gap-1">
                          <FormControl>
                            <Input
                              className="focus-visible:ring-0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>

                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => setValue("isTaxAmt", !isTaxAmt)}
                            className="hover:bg-transparent hover:rotate-180 text-green-500 hover:text-green-700"
                          >
                            {isTaxAmt ? <Banknote /> : <Percent />}
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => toggleField("tax")}
                            className="hover:bg-transparent hover:rotate-180 text-red-500 hover:text-red-700"
                          >
                            <X />
                          </Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {optionalFields.shipping && (
                <FormField
                  control={control}
                  name="shipping"
                  render={({ field }) => (
                    <FormItem className="mb-3">
                      <div className="grid grid-cols-2 gap-5">
                        <div className="text-end">
                          <FormLabel className="justify-end">
                            Shipping
                          </FormLabel>
                        </div>
                        <div className="flex items-center gap-1">
                          <FormControl>
                            <Input
                              className="focus-visible:ring-0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>

                          <Button
                            variant="ghost"
                            size="icon"
                            type="button"
                            onClick={() => toggleField("shipping")}
                            className="hover:bg-transparent hover:rotate-180 text-red-500 hover:text-red-700"
                          >
                            <X />
                          </Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-2 gap-5 font-semibold">
                <div className="text-end">Total</div>
                <div className="">$ {calculations.total}</div>
              </div>

              <FormField
                control={control}
                name="amountPaid"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <div className="grid grid-cols-2 gap-5">
                      <FormLabel className="whitespace-nowrap justify-end">
                        Amount Paid
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="focus-visible:ring-0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-5 font-semibold">
                <div className="text-end">Balance</div>
                <div className="">$ {calculations.balanceDue}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-5">
            <FormField
              control={form.control}
              name="thanksMessage"
              render={({ field }) => (
                <FormItem className="w-3/4">
                  <FormControl>
                    <Textarea
                      className="focus-visible:ring-0 min-h-[3px] text-center font-semibold"
                      placeholder="THANK YOU FOR YOUR BUSINESS!"
                      rows={1}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-3 flex items-center justify-center gap-2 mt-5">
            <Button type="button" variant="secondary" onClick={toPrevStep}>
              Back
            </Button>
            <Button type="submit">Preview</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default InvoiceItemsForm;
