import z from "zod";

// Form 1: Invoice header form schema
export const invoiceHeaderFormSchema = z.object({
  // Required fields
  invoiceNumber: z.string().nonempty({
    message: "Invoice number is required",
  }),
  companyName: z.string().min(3, "Name must be at least 3 characters"),
  companyEmail: z.string().email({
    message: "Invalid email address.",
  }),
  companyAddress: z.string().min(10, "Address must be at least 10 characters"),
  invoiceDate: z.date({
    message: "Invoice date is required",
  }),
  dueDate: z.date({
    message: "Due date is required",
  }),
  currency: z.string().min(1, "Currency is required"),

  // Optional fields
  poNumber: z.string().optional().default(""),
  invoiceTitle: z.string().optional().default(""),
  companySlogan: z.string().optional().default(""),
  companyPhone: z.string().optional().default(""),
});

/* Form 2: Recipient form schema
 * - If `isSame` is true, shipping fields are optional.
 * - If `isSame` is false, shipping fields are required.
 */
export const recipientFormSchema = z
  .object({
    billTo: z.object({
      recipientName: z.string().min(1, "Recipient name is required"),
      companyName: z
        .string()
        .min(3, "Company name must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      phone: z.string().optional().default(""),
      companyAddress: z
        .string()
        .min(10, "Address must be at least 10 characters"),
    }),
    shipTo: z.object({
      recipientName: z.string().optional().default(""),
      companyName: z.string().optional().default(""),
      email: z.string().optional().default(""),
      phone: z.string().optional().default(""),
      companyAddress: z.string().optional().default(""),
    }),
    isSame: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (!data.isSame) {
      if (!data.shipTo.recipientName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Recipient name is required",
          path: ["shipTo", "recipientName"],
        });
      }
      if (!data.shipTo.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Company name is required",
          path: ["shipTo", "companyName"],
        });
      }
      if (!data.shipTo.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Email is required",
          path: ["shipTo", "email"],
        });
      }
      if (!data.shipTo.companyAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Address is required",
          path: ["shipTo", "companyAddress"],
        });
      }
    }
  });

// Invoice items form schema
const invoiceItemSchema = z.object({
  itemDesc: z.string().min(3, "Name must be at least 3 characters").default(""),
  qty: z.number().min(1, "Quantity must be at least 1").default(0),
  cost: z.number().min(1, "Cost must be at least 1").default(0),
});

// Form 3: Invoice items form schema
export const invoiceItemsFormSchema = z.object({
  // Required fields
  items: z
    .array(invoiceItemSchema)
    .min(1, "At least one invoice item is required")
    .default([]),

  // Optional fields
  discount: z.number().min(0, "Discount must be at least 0").default(0),
  isDiscountAmt: z.boolean().default(false),
  tax: z.number().min(0, "Tax must be at least 0").default(0),
  isTaxAmt: z.boolean().default(false),
  shipping: z.number().min(0, "Tax must be at least 0").default(0),
  amountPaid: z.number().min(0, "Amount paid must be at least 0").default(0),
  notes: z.string().optional().default(""),
  terms: z.string().optional().default(""),
  thanksMessage: z.string().optional().default(""),
});
