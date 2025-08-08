"use client";

import React from "react";
import InvoiceForm from "./form";
import { useForm } from "react-hook-form";

const Invoice = () => {
  const form = useForm();
  return (
    <div className="w-full h-full max-w-4xl flex flex-col mx-auto py-3 gap-10 my-5">
      <section id="invoice-form-section" className="w-full flex flex-col py-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-balance">
          Invoices Generator
        </h1>
        <p className="text-sm mt-2 font-semibold text-muted-foreground/50">
          Create professional invoices in a quick and easy way
        </p>
        <InvoiceForm />
        {/* <InvoiceForm /> */}
      </section>
    </div>
  );
};

export default Invoice;
