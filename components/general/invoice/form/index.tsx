"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import {
  CompanyInfoForm,
  RecipientInfoForm,
  InvoiceDetailsForm,
  InvoiceItemsForm,
  AdditionalChargesForm,
  InvoiceFooterForm,
} from "./components";
import { Form } from "@/components/ui/form";
import { completeInvoiceFormSchema } from "./formSchema";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { InvoiceInterface } from "@/types";
import { useInvoices } from "@/hooks/useInvoice";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  addInvoice,
  clearFormProgress,
  getFormProgress,
  getInvoiceById,
  getLastActiveStep,
  saveFormProgress,
  saveLastActiveStep,
} from "@/lib/utils";

// Default form values (kept identical to your original)
const defaultValues = {
  companyInfo: {
    name: "",
    email: "",
    address: "",
    logo: "",
    phone: "",
    companySlogan: "",
  },
  recipientInfo: {
    billTo: {
      rep: "",
      companyName: "",
      email: "",
      phone: "",
      address: "",
    },
    shipTo: {
      rep: "",
      companyName: "",
      email: "",
      phone: "",
      address: "",
    },
    isSameAsBillTo: true,
  },
  invoiceDetails: {
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    currency: "$",
    invoiceTitle: "INVOICE",
    poNumber: "",
    preparedBy: "",
  },
  invoiceItemsList: {
    items: [{ itemDesc: "Item", qty: 1, cost: 1 }],
    subTotal: 0,
  },
  additionalCharges: {
    total: 1,
    balanceDue: 1,
    amountPaid: 0,
    shipping: 0,
    discount: {
      isAmount: true,
      amount: 0,
    },
    tax: {
      isAmount: false,
      amount: 0,
    },
  },
  invoiceFooter: {
    notes: "Make all checks payable to [Company Name]",
    terms: "",
    thanksMessage: "THANK YOU FOR YOUR BUSINESS!",
  },
};

interface InvoiceFormPropsInterface {
  invoiceId?: string;
}

export default function InvoiceForm({ invoiceId }: InvoiceFormPropsInterface) {
  // single form instance for whole wizard (keeps state across steps)
  const methods = useForm({
    resolver: zodResolver(completeInvoiceFormSchema),
    mode: "onChange",
    defaultValues,
  });

  const { userId } = useAuth();
  const InvoiceAPI = useInvoices();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastActiveStep, setLastActiveStep] = useState<number>(0);

  // step config - keep the components here (not in state)
  const stepConfigs = useMemo(
    () => [
      { name: "Company Info", Component: CompanyInfoForm },
      { name: "Recipient Info", Component: RecipientInfoForm },
      { name: "Invoice Details", Component: InvoiceDetailsForm },
      { name: "Invoice Items", Component: InvoiceItemsForm },
      { name: "Additional Charges", Component: AdditionalChargesForm },
      { name: "Invoice Footer", Component: InvoiceFooterForm },
    ],
    []
  );

  // Load persisted data on mount
  useEffect(() => {
    // If invoice id is available fetch data from the database and set in the form
    if (invoiceId && InvoiceAPI && userId) {
      const fetchInvoiceData = async () => {
        try {
          setIsLoading(true);
          const data: InvoiceInterface = await InvoiceAPI.getInvoiceById(
            invoiceId,
            userId
          );
          methods.reset(data);
        } catch (error) {
          const errMsg = "Something went wrong while fetching invoice data";
          console.error(error);
          toast.error(errMsg);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInvoiceData();

      // Restoring the form steps
      setCurrentStep(stepConfigs.length - 1);
      setLastActiveStep(stepConfigs.length - 1);

      // Updating local storage for form progress
      saveFormProgress(methods.getValues());
      saveLastActiveStep(stepConfigs.length - 1);
    } else if (invoiceId && !userId) {
      const data = getInvoiceById(invoiceId);

      if (data) methods.reset(data);
      else methods.reset(defaultValues);

      // Restoring the form steps
      setCurrentStep(stepConfigs.length - 1);
      setLastActiveStep(stepConfigs.length - 1);

      // Updating local storage for form progress
      saveFormProgress(methods.getValues());
      saveLastActiveStep(stepConfigs.length - 1);
    } else {
      const savedProgress = getFormProgress();
      const savedLast: number = getLastActiveStep() || 0;

      // restore form values
      if (savedProgress) methods.reset(savedProgress);

      // If the saved last step is ahead of zero, restore the current step to that
      // so user continues where they left
      if (savedLast && typeof savedLast === "number") {
        const persistedLast = Math.min(savedLast, stepConfigs.length - 1);
        setLastActiveStep(persistedLast);
        setCurrentStep(persistedLast);
      }
    }
  }, [invoiceId, InvoiceAPI, userId]); // run once on mount

  // Mapping steps with the form/steps keys
  const FIELD_TO_STEP_MAP: Record<string, number> = {
    companyInfo: 0,
    recipientInfo: 1,
    invoiceDetails: 2,
    invoiceItemsList: 3,
    additionalCharges: 4,
    invoiceFooter: 5,
  };

  // Function to recursively traverse the error object and return the first error path string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function findFirstErrorPath(obj: any, prefix = ""): string | null {
    if (!obj || typeof obj !== "object") return null;

    // iterate keys in stable order
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      const path = prefix ? `${prefix}.${key}` : key;

      if (!val) continue;

      // Leaf error object from react-hook-form typically contains "message" or "type"
      if (typeof val.message === "string" || typeof val.type === "string") {
        return path;
      }

      // If it's an array (e.g. items: []), iterate indices
      if (Array.isArray(val)) {
        for (let i = 0; i < val.length; i++) {
          const child = findFirstErrorPath(val[i], `${path}.${i}`);
          if (child) return child;
        }
        continue;
      }

      // Otherwise, descend recursively
      if (typeof val === "object") {
        const child = findFirstErrorPath(val, path);
        if (child) return child;
      }
    }

    return null;
  }

  // Function to jump to the form where the error occurs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function jumpToFirstErrorStep(errors: any) {
    const firstPath = findFirstErrorPath(errors);
    if (!firstPath) return;

    // top-level key (companyInfo in companyInfo.logo)
    const top = firstPath.split(".")[0];
    const stepIndex = FIELD_TO_STEP_MAP[top];

    // If we know the step, set it and then focus the exact field.
    if (typeof stepIndex === "number") {
      setCurrentStep(stepIndex);

      // Wait a tick so the step UI mounts and the input is available to focus.
      // 50ms is usually fine. You can tweak or use requestAnimationFrame instead.
      setTimeout(() => {
        // methods.setFocus accepts dot paths with numeric indices like 'items.0.qty'
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          methods.setFocus(firstPath as any);
        } catch (e) {
          // fallback: if focusing fails, log for debugging
          console.warn("setFocus failed for", firstPath, e);
        }
      }, 50);
    } else {
      // fallback: go to first step
      setCurrentStep(0);
      setTimeout(() => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          methods.setFocus(firstPath as any);
        } catch {}
      }, 50);
    }
  }

  // Function to validates fields for the current step
  const validateCurrentStep = async (stepIndex: number) => {
    // map step to fields that must be validated before moving forward
    // you can extend this to be more precise / more fields
    switch (stepIndex) {
      case 0:
        return await methods.trigger([
          "companyInfo.name",
          "companyInfo.email",
          "companyInfo.address",
        ]);
      case 1:
        return await methods.trigger([
          "recipientInfo.billTo.rep",
          "recipientInfo.billTo.companyName",
          "recipientInfo.billTo.email",
          "recipientInfo.billTo.address",
        ]);
      case 2:
        return await methods.trigger([
          "invoiceDetails.invoiceNumber",
          "invoiceDetails.invoiceDate",
          "invoiceDetails.dueDate",
          "invoiceDetails.currency",
        ]);
      case 3:
        // trigger array validation for items
        return await methods.trigger("invoiceItemsList.items");
      case 4:
        return await methods.trigger([
          "additionalCharges.shipping",
          "additionalCharges.discount.amount",
          "additionalCharges.tax.amount",
          "additionalCharges.amountPaid",
        ]);
      case 5:
        return await methods.trigger([
          "invoiceFooter.notes",
          "invoiceFooter.terms",
          "invoiceFooter.thanksMessage",
        ]);
      default:
        return true;
    }
  };

  // Function to move to the next step (if current step is valid)
  // If `goToIndex` is provided and is a number it will attempt to jump to that index
  // only allowed if the target index <= unlocked step after validation)
  const handleNext = async (goToIndex?: number) => {
    const isValid = await validateCurrentStep(currentStep);

    if (!isValid) {
      toast.error("Please fix validation errors before continuing.");
      return;
    }

    // Save progress before moving on
    const currentFormValues = methods.getValues();
    saveFormProgress(currentFormValues);

    // compute the next step:
    let nextStep = typeof goToIndex === "number" ? goToIndex : currentStep + 1;
    // clamp bounds
    nextStep = Math.max(0, Math.min(nextStep, stepConfigs.length - 1));

    // compute new unlocked step (highest reached)
    const newLastActive = Math.max(lastActiveStep, nextStep);

    // persist unlocked step
    saveLastActiveStep(newLastActive);
    setLastActiveStep(newLastActive);
    setCurrentStep(nextStep);
    toast.info("Progress saved successfully");
  };

  // Function to move back one step. Do NOT reduce `lastActiveStep`.
  const handlePrevious = () => {
    if (currentStep === 0) return;
    const formValues = methods.getValues();
    saveFormProgress(formValues);
    // keep lastActiveStep as-is (we don't want to lock user out)
    setCurrentStep((s) => s - 1);
    toast.info("Progress saved successfully");
  };

  // Function to ve called when user clicks a step indicator (the bubbles).
  // Allow only if the index is already unlocked (<= lastActiveStep).
  // No revalidation required for going backwards / reviewing.
  const goToStep = (index: number) => {
    if (index <= lastActiveStep) {
      setCurrentStep(index);
    } else {
      // optionally notify user why they can't jump ahead
      toast.info("Please complete the current step before accessing this one.");
    }
  };

  // Function to save form data to the database
  const handleFinalSubmit = methods.handleSubmit(
    async (formData) => {
      if (isLoading || !formData) return;

      try {
        // If user in unauthenticated / Guest, then
        // store the data in the browser local storage
        if (!userId) {
          // Changing loading state
          setIsLoading(true);

          // Preparing request body
          const reqBody: InvoiceInterface = {
            ...formData,
            isPublished: false,
            isArchive: false,
            downloadCount: 0,
            printCount: 0,
            isPaid: false,
            id: uuidv4(), // Creating custom id
            user_id: "Guest", // adding GUEST user id
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          addInvoice(reqBody);
          toast.success("Invoice saved successfully!");
          clearFormProgress(); // Clearing local storage form data
          router.push(`/invoices/${reqBody.id}/preview`);
          setIsLoading(false);
        }

        if (userId && InvoiceAPI) {
          // Preparing request body
          const reqBody = {
            ...formData,
            isPaid: false,
            isPublished: false,
            isArchive: false,
            downloadCount: 0,
            printCount: 0,
            user_id: userId,
          };

          (reqBody as InvoiceInterface).user_id = userId;
          const data = await InvoiceAPI.upsertInvoice(reqBody);
          toast.success("Invoice saved successfully!");
          clearFormProgress(); // Clearing local storage form data
          router.push(`/invoices/${data.id}/preview`);
        }
      } catch (error) {
        console.error("SAVING INVOICE ERRORS", error);
        toast.error("Something went wrong while saving invoice.");
      } finally {
        setIsLoading(false);
      }
    },
    (errors) => {
      console.error("SUBMIT ERRORS", errors);
      jumpToFirstErrorStep(errors);
      toast.error("Please fix validation errors before submitting.");
    }
  );

  // Derive whether a step is disabled from lastActiveStep
  const isStepDisabled = (index: number) => index > lastActiveStep;

  // render current step component
  const CurrentStepComponent = stepConfigs[currentStep].Component;

  return (
    <Form {...methods}>
      <FormProvider {...methods}>
        <form
          onSubmit={handleFinalSubmit}
          className="space-y-8 w-full mx-auto my-4"
        >
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8 text-xs">
            {stepConfigs.map((step, index) => (
              <button
                key={`step-${index}-${step.name}`}
                type="button"
                onClick={() => goToStep(index)}
                className={`flex items-center ${
                  isStepDisabled(index)
                    ? "pointer-events-none cursor-not-allowed opacity-50"
                    : "cursor-pointer opacity-100"
                }`}
                aria-current={index === currentStep}
                aria-disabled={isStepDisabled(index)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentStep
                      ? "bg-blue-500 text-white"
                      : !isStepDisabled(index) && index < currentStep
                      ? "bg-green-400 text-white"
                      : !isStepDisabled(index)
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`ml-2 ${index === currentStep ? "font-bold" : ""}`}
                >
                  {step.name}
                </span>

                {index < stepConfigs.length - 1 && (
                  <div
                    className={`flex-1 h-1 ml-3 mr-3 ${
                      index < currentStep ? "bg-green-500" : "bg-gray-300"
                    }`}
                    aria-hidden
                  />
                )}
              </button>
            ))}
          </div>

          {/* Render the current step component */}
          <div>
            <CurrentStepComponent />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-end gap-3">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                className="hover:text-blue-700 hover:bg-blue-50"
                type="button"
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}

            {currentStep < stepConfigs.length - 1 ? (
              <Button type="button" onClick={() => handleNext()}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Invoice</span>
                )}
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </Form>
  );
}
