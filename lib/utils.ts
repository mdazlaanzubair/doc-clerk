import { InvoiceFormInterface, InvoiceInterface } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to generate unique id from date
// Unique ID = [Year-Month-Day-Time]
export function generateRandomID() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  const time = `${hours}${minutes}${seconds}${milliseconds}`;

  // Generate and return unique ID
  return `${year}-${month}-${day}-${time}`;
}

// Function to format amount
export function formatAmount(amount: number): string {
  const formattedAmt = new Intl.NumberFormat("en-US").format(amount);
  return formattedAmt;
}

// ===================
// localStorageHelpers
// ===================

// Generic helpers
// ---------------
function setData<T>(key: string, value: T): void {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

function getData<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : null;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return null;
  }
}

// Form Progress + Last Active Step
// --------------------------------
export function saveFormProgress(progress: InvoiceFormInterface): void {
  setData<InvoiceFormInterface>("formProgress", progress);
}

export function getFormProgress(): InvoiceFormInterface | null {
  return getData<InvoiceFormInterface>("formProgress");
}

export function saveLastActiveStep(step: number): void {
  setData<number>("lastActiveStep", step);
}

export function getLastActiveStep(): number | null {
  return getData<number>("lastActiveStep");
}

export function clearFormProgress(): void {
  localStorage.removeItem("formProgress");
  localStorage.removeItem("lastActiveStep");
}

// CRUD for Invoices
// -----------------
const INVOICES_KEY = "invoices";

export function getInvoices(): InvoiceInterface[] {
  return getData<InvoiceInterface[]>(INVOICES_KEY) || [];
}

export function saveInvoices(invoices: InvoiceInterface[]): void {
  setData<InvoiceInterface[]>(INVOICES_KEY, invoices);
}

export function addInvoice(invoice: InvoiceInterface): void {
  const invoices = getInvoices();
  invoices.push(invoice);
  saveInvoices(invoices);
}

export function updateInvoice(updatedInvoice: InvoiceInterface): void {
  let invoices = getInvoices();
  invoices = invoices.map((inv) =>
    inv.id === updatedInvoice.id ? updatedInvoice : inv
  );
  saveInvoices(invoices);
}

export function deleteInvoice(id: string): void {
  let invoices = getInvoices();
  invoices = invoices.filter((inv) => inv.id !== id);
  saveInvoices(invoices);
}

export function getInvoiceById(id: string): InvoiceInterface | null {
  const invoices = getInvoices();
  return invoices.find((inv) => inv.id === id) || null;
}
