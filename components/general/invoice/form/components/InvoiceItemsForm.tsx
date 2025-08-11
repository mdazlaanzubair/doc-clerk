"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/lib/utils";
import { InvoiceItemInterface } from "@/types";
import { AlertCircleIcon, Trash2 } from "lucide-react";
import React, { useEffect, useMemo } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

const defaultInvoiceItems = [{ itemDesc: "New item", qty: 1, cost: 1 }];

export function InvoiceItemsForm() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoiceItemsList.items",
  });

  const items = watch("invoiceItemsList.items") || [];
  const currency = watch(`invoiceDetails.currency`) || "$";

  // derive subtotal directly from watched items (no race / lag)
  const derivedSubTotal = useMemo(() => {
    return items.reduce((sum: number, item: InvoiceItemInterface) => {
      const q = Number(item?.qty) || 0;
      const c = Number(item?.cost) || 0;
      return sum + q * c;
    }, 0);
  }, [JSON.stringify(items)]);

  useEffect(() => {
    setValue("invoiceItemsList.subTotal", Number(derivedSubTotal.toFixed(2)));
  }, [derivedSubTotal]);

  return (
    <div className="space-y-4 p-5 border border-muted rounded-lg shadow">
      <div className="w-full flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold mb-3">Invoice Items</h2>
          <p className="text-sm">
            Following fields are pertinent to invoice items
          </p>
        </div>
        <div>
          <Button
            type="button"
            variant="ghost"
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => append(defaultInvoiceItems)}
          >
            Add Item
          </Button>
        </div>
      </div>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {Array.isArray((errors.invoiceItemsList as any)?.items) && (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Unable to proceed further</AlertTitle>
          <AlertDescription>
            <p>Please resolve these errors before proceeding further</p>
            <ul className="list-inside list-disc text-sm">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(errors.invoiceItemsList as any)?.items.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (itemError: any, idx: number) => (
                  <React.Fragment key={idx}>
                    {itemError?.itemDesc && (
                      <li>
                        <strong>Row {idx + 1}:</strong>{" "}
                        {itemError.itemDesc.message}
                      </li>
                    )}
                    {itemError?.qty && (
                      <li>
                        <strong>Row {idx + 1}:</strong> {itemError.qty.message}
                      </li>
                    )}
                    {itemError?.cost && (
                      <li>
                        <strong>Row {idx + 1}:</strong> {itemError.cost.message}
                      </li>
                    )}
                  </React.Fragment>
                )
              )}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {fields.map((item, index) => {
        const qty = watch(`invoiceItemsList.items.${index}.qty`);
        const cost = watch(`invoiceItemsList.items.${index}.cost`);
        const amount = (qty || 0) * (cost || 0);

        return (
          <div
            key={item.id}
            className="relative grid grid-cols-1 gap-4 md:grid-cols-4 items-end bg-secondary/50 rounded p-5 my-10"
          >
            <div className="absolute space-y-2 text-center -top-7 left-0">
              <Badge
                variant="secondary"
                className="text-sm rounded bg-secondary/50"
              >
                Item Row {index + 1}
              </Badge>
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name={`invoiceItemsList.items.${index}.itemDesc`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Item Description{" "}
                      <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="Invoice item description"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name={`invoiceItemsList.items.${index}.qty`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Quantity <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        className="focus-visible:ring-0"
                        placeholder="No. of items"
                        max={9999999}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={control}
                name={`invoiceItemsList.items.${index}.cost`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Unit Price <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="numeric"
                        max={9999999999}
                        className="focus-visible:ring-0"
                        placeholder="Cost per item"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormItem>
                <FormLabel>
                  Amount <strong className="text-red-500">*</strong>
                </FormLabel>
                <FormControl>
                  <Input
                    value={`${currency + " " + formatAmount(amount)}`}
                    disabled
                    readOnly
                    className="focus-visible:ring-0"
                    placeholder="Item total"
                  />
                </FormControl>
              </FormItem>
            </div>
            {fields.length > 1 && (
              <div className="absolute space-y-2 text-center -top-8 -right-3">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="absolute top-0 right-0 rounded text-red-500 hover:text-red-700 hover:bg-transparent"
                >
                  <Trash2 />
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <div className="relative flex items-center justify-end gap-5 bg-secondary/50 rounded p-5 my-10">
        <div className="font-semibold flex items-center justify-center gap-5">
          <h3>Subtotal</h3>
          <p className="whitespace-nowrap flex items-center justify-center gap-2">
            <span>{currency}</span>
            {/* FIXED: Use derivedSubTotal directly instead of getValues() */}
            <span>{formatAmount(derivedSubTotal)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
