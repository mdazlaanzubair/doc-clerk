import { Separator } from "@/components/ui/separator";
import React from "react";
import { InvoiceFormInterface, InvoiceInterface } from "@/types";
import { formatAmount } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

interface InvoiceFooterProps {
  data: InvoiceFormInterface | InvoiceInterface;
}

const InvoiceFooter = ({ data }: InvoiceFooterProps) => {
  // Function to generate invoice QR Code
  function generateInvoiceQR(invoiceId: string) {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/invoices/${invoiceId}`;
    return (
      <QRCodeSVG
        value={url}
        size={150}
        includeMargin={true}
        title="Invoice QR Code"
        level="Q"
      />
    );
  }

  return (
    <section
      id="invoice-footer"
      className="flex-1 grid grid-cols-6 justify-between gap-5"
    >
      <div className="col-span-4 flex flex-col gap-3">
        {data.invoiceFooter.notes.length ? (
          <div>
            <h1 className="text-sm font-extrabold tracking-tight">
              Comments or Special Instructions:
            </h1>
            <p className="text-xs font-normal tracking-tight">
              {data.invoiceFooter.notes}
            </p>
          </div>
        ) : null}
        {data.invoiceFooter.terms.length ? (
          <div>
            <h1 className="text-sm font-extrabold tracking-tight">Terms:</h1>
            <p className="text-xs font-normal tracking-tight">
              {data.invoiceFooter.terms}
            </p>
          </div>
        ) : null}
      </div>
      <div className="col-span-2 flex flex-col">
        <div className="grid grid-cols-2 gap-5 text-sm font-semibold">
          <h3 className="text-end">Subtotal</h3>
          <p className="">
            {data.invoiceDetails.currency +
              " " +
              formatAmount(data.invoiceItemsList.subTotal)}
          </p>
        </div>

        <Separator className="my-1 ml-auto opacity-0" />

        {data.additionalCharges.discount.amount > 0 ? (
          <div className="grid grid-cols-2 gap-5 text-sm font-normal">
            <h3 className="text-end">Discount</h3>
            <p className="flex items-center gap-1">
              {data.additionalCharges.discount.isAmount ? (
                <span>{data.invoiceDetails.currency}</span>
              ) : null}
              <span>
                {formatAmount(data.additionalCharges.discount.amount)}
              </span>
              {!data.additionalCharges.discount.isAmount ? (
                <span>%</span>
              ) : null}
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-5 text-sm font-normal">
          <h3 className="text-end">Tax</h3>
          <p className="flex items-center gap-1">
            {data.additionalCharges.tax.isAmount ? (
              <span>{data.invoiceDetails.currency}</span>
            ) : null}
            <span>{formatAmount(data.additionalCharges.tax.amount)}</span>
            {!data.additionalCharges.tax.isAmount ? <span>%</span> : null}
          </p>
        </div>

        {data.additionalCharges.shipping > 0 ? (
          <div className="grid grid-cols-2 gap-5 text-sm font-normal">
            <h3 className="text-end">Shipping</h3>
            <p className="">
              {data.invoiceDetails.currency +
                " " +
                formatAmount(data.additionalCharges.shipping)}
            </p>
          </div>
        ) : null}

        <Separator className="my-1 ml-auto opacity-0" />

        <div
          className={`grid grid-cols-2 gap-5 ${
            data.additionalCharges.amountPaid > 0
              ? "text-sm font-semibold"
              : "font-bold"
          }`}
        >
          <h3 className="text-end">Total</h3>
          <p className="">
            {data.invoiceDetails.currency +
              " " +
              formatAmount(data.additionalCharges.total)}
          </p>
        </div>

        {data.additionalCharges.amountPaid > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-5 text-sm font-semibold">
              <h3 className="text-end">Amount Paid</h3>
              <p className="">
                {data.invoiceDetails.currency +
                  " " +
                  formatAmount(data.additionalCharges.amountPaid)}
              </p>
            </div>

            <Separator className="my-1 ml-auto opacity-0" />

            <div className="grid grid-cols-2 gap-5 font-bold">
              <h3 className="text-end">Balance</h3>
              <p className="">
                {data.invoiceDetails.currency +
                  " " +
                  formatAmount(data.additionalCharges.balanceDue)}
              </p>
            </div>
          </>
        ) : null}
      </div>

      <div className="col-span-6 flex flex-col justify-center items-center">
        {generateInvoiceQR(data.invoiceDetails.invoiceNumber)}
        <p>
          <strong className="text-sm font-extrabold tracking-tight">
            {data.invoiceFooter.thanksMessage.length
              ? data.invoiceFooter.thanksMessage
              : "THANK YOU FOR YOUR BUSINESS!"}
          </strong>
        </p>
      </div>
    </section>
  );
};

export default InvoiceFooter;
