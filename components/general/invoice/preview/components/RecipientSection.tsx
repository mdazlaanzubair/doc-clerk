import {
  InvoiceFormInterface,
  InvoiceInterface,
  RecipientInterface,
} from "@/types";
import React from "react";

interface RecipientSectionProps {
  data: InvoiceFormInterface | InvoiceInterface;
}

const RecipientSection = ({ data }: RecipientSectionProps) => {
  const { billTo, shipTo, isSameAsBillTo } = data.recipientInfo;

  return (
    <section id="recipient-section" className="flex flex-col gap-5 my-5">
      <div className="grid grid-cols-2 gap-5">
        <Recipient title="Bill to" recipient={billTo} />
        {!isSameAsBillTo && shipTo ? (
          <Recipient title="Ship to" recipient={shipTo} />
        ) : (
          <Recipient title="Ship to" recipient={billTo} />
        )}
      </div>
    </section>
  );
};

export default RecipientSection;

// ===========================
// Sub-component for recipient
// ===========================
interface RecipientPropsInterface {
  title: string;
  recipient: RecipientInterface;
}

const Recipient = ({ title, recipient }: RecipientPropsInterface) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-sm font-extrabold tracking-tight">{title}:</h1>
      <h2 className="text-xs font-normal tracking-tight">{recipient.rep}</h2>
      <h3 className="text-xs font-normal tracking-tight">
        {recipient.companyName}
      </h3>
      <p className="text-xs font-normal tracking-tight">{recipient.address}</p>
      <a
        href={`mailto:${recipient.email}`}
        className="text-xs font-normal tracking-tight text-primary"
      >
        {recipient.email}
      </a>
      {recipient.phone?.length ? (
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
