"use client";

import React, { useState } from "react";
import InvoiceHeader from "./InvoiceHeader";
import RecipientSection from "./RecipientSection";
import ItemsSection from "./ItemsSection";
import InvoiceFooter from "./InvoiceFooter";
import { Button } from "@/components/ui/button";
import { Edit2, Eye, Save, Trash2 } from "lucide-react";

const InvoiceForm = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const toggleEditor = () => setIsEdit(!isEdit);
  return (
    <>
      <section
        id="invoice-actions"
        className="w-full max-w-3xl flex items-center justify-between gap-3 mx-auto my-5"
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
            title={isEdit ? "Edit" : "Preview"}
            onClick={toggleEditor}
          >
            {isEdit ? <Eye /> : <Edit2 />}
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
        <InvoiceHeader editable={isEdit} toggleEditor={toggleEditor} />
        <RecipientSection editable={isEdit} toggleEditor={toggleEditor} />
        <ItemsSection editable={isEdit} toggleEditor={toggleEditor} />
        <InvoiceFooter editable={isEdit} toggleEditor={toggleEditor} />
      </section>
    </>
  );
};

export default InvoiceForm;
