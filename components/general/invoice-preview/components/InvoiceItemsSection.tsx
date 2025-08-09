import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAmount } from "@/lib/utils";
import { InvoiceInterface } from "@/types";
import React from "react";

interface InvoiceItemsSectionProps {
  data: InvoiceInterface;
}

const InvoiceItemsSection = ({ data }: InvoiceItemsSectionProps) => {
  return (
    <section id="items-section" className="flex flex-col gap-5 my-5">
      <Table>
        <TableHeader>
          <TableRow className="bg-black text-white hover:bg-black">
            <TableHead className="w-5 text-muted">#</TableHead>
            <TableHead className="w-auto text-muted">Items</TableHead>
            <TableHead className="w-5 text-muted">Qty</TableHead>
            <TableHead className="w-10 text-muted">Unit Price</TableHead>
            <TableHead className="text-right text-muted">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.length > 0 ? (
            data.items.map((item, index) => (
              <TableRow key={`item-${index}`}>
                <TableCell className="w-5">{index + 1}</TableCell>
                <TableHead className="w-auto">{item.itemDesc}</TableHead>
                <TableCell className="w-5">
                  {data.currency + " " + item.qty}
                </TableCell>
                <TableCell className="w-5">
                  {data.currency + " " + formatAmount(item.cost)}
                </TableCell>
                <TableHead className="w-5 font-semibold">
                  {data.currency + " " + formatAmount(item.qty * item.cost)}
                </TableHead>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableHead className="w-auto text-center">No data</TableHead>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
};

export default InvoiceItemsSection;
