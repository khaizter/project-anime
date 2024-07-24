import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { FilterType } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
