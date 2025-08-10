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
