import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

interface RecipientSectionProps {
  editable: boolean;
  toggleEditor: () => void;
}

interface RecipientProps {
  title: string;
  editable: boolean;
  toggleEditor: () => void;
}

const Recipient = ({ title, editable, toggleEditor }: RecipientProps) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-sm font-extrabold tracking-tight">{title}:</h1>
      <div
        className="text-xs font-normal tracking-tight"
        onDoubleClick={toggleEditor}
      >
        {editable ? (
          <Input
            type="text"
            className="silent-input"
            placeholder="Recipient Name"
            defaultValue={"[Recipient Name]"}
            name="recipientName"
          />
        ) : (
          "[Recipient Name]"
        )}
      </div>
      <div className="text-xs font-normal tracking-tight">
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
  );
};

const RecipientSection = ({
  editable,
  toggleEditor,
}: RecipientSectionProps) => {
  return (
    <section id="recipient-section" className="flex flex-col gap-5 my-5">
      <div className="grid grid-cols-2 gap-5">
        <Recipient
          title="Bill to"
          editable={editable}
          toggleEditor={toggleEditor}
        />
        <Recipient
          title="Ship to"
          editable={editable}
          toggleEditor={toggleEditor}
        />
      </div>
    </section>
  );
};

export default RecipientSection;
