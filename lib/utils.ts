import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string, ...args: string[]): string {
  if (!text) throw new Error("text is required to slugify");

  // Combine text and additional args into one string
  const fullText = [text, ...args].join(" ");

  return fullText
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export function capitalizeFirstLetter(string: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}
