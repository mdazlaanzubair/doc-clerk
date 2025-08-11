import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
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

/**
 * Save or update (upsert) a value in localStorage for the given key.
 * @param key - The localStorage key
 * @param data - The data to save (will be stringified as JSON)
 */
export function upsertLocalStorage<T>(key: string, data: T): void {
  try {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
  } catch (error) {
    toast(`Something went wrong while saving progress`);
    console.error(
      `Error saving data to localStorage with key "${key}":`,
      error
    );
  }
}

/**
 * Retrieve a value from localStorage by key.
 * @param key - The localStorage key
 * @returns Parsed value or null if not found or parsing fails
 */
export function getLocalStorage<T>(key: string): T | null {
  try {
    const json = localStorage.getItem(key);
    return json ? (JSON.parse(json) as T) : null;
  } catch (error) {
    toast(`Something went wrong while fetching saved progress`);
    console.error(
      `Error reading data from localStorage with key "${key}":`,
      error
    );
    return null;
  }
}

/**
 * Delete a key from localStorage.
 * @param key - The localStorage key
 */
export function deleteLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    toast(`Something went wrong while deleting saved progress`);
    console.error(
      `Error deleting data from localStorage with key "${key}":`,
      error
    );
  }
}
