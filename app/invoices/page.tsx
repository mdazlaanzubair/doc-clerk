import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { PlusSquare } from "lucide-react";
import InvoicesTable from "@/components/general/InvoicesTable";

const Invoice = () => {
  return (
    <div className="w-full h-full max-w-4xl flex flex-col mx-auto py-3 gap-5 my-5">
      <section id="invoices-section" className="w-full flex flex-col py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-balance">
              Invoices
            </h1>
            <p className="text-sm mt-2 font-semibold text-muted-foreground/50">
              Following are the invoices you have created
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href="/invoices/new">
              <PlusSquare /> Create Invoice
            </Link>
          </Button>
        </div>
        <InvoicesTable />
      </section>
    </div>
  );
};

export default Invoice;
