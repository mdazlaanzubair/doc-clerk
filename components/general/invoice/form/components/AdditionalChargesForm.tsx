"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/lib/utils";
import { Banknote, Percent } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export function AdditionalChargesForm() {
  const { watch, setValue, control } = useFormContext();

  const [percentAmount, setPercentAmount] = useState({
    discount: 0,
    tax: 0,
  });

  const subTotal = watch("invoiceItemsList.subTotal") || 0;
  const shipping = watch("additionalCharges.shipping") || 0;
  const discount = watch("additionalCharges.discount.amount") || 0;
  const isDiscountAmt = watch("additionalCharges.discount.isAmt") || 0;
  const tax = watch("additionalCharges.tax.amount") || 0;
  const isTaxAmt = watch("additionalCharges.tax.isAmt") || 0;
  const amountPaid = watch("additionalCharges.amountPaid") || 0;
  const total = watch("additionalCharges.total") || 0;
  const balanceDue = watch("additionalCharges.balanceDue") || 0;
  const currency = watch("invoiceDetails.currency") || "$";

  // Function to reactively calculate total and balance amount
  const calculateTotalAndBalance = () => {
    // Calculate discount based on whether it's an amount or percentage
    let discountValue = 0;
    if (discount > 0) {
      discountValue = isDiscountAmt ? discount : (subTotal * discount) / 100;
      discountValue = Number(discountValue.toFixed(2));
      setPercentAmount({ ...percentAmount, discount: discountValue });
    }

    // Calculate tax based on whether it's an amount or percentage
    // Only calculate tax when it is set true in optional fields
    let taxValue = 0;
    if (tax > 0) {
      taxValue = isTaxAmt ? tax : ((subTotal - discountValue) * tax) / 100;
      taxValue = Number(taxValue.toFixed(2));
      setPercentAmount({ ...percentAmount, tax: taxValue });
    }

    // Only calculate shipping when it is set true in optional fields
    let shippingValue = 0;
    if (shipping > 0) {
      shippingValue = shipping;
    }

    // Calculate the total amount after applying discount, tax, and shipping
    let total = subTotal - discountValue + (taxValue + shippingValue);
    total = Number(total.toFixed(2));

    // Calculate the balance due after deducting the amount paid
    let balanceDue = total - amountPaid;
    balanceDue = Number(balanceDue.toFixed(2));

    return { total, balanceDue };
  };

  // Function to toggle between % and amount
  const togglePercentage = (name: string) => {
    if (name === "discount") {
      setValue(
        "additionalCharges.discount.isAmt",
        !watch("additionalCharges.discount.isAmt")
      );
    } else if (name === "tax") {
      setValue(
        "additionalCharges.tax.isAmt",
        !watch("additionalCharges.tax.isAmt")
      );
    }
  };

  useEffect(() => {
    const { total, balanceDue } = calculateTotalAndBalance();
    setValue("additionalCharges.total", total);
    setValue("additionalCharges.balanceDue", balanceDue);
  }, [subTotal, shipping, discount, tax, amountPaid, isDiscountAmt, isTaxAmt]);

  return (
    <div className="space-y-4 p-5 border border-muted rounded-lg shadow">
      <h2 className="text-xl font-bold">Additional Charges</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <FormField
            control={control}
            name="additionalCharges.amountPaid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Paid ({currency})</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    max={9999999999}
                    className="focus-visible:ring-0"
                    placeholder="Amount already paid"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
            name="additionalCharges.shipping"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping ({currency})</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    max={9999999999}
                    className="focus-visible:ring-0"
                    placeholder="Cost of shipping"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
            name="additionalCharges.discount.amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between gap-3">
                  <p>
                    Discount (
                    {isDiscountAmt
                      ? currency
                      : currency + " " + formatAmount(percentAmount.discount)}
                    )
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePercentage("discount")}
                  >
                    {isDiscountAmt ? <Banknote /> : <Percent />}
                  </Button>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    max={9999999999}
                    className="focus-visible:ring-0"
                    placeholder="Discount offered"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
            name="additionalCharges.tax.amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between gap-3">
                  <p>
                    Tax (
                    {isTaxAmt
                      ? currency
                      : currency + " " + formatAmount(percentAmount.tax)}
                    )
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePercentage("tax")}
                  >
                    {isTaxAmt ? <Banknote /> : <Percent />}
                  </Button>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    max={9999999999}
                    className="focus-visible:ring-0"
                    placeholder="Tax applied"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2 col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <FormItem>
                <FormLabel>Subtotal</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    value={`${currency + " " + formatAmount(subTotal)}`}
                    disabled
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <div className="space-y-2">
              <FormItem>
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    value={`${currency + " " + formatAmount(total)}`}
                    disabled
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
            <div className="space-y-2">
              <FormItem>
                <FormLabel>Balance</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    value={`${currency + " " + formatAmount(balanceDue)}`}
                    disabled
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
