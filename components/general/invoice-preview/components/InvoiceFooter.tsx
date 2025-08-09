import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { InvoiceInterface } from "@/types";
import { formatAmount } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

interface InvoiceFooterProps {
  data: InvoiceInterface;
}

const InvoiceFooter = ({ data }: InvoiceFooterProps) => {
  // State to hold calculations
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    total: 0,
    balanceDue: 0,
  });

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

  // Preforming side effect on form fields and calculating sum on form values change
  useEffect(() => {
    const {
      items,
      discount,
      isDiscountAmt,
      tax,
      isTaxAmt,
      shipping,
      amountPaid,
    } = data;

    // Calculate the subtotal by summing up the cost of all items
    let subtotal = items.reduce(
      (sum, item) => sum + (Number(item.cost) || 0) * (Number(item.qty) || 0),
      0
    );
    subtotal = Number(subtotal.toFixed(2));

    // Calculate discount based on whether it's an amount or percentage
    // Only calculate discount when it is set true in optional fields
    let discountValue = isDiscountAmt ? discount : (subtotal * discount) / 100;
    discountValue = Number(discountValue.toFixed(2));

    // Calculate tax based on whether it's an amount or percentage
    // Only calculate tax when it is set true in optional fields
    let taxValue = isTaxAmt ? tax : ((subtotal - discountValue) * tax) / 100;
    taxValue = Number(taxValue.toFixed(2));

    // Only calculate shipping when it is set true in optional fields
    let shippingValue = shipping;

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
  }, [JSON.stringify(data)]);

  return (
    <section
      id="invoice-footer"
      className="flex-1 grid grid-cols-6 justify-between gap-5"
    >
      <div className="col-span-4 flex flex-col gap-3">
        {data.notes.length ? (
          <div>
            <h1 className="text-sm font-extrabold tracking-tight">
              Comments or Special Instructions:
            </h1>
            <p className="text-xs font-normal tracking-tight">{data.notes}</p>
          </div>
        ) : null}
        {data.terms.length ? (
          <div>
            <h1 className="text-sm font-extrabold tracking-tight">Terms:</h1>
            <p className="text-xs font-normal tracking-tight">{data.terms}</p>
          </div>
        ) : null}
      </div>
      <div className="col-span-2 flex flex-col">
        <div className="grid grid-cols-2 gap-5 text-sm font-semibold">
          <h3 className="text-end">Subtotal</h3>
          <p className="">
            {data.currency + " " + formatAmount(calculations.subtotal)}
          </p>
        </div>

        <Separator className="my-1 ml-auto opacity-0" />

        {data.discount > 0 ? (
          <div className="grid grid-cols-2 gap-5 text-sm font-normal">
            <h3 className="text-end">Discount</h3>
            <p className="flex items-center gap-1">
              {data.isDiscountAmt ? <span>{data.currency}</span> : null}
              <span>{formatAmount(data.discount)}</span>
              {!data.isDiscountAmt ? <span>%</span> : null}
            </p>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-5 text-sm font-normal">
          <h3 className="text-end">Tax</h3>
          <p className="flex items-center gap-1">
            {data.isTaxAmt ? <span>{data.currency}</span> : null}
            <span>{formatAmount(data.tax)}</span>
            {!data.isTaxAmt ? <span>%</span> : null}
          </p>
        </div>

        {data.shipping > 0 ? (
          <div className="grid grid-cols-2 gap-5 text-sm font-normal">
            <h3 className="text-end">Shipping</h3>
            <p className="">
              {data.currency + " " + formatAmount(data.shipping)}
            </p>
          </div>
        ) : null}

        <Separator className="my-1 ml-auto opacity-0" />

        <div
          className={`grid grid-cols-2 gap-5 ${
            data.amountPaid > 0 ? "text-sm font-semibold" : "font-bold"
          }`}
        >
          <h3 className="text-end">Total</h3>
          <p className="">
            {data.currency + " " + formatAmount(calculations.total)}
          </p>
        </div>

        {data.amountPaid > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-5 text-sm font-semibold">
              <h3 className="text-end">Amount Paid</h3>
              <p className="">
                {data.currency + " " + formatAmount(data.amountPaid)}
              </p>
            </div>

            <Separator className="my-1 ml-auto opacity-0" />

            <div className="grid grid-cols-2 gap-5 font-bold">
              <h3 className="text-end">Balance</h3>
              <p className="">
                {data.currency + " " + formatAmount(calculations.balanceDue)}
              </p>
            </div>
          </>
        ) : null}
      </div>

      <div className="col-span-6 flex flex-col justify-center items-center">
        {generateInvoiceQR(data.invoiceNumber)}
        <p>
          <strong className="text-sm font-extrabold tracking-tight">
            {data.thanksMessage.length
              ? data.thanksMessage
              : "THANK YOU FOR YOUR BUSINESS!"}
          </strong>
        </p>
      </div>
    </section>
  );
};

export default InvoiceFooter;
