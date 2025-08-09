import { clsx, type ClassValue } from "clsx";
import { QRCodeSVG } from "qrcode.react";
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
