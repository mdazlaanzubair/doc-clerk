// Form last active step interface
export interface FormLastActiveStepInterface {
  step: number;
}

// Company info interface
export interface CompanyInfoInterface {
  // Required fields
  name: string;
  email: string;
  address: string;

  // Optional fields
  logo?: string;
  phone?: string;
  companySlogan?: string;
}

// Recipient interface
export interface Recipient {
  rep: string;
  companyName: string;
  email: string;
  address: string;
  phone?: string;
}

// Recipient info interface
export interface RecipientInfoInterface {
  billTo: Recipient;
  shipTo?: Recipient;
  isSameAsBillTo: boolean;
}

// Invoice details interface
export interface InvoiceDetailsInterface {
  invoiceNumber: string;
  currency: string;
  invoiceDate: string | Date;
  dueDate: string | Date;

  // Optional fields
  invoiceTitle?: string;
  preparedBy?: string;
  poNumber?: string;
}

// Invoice item interface
export interface InvoiceItemInterface {
  itemDesc: string;
  qty: number;
  cost: number;
}

// Invoice items list interface
export interface InvoiceItemsListInterface {
  items: InvoiceItemInterface[];
  subTotal: number;
}

// Amount and percentage interface
export interface AmountAndPercentage {
  isAmount: boolean;
  amount: number;
}

// Additional charges interface
export interface AdditionalChargesInterface {
  total: number;
  balanceDue: number;
  amountPaid: number;
  shipping: number;
  discount: AmountAndPercentage;
  tax: AmountAndPercentage;
}

// Invoice footer interface
export interface InvoiceFooterInterface {
  notes: string;
  terms: string;
  thanksMessage: string;
}

// Invoice form interface
export interface InvoiceFormInterface {
  companyInfo: CompanyInfoInterface;
  recipientInfo: RecipientInfoInterface;
  invoiceDetails: InvoiceDetailsInterface;
  invoiceItems: InvoiceItemsListInterface;
  additionalCharges: AdditionalChargesInterface;
  invoiceFooter: InvoiceFooterInterface;
}

// Invoice interface
export interface InvoiceInterface extends InvoiceFormInterface {
  userId: string;
  id: string;
  created_at: string;
  updated_at: string;
  isPublished: boolean;
  isArchive: boolean;
  downloadCount: number;
  printCount: number;
}
