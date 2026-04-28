import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Prefix asset path with Vite's BASE_URL so it resolves correctly under
// subpath deployments (e.g. GitHub Pages at /-mk/). Accepts paths with or
// without a leading slash.
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL // "/" in dev, "/-mk/" on Pages
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${base}${clean}`
}
