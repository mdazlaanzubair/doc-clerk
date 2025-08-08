import Image from "next/image";
import React from "react";
import logo from "@/public/globe.svg";
import qrCode from "@/public/qr-code.jpeg";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Edit2, Save, Trash2 } from "lucide-react";

const SingleInvoice = ({ params }: { params: { invoiceId: string } }) => {
  console.log("params.invoiceId", params.invoiceId);
  return (
    <div className="w-full h-full max-w-4xl flex flex-col mx-auto gap-5 my-5">
      <section
        id="invoice-actions"
        className="w-full max-w-3xl flex items-center justify-between gap-3 mx-auto mt-5"
      >
        <div className="flex items-center gap-3">
          <Button variant="default" title="Publish">
            Publish
          </Button>
          <Button variant="secondary" title="Download">
            Download
          </Button>
          <Button variant="secondary" title="Print">
            Print
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            className="text-green-600 hover:text-green-700"
            title="Save"
          >
            <Save />
            Save
          </Button>
          <Button
            variant="secondary"
            className="text-blue-600 hover:text-blue-700"
            size="icon"
            title="Edit"
          >
            <Edit2 />
          </Button>
          <Button
            variant="secondary"
            className="text-red-600 hover:text-red-700"
            size="icon"
            title="Delete"
          >
            <Trash2 />
          </Button>
        </div>
      </section>
      <section
        id="single-invoice-section"
        className="w-full min-h-[800px] h-auto max-w-3xl flex flex-col py-3 border border-muted-foreground/10 shadow-sm rounded-sm p-5 mx-auto gap-5"
      >
        <InvoiceHeader />
        <RecipientSection />
        <ItemsSection />
        <InvoiceFooter />
      </section>
    </div>
  );
};

export default SingleInvoice;

// =============================
// Invoice view page components
// =============================

// 1. Invoice header component
const InvoiceHeader = () => {
  return (
    <section id="invoice-header" className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-center gap-1">
          <Image src={logo.src} width={24} height={24} alt="Company logo" />
          <div className="flex flex-col">
            <h1 className="text-sm font-extrabold tracking-tight">
              [Company Name]
            </h1>
            <p className="text-xs font-normal tracking-tight">
              [Your company slogan]
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <h1 className="text-4xl font-extrabold">INVOICE</h1>
        </div>
      </div>
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-center gap-1">
          <div className="flex flex-col">
            <p className="text-xs font-normal tracking-tight">
              [Street Address] [City, ST ZIP Code]
            </p>
            <p className="text-xs font-normal tracking-tight">
              Phone: [Phone] Fax: [Fax]
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className="text-xs font-normal tracking-tight">
            Invoice No.: [# Number]
          </p>
        </div>
      </div>
    </section>
  );
};

// 2. Recipient component
const RecipientSection = () => {
  return (
    <section id="recipient-section" className="flex flex-col gap-5 my-5">
      <div className="grid grid-cols-3 gap-5">
        <div className="flex flex-col">
          <h1 className="text-sm font-extrabold tracking-tight">Bill to:</h1>
          <p className="text-xs font-normal tracking-tight">[Recipient Name]</p>
          <p className="text-xs font-normal tracking-tight">[Company Name]</p>
          <p className="text-xs font-normal tracking-tight">[Street Address]</p>
          <p className="text-xs font-normal tracking-tight">
            [City, ST ZIP Code]
          </p>
          <p className="text-xs font-normal tracking-tight">Phone: [Phone]</p>
        </div>
        <div className="flex flex-col">
          <h1 className="text-sm font-extrabold tracking-tight">Ship to:</h1>
          <p className="text-xs font-normal tracking-tight">[Recipient Name]</p>
          <p className="text-xs font-normal tracking-tight">[Company Name]</p>
          <p className="text-xs font-normal tracking-tight">[Street Address]</p>
          <p className="text-xs font-normal tracking-tight">
            [City, ST ZIP Code]
          </p>
          <p className="text-xs font-normal tracking-tight">Phone: [Phone]</p>
        </div>
        <div className="flex flex-col justify-end">
          <p className="text-sm font-normal tracking-tight">
            Issuance Date: DD/MM/YYYY
          </p>
          <p className="text-sm font-normal tracking-tight">
            Due Date: DD/MM/YYYY
          </p>
          <p className="text-sm font-normal tracking-tight">
            Payment Terms: [Terms]
          </p>
          <p className="text-sm font-normal tracking-tight">
            PO Number: [# Number]
          </p>
        </div>
      </div>
    </section>
  );
};

// 3. Items components
const ItemsSection = () => {
  return (
    <section id="items-section" className="flex flex-col gap-5 my-5">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted-foreground hover:bg-muted-foreground">
            <TableHead className="w-5 text-muted">#</TableHead>
            <TableHead className="w-auto text-muted">Items</TableHead>
            <TableHead className="w-5 text-muted">Qty</TableHead>
            <TableHead className="w-10 text-muted">Unit Price</TableHead>
            <TableHead className="text-right text-muted">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead className="w-5">1</TableHead>
            <TableHead className="w-auto">Unique Item</TableHead>
            <TableHead className="w-5">2</TableHead>
            <TableHead className="w-5">100</TableHead>
            <TableHead className="w-5">200</TableHead>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

const InvoiceFooter = () => {
  return (
    <section
      id="invoice-footer"
      className="flex-1 flex flex-col justify-between gap-5"
    >
      <div className="grid grid-cols-2 justify-between gap-5">
        <div className="flex flex-col">
          <h1 className="text-sm font-extrabold tracking-tight">
            Comments or Special Instructions:
          </h1>
          <p className="text-xs font-normal tracking-tight">
            [Any relevant information not already covered] Make all checks
            payable to [Company Name]
          </p>
          <Separator className="my-3 opacity-0" />
          <h1 className="text-sm font-extrabold tracking-tight">Terms:</h1>
          <p className="text-xs font-normal tracking-tight">
            [Terms &amp; Conditions, late fee interest or payment schedule]
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <div className="w-1/2 text-end">Subtotal</div>
            <div className="w-1/2 text-end">$ 0.00</div>
          </div>
          <Separator className="my-1 ml-auto opacity-0" />
          <div className="flex items-center gap-3 text-xs text-green-600">
            <div className="w-1/2 text-end">Discount</div>
            <div className="w-1/2 text-end">$ 0.00</div>
          </div>
          <div className="flex items-center gap-3 text-xs text-blue-500">
            <div className="w-1/2 text-end">Tax</div>
            <div className="w-1/2 text-end">$ 0.00</div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="w-1/2 text-end">Shipping</div>
            <div className="w-1/2 text-end">$ 0.00</div>
          </div>
          <Separator className="my-2 ml-auto opacity-0" />
          <div className="flex items-center gap-3 text-sm font-semibold">
            <div className="w-1/2 text-end">Total</div>
            <div className="w-1/2 text-end">$ 0.00</div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="w-1/2 text-end">Amount Paid</div>
            <div className="w-1/2 text-end">$ 0.00</div>
          </div>
          <Separator className="my-2 ml-auto opacity-0" />
          <div className="flex items-center gap-3 font-bold">
            <div className="w-1/2 text-end">Balance</div>
            <div className="w-1/2 text-end">$ 0.00</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Image
          src={qrCode.src}
          width={150}
          height={150}
          alt="Invoice QR code"
        />
        <p className="text-xs font-normal tracking-tight">
          If you have any questions concerning this invoice, contact [Name,
          phone, email]
        </p>
        <h1 className="text-sm font-extrabold tracking-tight">
          THANK YOU FOR YOUR BUSINESS!
        </h1>
      </div>
    </section>
  );
};
