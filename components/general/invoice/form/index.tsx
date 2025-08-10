"use client";

import React, { useState } from "react";
import InvoiceHeaderForm from "./components/InvoiceHeaderForm";
import RecipientSectionForm from "./components/RecipientSectionForm";
import InvoiceItemsForm from "./components/InvoiceItemsForm";
import InvoicePreview from "@/components/general/invoice/preview";

const InvoiceForm = () => {
  const [formStep, seFormStep] = useState<number>(3);

  return (
    <section
      id="invoice-form-section"
      className="w-full h-auto flex flex-col py-3 gap-5"
    >
      {formStep === 0 ? (
        <InvoiceHeaderForm toNextStep={() => seFormStep(1)} />
      ) : formStep === 1 ? (
        <RecipientSectionForm
          toPrevStep={() => seFormStep(0)}
          toNextStep={() => seFormStep(2)}
        />
      ) : formStep === 2 ? (
        <InvoiceItemsForm
          toPrevStep={() => seFormStep(1)}
          toNextStep={() => seFormStep(3)}
        />
      ) : (
        <InvoicePreview editInvoice={() => seFormStep(2)} />
      )}
    </section>
  );
};

export default InvoiceForm;
