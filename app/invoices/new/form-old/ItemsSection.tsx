import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

interface ItemsSectionProps {
  editable: boolean;
  toggleEditor: () => void;
}

const ItemsSection = ({ editable, toggleEditor }: ItemsSectionProps) => {
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
          <TableRow
            className={`${editable && "hover:bg-transparent"}`}
            onDoubleClick={toggleEditor}
          >
            <TableHead className="w-5">1</TableHead>
            <TableHead className="w-auto">
              {editable ? (
                <Input
                  type="text"
                  className="silent-input"
                  placeholder="Item description"
                  defaultValue={"[Item Title]"}
                  name="invoiceItem"
                />
              ) : (
                "[Item Title]"
              )}
            </TableHead>
            <TableHead className="w-5">
              {editable ? (
                <Input
                  type="number"
                  className="silent-input"
                  placeholder="Item quantity"
                  defaultValue={"2"}
                  name="itemQty"
                />
              ) : (
                "2"
              )}
            </TableHead>
            <TableHead className="w-5">
              {editable ? (
                <Input
                  type="number"
                  className="silent-input"
                  placeholder="Item cost"
                  defaultValue={"100"}
                  name="itemCost"
                />
              ) : (
                "100"
              )}
            </TableHead>
            <TableHead className="w-5">200</TableHead>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default ItemsSection;
