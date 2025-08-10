import { FormInterface, InvoiceInterface, RecipientInterface } from "@/types";
import React from "react";

interface RecipientSectionProps {
  data: FormInterface | InvoiceInterface;
}

const RecipientSection = ({ data }: RecipientSectionProps) => {
  const renderRecipient = (title: string, recipient: RecipientInterface) => {
    return (
      <div className="flex flex-col">
        <h1 className="text-sm font-extrabold tracking-tight">{title}:</h1>
        <h2 className="text-xs font-normal tracking-tight">
          {recipient.recipientName}
        </h2>
        <h3 className="text-xs font-normal tracking-tight">
          {recipient.companyName}
        </h3>
        <p className="text-xs font-normal tracking-tight">
          {recipient.companyAddress}
        </p>
        <a
          href={`mailto:${recipient.email}`}
          className="text-xs font-normal tracking-tight text-primary"
        >
          {recipient.email}
        </a>
        {recipient.phone.length ? (
          <a
            href={`tel:${recipient.phone}`}
            className="text-xs font-normal tracking-tight text-primary"
          >
            {recipient.phone}
          </a>
        ) : null}
      </div>
    );
  };

  return (
    <section id="recipient-section" className="flex flex-col gap-5 my-5">
      <div className="grid grid-cols-2 gap-5">
        {renderRecipient("Bill to", data.billTo)}
        {renderRecipient("Ship to", data.isSame ? data.billTo : data.shipTo)}
      </div>
    </section>
  );
};

export default RecipientSection;
