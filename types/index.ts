// Invoice type
export interface RecipientInterface {
  recipientName: string;
  companyName: string;
  email: string;
  phone: string;
  companyAddress: string;
}

export interface InvoiceItemInterface {
  itemDesc: string;
  qty: number;
  cost: number;
}

export interface FormInterface {
  invoiceNumber: string;
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  invoiceDate: string | Date;
  dueDate: string | Date;
  currency: string;
  poNumber: string;
  invoiceTitle: string;
  companySlogan: string;
  companyPhone: string;
  billTo: RecipientInterface;
  shipTo: RecipientInterface;
  isSame: boolean;
  items: InvoiceItemInterface[];
  discount: number;
  isDiscountAmt: boolean;
  tax: number;
  isTaxAmt: boolean;
  shipping: number;
  amountPaid: number;
  notes: string;
  terms: string;
  thanksMessage: string;
}

export interface InvoiceInterface extends FormInterface {
  id: string;
  userId: string;
  created_at: string;
  updated_at: string;
  thanksMessage: string;
  isPublished: boolean;
  isArchive: boolean;
  downloadCount: number;
  printCount: number;
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
export interface invoiceItemsListInterface {
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
export interface InvoiceFormInterfaceV2 {
  companyInfo: CompanyInfoInterface;
  recipientInfo: RecipientInfoInterface;
  invoiceDetails: InvoiceDetailsInterface;
  invoiceItems: invoiceItemsListInterface;
  additionalCharges: AdditionalChargesInterface;
  invoiceFooter: InvoiceFooterInterface;
}

// Invoice interface
export interface InvoiceInterfaceV2 extends InvoiceFormInterfaceV2 {
  userId: string;
  id: string;
  created_at: string;
  updated_at: string;
  isPublished: boolean;
  isArchive: boolean;
  downloadCount: number;
  printCount: number;
}
