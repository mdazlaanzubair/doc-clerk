import z from "zod";

// Amount schema
const amountSchema = z
  .number()
  .nonnegative("Amount must be non-negative")
  .max(9999999999, "Amount is too large");
const nameSchema = z.string().min(3, "Name must be at least 3 characters");
const emailSchema = z.string().email("Invalid email address");
const addressSchema = z
  .string()
  .min(5, "Address must be at least 5 characters");
const urlSchema = z.string().url("Invalid URL").or(z.literal("")).optional();
const optionalFieldsSchema = z.string().optional();
const recipientSchema = z.object({
  // Required fields
  rep: nameSchema, // Company representative
  companyName: nameSchema,
  email: emailSchema,
  address: addressSchema,

  // Optional fields
  phone: optionalFieldsSchema,
});

// Company info form schema of invoice creator
export const companyInfoSchema = z.object({
  // Required fields
  name: nameSchema,
  email: emailSchema,
  address: addressSchema,

  // Optional fields
  logo: urlSchema,
  phone: optionalFieldsSchema,
  companySlogan: optionalFieldsSchema,
});

// Recipient info schema
export const recipientInfoSchema = z.object({
  billTo: recipientSchema,
  isSameAsBillTo: z.boolean(),
  shipTo: recipientSchema,
});

// Invoice details schema
export const invoiceDetailsSchema = z.object({
  // Required fields
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.union([
    z.date({ message: "Invoice date is required" }),
    z.string().min(1, "Invoice date is required"),
  ]),
  dueDate: z.union([
    z.date({ message: "Due date is required" }),
    z.string().min(1, "Due date is required"),
  ]),
  currency: z.string().min(1, "Currency is required"),

  // Optional fields
  invoiceTitle: optionalFieldsSchema.default("INVOICE"),
  poNumber: optionalFieldsSchema,
  preparedBy: optionalFieldsSchema,
});

// Invoice item schema
const invoiceItemsSchema = z.object({
  itemDesc: z.string().min(3, "Item description must be at least 3 characters"),
  qty: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(9999999, "Quantity is too large"),
  cost: z
    .number()
    .min(1, "Cost must be at least 1")
    .max(9999999999, "Cost is too large"),
});

// Invoice items list schema
export const invoiceItemsListSchema = z.object({
  items: z
    .array(invoiceItemsSchema)
    .min(1, "At least one invoice item is required"),
  subTotal: z.number().min(0, "Subtotal must be at least 0"),
});

// Additional charges schema
export const additionalChargesSchema = z.object({
  // Required fields
  total: amountSchema,
  balanceDue: amountSchema,

  // Optional fields
  amountPaid: amountSchema,
  shipping: amountSchema,
  discount: z.object({
    isAmount: z.boolean(),
    amount: amountSchema,
  }),
  tax: z.object({
    isAmount: z.boolean(),
    amount: amountSchema,
  }),
});

// Invoice footer schema
export const invoiceFooterSchema = z.object({
  notes: optionalFieldsSchema,
  terms: optionalFieldsSchema,
  thanksMessage: z.string().min(5, "Message must be at least 5 characters"),
});

// Complete invoice form schema
// Combine all schemas into one
export const completeInvoiceFormSchema = z.object({
  companyInfo: companyInfoSchema,
  recipientInfo: recipientInfoSchema,
  invoiceDetails: invoiceDetailsSchema,
  invoiceItemsList: invoiceItemsListSchema,
  additionalCharges: additionalChargesSchema,
  invoiceFooter: invoiceFooterSchema,
});
