import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This is a client-side wrapper for the server-side ask_secrets function
// It's declared here as it's not in the types but provided by the Replit environment
export async function ask_secrets(secretKeys: string[], userMessage: string): Promise<void> {
  try {
    if (typeof window !== 'undefined' && (window as any).ask_secrets) {
      await (window as any).ask_secrets(secretKeys, userMessage);
    } else {
      console.error('ask_secrets function not available in this environment');
      throw new Error('ask_secrets function not available');
    }
  } catch (error) {
    console.error('Error asking for secrets:', error);
    throw error;
  }
}
