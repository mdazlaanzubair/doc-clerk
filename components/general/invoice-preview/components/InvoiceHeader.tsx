import Image from "next/image";
import React from "react";
import logo from "@/public/globe.svg";
import { InvoiceInterface } from "@/types";
import { format } from "date-fns";

interface InvoiceHeaderProps {
  data: InvoiceInterface;
}

const InvoiceHeader = ({ data }: InvoiceHeaderProps) => {
  return (
    <section id="invoice-header" className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
        <div className="flex items-center gap-1">
          <Image src={logo.src} width={35} height={35} alt="Company logo" />
          <div className="flex flex-col mx-3">
            <h1 className="text-sm font-extrabold tracking-tight">
              {data.companyName}
            </h1>
            {data.companySlogan.length ? (
              <h3 className="text-xs font-normal tracking-tight">
                {data.companySlogan}
              </h3>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h2 className="text-4xl font-extrabold">
            {data.invoiceTitle.length ? data.invoiceTitle : "INVOICE"}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col">
          <div className="text-xs font-normal tracking-tight">
            {data.companyAddress}
          </div>
          <a
            href={`mailto:${data.companyEmail}`}
            className="text-xs font-normal tracking-tight text-primary"
          >
            {data.companyEmail}
          </a>
          {data.companyPhone.length ? (
            <a
              href={`tel:${data.companyPhone}`}
              className="text-xs font-normal tracking-tight text-primary"
            >
              {data.companyPhone}
            </a>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-xs font-normal tracking-tight flex items-center gap-1">
            <label htmlFor="invoiceNumber">Invoice No.</label>
            {data.invoiceNumber}
          </div>
          <div className="text-xs font-normal tracking-tight flex items-center">
            <label htmlFor="invoiceDate" className="mr-1">
              Issuance Date
            </label>
            <p>{format(data.invoiceDate, "dd/MM/yyyy")}</p>
          </div>
          <div className="text-xs font-normal tracking-tight flex items-center">
            <label htmlFor="invoiceDueDate" className="mr-1">
              Due Date
            </label>
            <p>{format(data.dueDate, "dd/MM/yyyy")}</p>
          </div>
          {data.poNumber.length ? (
            <div className="text-xs font-normal tracking-tight flex items-center gap-1">
              <label htmlFor="poNumber">Purchase Order No.</label>
              {data.poNumber}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default InvoiceHeader;
