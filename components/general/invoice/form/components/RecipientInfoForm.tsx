"use client";

import { Checkbox } from "@/components/ui/checkbox";
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

export function RecipientInfoForm() {
  const { watch, control } = useFormContext();
  const isSameAsBillTo = watch("recipientInfo.isSameAsBillTo");

  return (
    <div className="space-y-4 p-5 border border-muted rounded-lg shadow">
      <div className="w-full flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold mb-2">Recipient Information</h2>
          <p className="text-sm mb-5">
            Following fields are pertinent to recipient of the invoice
          </p>
        </div>
        <div>
          <FormField
            control={control}
            name="recipientInfo.isSameAsBillTo"
            render={({ field }) => (
              <FormItem className="mb-3 flex items-center">
                <FormControl>
                  <Checkbox
                    {...field}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Same as Bill To</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Bill To Section */}
        <div
          className={`space-y-2 ${
            isSameAsBillTo ? "col-span-2" : "col-span-1"
          } transition-all ease-in-out duration-300`}
        >
          <h3 className="font-bold">Bill To</h3>
          <div
            className={`grid  ${
              isSameAsBillTo ? "grid-cols-2 gap-5" : "grid-cols-1"
            } transition-all ease-in-out duration-300`}
          >
            <div className="space-y-2">
              <FormField
                control={control}
                name="recipientInfo.billTo.rep"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>
                      Representative <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="e.g. John Doe"
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
                name="recipientInfo.billTo.companyName"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>
                      Company Name <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="Bill to company name"
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
                name="recipientInfo.billTo.email"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>
                      Company Email <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="Bill to company email"
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
                name="recipientInfo.billTo.phone"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="e.g. +1234567890"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={`space-y-2 ${isSameAsBillTo ? "col-span-2" : ""}`}>
              <FormField
                control={control}
                name="recipientInfo.billTo.address"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>
                      Address <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="focus-visible:ring-0"
                        placeholder="e.g. Street, City, Country - Zip/Postal code"
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

        {/* Ship To Section */}
        {!isSameAsBillTo && (
          <div className="space-y-2">
            <h3 className="font-bold">Ship To</h3>
            <div className="space-y-2">
              <FormField
                control={control}
                name="recipientInfo.shipTo.rep"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>
                      Representative <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="e.g. John Doe"
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
                name="recipientInfo.shipTo.companyName"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>
                      Company Name <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="Bill to company name"
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
                name="recipientInfo.shipTo.email"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>
                      Company Email <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="Bill to company email"
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
                name="recipientInfo.shipTo.phone"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0"
                        placeholder="e.g. +1234567890"
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
                name="recipientInfo.shipTo.address"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>
                      Address <strong className="text-red-500">*</strong>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="focus-visible:ring-0"
                        placeholder="e.g. Street, City, Country - Zip/Postal code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
