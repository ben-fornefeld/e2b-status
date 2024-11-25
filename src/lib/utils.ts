import { type ClassValue, clsx } from "clsx";
import { customAlphabet } from "nanoid";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEqual(value1: any, value2: any): boolean {
  // handle null/undefined cases
  if (value1 === value2) return true;
  if (value1 === null || value2 === null) return false;
  if (value1 === undefined || value2 === undefined) return false;

  // handle different types
  if (typeof value1 !== typeof value2) return false;

  // handle arrays
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false;
    return value1.every((item, index) => isEqual(item, value2[index]));
  }

  // handle objects
  if (typeof value1 === "object") {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) return false;
    return keys1.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(value2, key) &&
        isEqual(value1[key], value2[key]),
    );
  }

  // handle primitives
  return value1 === value2;
}

export const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  10,
);
