import Image from "next/image";
import logo from "@/public/globe.svg";
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarDays, RefreshCcw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface InvoiceHeaderProps {
  editable: boolean;
  toggleEditor: () => void;
}

const InvoiceHeader = ({ editable, toggleEditor }: InvoiceHeaderProps) => {
  return (
    <section id="invoice-header" className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-start gap-1">
          <Image src={logo.src} width={35} height={35} alt="Company logo" />
          <div className="flex flex-col mx-3">
            <div
              className="text-sm font-extrabold tracking-tight"
              onDoubleClick={toggleEditor}
            >
              {editable ? (
                <Input
                  type="text"
                  className="silent-input"
                  placeholder="Company Name"
                  defaultValue={"[Company Name]"}
                  name="companyName"
                />
              ) : (
                "[Company Name]"
              )}
            </div>
            <div
              className="text-xs font-normal tracking-tight"
              onDoubleClick={toggleEditor}
            >
              {editable ? (
                <Input
                  type="text"
                  className="silent-input"
                  placeholder="Company Slogan"
                  defaultValue={"[Your company slogan]"}
                  name="companySlogan"
                />
              ) : (
                "[Your company slogan]"
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="text-4xl font-extrabold" onDoubleClick={toggleEditor}>
            {editable ? (
              <Input
                type="text"
                className="silent-input"
                placeholder="Invoice Title"
                defaultValue={"INVOICE"}
                name="invoiceTitle"
              />
            ) : (
              "INVOICE"
            )}
          </div>
        </div>
      </div>
      <div className="flex items-start justify-between gap-5">
        <div className="flex items-center gap-1">
          <div className="flex flex-col">
            <div
              className="text-xs font-normal tracking-tight"
              onDoubleClick={toggleEditor}
            >
              {editable ? (
                <Textarea
                  className="silent-input"
                  placeholder="Company Address"
                  defaultValue={"[Street Address, City, ST ZIP Code]"}
                  name="companyAddress"
                />
              ) : (
                "[Street Address, City, ST ZIP Code]"
              )}
            </div>
            <div
              className="text-xs font-normal tracking-tight"
              onDoubleClick={toggleEditor}
            >
              {editable ? (
                <Input
                  type="email"
                  className="silent-input"
                  placeholder="Company Email"
                  defaultValue={"[example@company.com]"}
                  name="companyEmail"
                />
              ) : (
                "[example@company.com]"
              )}
            </div>
            <div
              className="text-xs font-normal tracking-tight"
              onDoubleClick={toggleEditor}
            >
              {editable ? (
                <Input
                  type="text"
                  className="silent-input"
                  placeholder="Company Phone"
                  defaultValue={"[+XXX XXXX XXX]"}
                  name="companyPhone"
                />
              ) : (
                "[+XXX XXXX XXX]"
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div
            className="text-xs font-normal tracking-tight flex items-center gap-1"
            onDoubleClick={toggleEditor}
          >
            <label htmlFor="invoiceNumber">Invoice No.</label>
            {editable ? (
              <div className="flex items-center">
                <Input
                  id="invoiceNumber"
                  type="text"
                  className="silent-input"
                  placeholder="Invoice Number"
                  defaultValue={"Invoice Number"}
                  name="invoiceNumber"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  title="Generate Invoice Number"
                  className="hover:bg-transparent hover:text-blue-600 hover:rotate-180 transition-all duration-300 ease-in-out"
                >
                  <RefreshCcw />
                </Button>
              </div>
            ) : (
              "[# Number]"
            )}
          </div>
          <div
            className="text-xs font-normal tracking-tight flex items-center"
            onDoubleClick={toggleEditor}
          >
            <label htmlFor="invoiceDate" className="mr-1">
              Issuance Date
            </label>
            {editable ? (
              <Input
                id="invoiceDate"
                type="text"
                className="silent-input bg-muted-foreground/10"
                placeholder="Select Date"
                defaultValue={"DD/MM/YYYY"}
                name="invoiceDate"
                readOnly
                disabled
              />
            ) : (
              <p>[DD/MM/YYYY]</p>
            )}
            {editable && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent hover:text-blue-600 transition-all duration-300 ease-in-out"
                  >
                    <CalendarDays />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar mode="single" captionLayout="dropdown" />
                </PopoverContent>
              </Popover>
            )}
          </div>
          <div
            className="text-xs font-normal tracking-tight flex items-center"
            onDoubleClick={toggleEditor}
          >
            <label htmlFor="invoiceDueDate" className="mr-1">
              Due Date
            </label>
            {editable ? (
              <Input
                id="invoiceDueDate"
                type="text"
                className="silent-input bg-muted-foreground/10"
                placeholder="Select Due Date"
                defaultValue={"DD/MM/YYYY"}
                name="invoiceDueDate"
                readOnly
                disabled
              />
            ) : (
              <p>[DD/MM/YYYY]</p>
            )}
            {editable && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-transparent hover:text-blue-600 transition-all duration-300 ease-in-out"
                  >
                    <CalendarDays />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar mode="single" captionLayout="dropdown" />
                </PopoverContent>
              </Popover>
            )}
          </div>
          <div
            className="text-xs font-normal tracking-tight flex items-center gap-1"
            onDoubleClick={toggleEditor}
          >
            <label htmlFor="poNumber">Purchase Order No.</label>
            {editable ? (
              <Input
                id="poNumber"
                type="text"
                className="silent-input"
                placeholder="Purchase Order Number"
                defaultValue={"PO Number"}
                name="poNumber"
              />
            ) : (
              "[# Number]"
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvoiceHeader;
