import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  ArrowUpRight,
  SquareArrowOutUpRight,
  SquareArrowUpRight,
} from "lucide-react";

const InvoicesTable = () => {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] font-semibold text-muted-foreground/50">
            #
          </TableHead>
          <TableHead className="w-auto font-semibold text-muted-foreground/50">
            Customer
          </TableHead>
          <TableHead className="w-auto font-semibold text-muted-foreground/50">
            Email
          </TableHead>
          <TableHead className="w-[100px] font-semibold text-muted-foreground/50">
            Amount
          </TableHead>
          <TableHead className="w-[100px] font-semibold text-muted-foreground/50">
            Status
          </TableHead>
          <TableHead className="w-[100px] font-semibold text-muted-foreground/50">
            Date
          </TableHead>
          <TableHead className="w-[100px] font-semibold text-muted-foreground/50">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <TableRow key={`table-row-${i}`}>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell className="font-medium">John Doe</TableCell>
            <TableCell className="font-medium">johndoe@example.com</TableCell>
            <TableCell>$250.00</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell className="font-medium">25/10/2025</TableCell>
            <TableCell className="font-medium text-center">
              <Button
                className="text-xs text-blue-600 hover:text-blue-700"
                variant="secondary"
                size="icon"
                asChild
              >
                <Link href={`/invoices/${i}`}>
                  <ArrowUpRight className="w-2 h-2" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InvoicesTable;
