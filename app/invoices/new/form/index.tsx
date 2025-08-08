"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import InvoiceHeaderForm from "./components/InvoiceHeaderForm";
import RecipientSectionForm from "./components/RecipientSectionForm";
import InvoiceItemsForm from "./components/InvoiceItemsForm";

const InvoiceForm = () => {
  const [formStep, seFormStep] = useState<1 | 2 | 3>(1);

  return (
    <>
      <section
        id="invoice-actions"
        className="w-full flex items-center justify-between gap-3 mx-auto my-5"
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
      </section>
      <section
        id="invoice-form-section"
        className="w-full h-auto flex flex-col py-3 gap-5"
      >
        {formStep === 1 ? (
          <InvoiceHeaderForm toNextStep={() => seFormStep(2)} />
        ) : formStep === 2 ? (
          <RecipientSectionForm
            toPrevStep={() => seFormStep(1)}
            toNextStep={() => seFormStep(3)}
          />
        ) : (
          <InvoiceItemsForm toPrevStep={() => seFormStep(2)} />
        )}
      </section>
    </>
  );
};

export default InvoiceForm;
