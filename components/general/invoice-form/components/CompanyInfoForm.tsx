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

export function CompanyInfoForm() {
  const { control } = useFormContext();

  return (
    <div className="space-y-4 p-5 border border-muted rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">Company Information</h2>
      <p className="text-sm mb-5">
        Your company details to be shown on the invoice
      </p>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FormField
            control={control}
            name="companyInfo.name"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>
                  Company Name
                  <strong className="text-red-500">*</strong>
                </FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="Your company name"
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
            name="companyInfo.companySlogan"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Company Slogan</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="e.g. We serve the world"
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
            name="companyInfo.email"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>
                  Email
                  <strong className="text-red-500">*</strong>
                </FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="e.g. example@company.com"
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
            name="companyInfo.phone"
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
            name="companyInfo.address"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>
                  Address
                  <strong className="text-red-500">*</strong>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="focus-visible:ring-0 min-h-3"
                    placeholder="e.g. Street, City, Country - Zip/Postal code"
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
            name="companyInfo.logo"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Logo URL</FormLabel>
                <FormControl>
                  <Input
                    className="focus-visible:ring-0"
                    placeholder="Image URL of your company logo"
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
