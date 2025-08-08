import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { useState } from "react";
import qrCode from "@/public/qr-code.jpeg";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw, RefreshCw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface InvoiceFooterProps {
  editable: boolean;
  toggleEditor: () => void;
}

const InvoiceFooter = ({ editable, toggleEditor }: InvoiceFooterProps) => {
  const [isAmt, setIsAmt] = useState<boolean>(false);
  const [showAdditionalFields, setShowAdditionalFields] = useState({
    discount: false,
    tax: false,
    shipping: false,
  });
  const toggleAmt = () => setIsAmt(!isAmt);

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
          <div
            className="text-xs font-normal tracking-tight"
            onDoubleClick={toggleEditor}
          >
            {editable ? (
              <Textarea
                className="silent-input"
                placeholder="Any relevant information not already covered"
                defaultValue={"Make all checks payable to [Company Name]"}
                name="invoiceNote"
              />
            ) : (
              "Make all checks payable to [Company Name]"
            )}
          </div>
          <Separator className="my-3 opacity-0" />
          <h1 className="text-sm font-extrabold tracking-tight">Terms:</h1>
          <p
            className="text-xs font-normal tracking-tight"
            onDoubleClick={toggleEditor}
          >
            {editable ? (
              <Textarea
                className="silent-input"
                placeholder="Terms &amp; Conditions"
                defaultValue={
                  "Terms &amp; Conditions, late fee interest or payment schedule"
                }
                name="invoiceNote"
              />
            ) : (
              "Terms &amp; Conditions, late fee interest or payment schedule"
            )}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <div className="w-3/4 text-end">Subtotal</div>
            <div className="shrink-1 text-end">$ 0.00</div>
          </div>
          {editable && (
            <div className="flex items-center justify-end">
              {!showAdditionalFields.discount && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-500 hover:text-green-500"
                  onClick={() =>
                    setShowAdditionalFields({
                      ...showAdditionalFields,
                      discount: true,
                    })
                  }
                >
                  <Plus />
                  Discount
                </Button>
              )}
              {!showAdditionalFields.tax && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-500 hover:text-green-500"
                  onClick={() =>
                    setShowAdditionalFields({
                      ...showAdditionalFields,
                      tax: true,
                    })
                  }
                >
                  <Plus />
                  Tax
                </Button>
              )}
              {!showAdditionalFields.shipping && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-500 hover:text-green-500"
                  onClick={() =>
                    setShowAdditionalFields({
                      ...showAdditionalFields,
                      shipping: true,
                    })
                  }
                >
                  <Plus />
                  Shipping
                </Button>
              )}
            </div>
          )}
          <Separator className="my-1 ml-auto opacity-0" />
          {showAdditionalFields.discount && (
            <div
              className="flex items-center gap-3 text-xs"
              onDoubleClick={toggleEditor}
            >
              <div className="w-3/4 text-end">Discount</div>
              <div className="shrink-1 text-end">
                {editable ? (
                  <div className="flex items-center">
                    {isAmt ? (
                      <Input
                        type="number"
                        className="silent-input"
                        placeholder="Discount Amount"
                        defaultValue={"0.00"}
                        name="discountAmt"
                      />
                    ) : (
                      <Input
                        type="number"
                        className="silent-input"
                        placeholder="Discount %"
                        defaultValue={"0.00"}
                        name="discountPercentage"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Generate Invoice Number"
                      className="hover:bg-transparent hover:text-blue-600 hover:rotate-180 transition-all duration-300 ease-in-out"
                      onClick={toggleAmt}
                    >
                      {isAmt ? <RefreshCcw /> : <RefreshCw />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Remove"
                      className="hover:bg-transparent hover:text-red-600 transition-all duration-300 ease-in-out"
                      onClick={() =>
                        setShowAdditionalFields({
                          ...showAdditionalFields,
                          discount: false,
                        })
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ) : (
                  "$ 0.00"
                )}
              </div>
            </div>
          )}
          {showAdditionalFields.tax && (
            <div
              className="flex items-center gap-3 text-xs"
              onDoubleClick={toggleEditor}
            >
              <div className="w-3/4 text-end">Tax</div>
              <div className="shrink-1 text-end">
                {editable ? (
                  <div className="flex items-center">
                    {isAmt ? (
                      <Input
                        type="number"
                        className="silent-input"
                        placeholder="Tax Amount"
                        defaultValue={"0.00"}
                        name="taxAmt"
                      />
                    ) : (
                      <Input
                        type="number"
                        className="silent-input"
                        placeholder="Tax %"
                        defaultValue={"0.00"}
                        name="taxPercentage"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Generate Invoice Number"
                      className="hover:bg-transparent hover:text-blue-600 hover:rotate-180 transition-all duration-300 ease-in-out"
                      onClick={toggleAmt}
                    >
                      {isAmt ? <RefreshCcw /> : <RefreshCw />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Remove"
                      className="hover:bg-transparent hover:text-red-600 transition-all duration-300 ease-in-out"
                      onClick={() =>
                        setShowAdditionalFields({
                          ...showAdditionalFields,
                          tax: false,
                        })
                      }
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ) : (
                  "$ 0.00"
                )}
              </div>
            </div>
          )}
          {showAdditionalFields.shipping && (
            <div
              className="flex items-center gap-3 text-xs"
              onDoubleClick={toggleEditor}
            >
              <div className="w-3/4 text-end">Shipping</div>
              <div className="shrink-1 text-end">
                {editable ? (
                  <div className="flex items-center">
                    <Input
                      type="number"
                      className="silent-input"
                      placeholder="Shipping"
                      defaultValue={"0.00"}
                      name="shipping"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Remove"
                      className="hover:bg-transparent hover:text-red-600 transition-all duration-300 ease-in-out"
                      onClick={toggleAmt}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ) : (
                  "$ 0.00"
                )}
              </div>
            </div>
          )}
          <Separator className="my-2 ml-auto opacity-0" />
          <div className="flex items-center gap-3 text-sm font-semibold">
            <div className="w-3/4 text-end">Total</div>
            <div className="shrink-1 text-end">$ 0.00</div>
          </div>
          <div
            className="flex items-center gap-3 text-sm"
            onDoubleClick={toggleEditor}
          >
            <div className="w-3/4 text-end">Amount Paid</div>
            <div className="shrink-1 text-end">
              {editable ? (
                <Input
                  type="number"
                  className="silent-input"
                  placeholder="Discount"
                  defaultValue={"0.00"}
                  name="amountPaid"
                />
              ) : (
                "$ 0.00"
              )}
            </div>
          </div>
          <Separator className="my-2 ml-auto opacity-0" />
          <div className="flex items-center gap-3 font-bold">
            <div className="w-3/4 text-end">Balance</div>
            <div className="shrink-1 text-end">$ 0.00</div>
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
        <div
          className="text-xs font-normal tracking-tight"
          onDoubleClick={toggleEditor}
        >
          {editable ? (
            <Textarea
              className="silent-input"
              placeholder="Ending message"
              defaultValue={
                "[If you have any questions concerning this invoice, contact [Name, phone, email]"
              }
              name="endingMessage"
            />
          ) : (
            "If you have any questions concerning this invoice, contact [Name, phone, email]"
          )}
        </div>
        <div
          className="text-sm font-extrabold tracking-tight"
          onDoubleClick={toggleEditor}
        >
          {editable ? (
            <Input
              type="text"
              className="silent-input"
              placeholder="Thanking message"
              defaultValue={"[THANK YOU FOR YOUR BUSINESS!]"}
              name="thankingMessage"
            />
          ) : (
            "THANK YOU FOR YOUR BUSINESS!"
          )}
        </div>
      </div>
    </section>
  );
};

export default InvoiceFooter;
