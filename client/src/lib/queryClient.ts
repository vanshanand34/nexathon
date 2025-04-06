import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Log the request for debugging
  console.log(`API Request: ${method} ${url}`);
  
  // For Replit: Always use relative URLs and ensure they work with Replit's domain structure
  let apiUrl;
  
  if (url.startsWith('http')) {
    // For external URLs
    apiUrl = url;
  } else {
    // For internal API calls, we need to ensure compatibility with Replit's URL structure
    // Force all requests to go to the same origin to avoid CORS issues
    // This is critical for Replit as it uses various domain formats
    const baseUrl = window.location.origin;
    apiUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  
  console.log(`Full API URL: ${apiUrl}`);
  
  try {
    const res = await fetch(apiUrl, {
      method,
      headers: data ? { 
        "Content-Type": "application/json",
        // Add headers to help with CORS and Replit's environment
        "X-Requested-With": "XMLHttpRequest"
      } : {
        "X-Requested-With": "XMLHttpRequest"
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
      // Ensure we include mode for CORS handling
      mode: "cors"
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API Request Error: ${method} ${url}`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Make sure the URL is always relative to the current host
    const url = queryKey[0] as string;
    console.log(`QueryFn: Fetching from ${url}`);
    
    // For Replit: Always use relative URLs and ensure they work with Replit's domain structure
    let apiUrl;
    
    if (url.startsWith('http')) {
      // For external URLs
      apiUrl = url;
    } else {
      // For internal API calls, we need to ensure compatibility with Replit's URL structure
      // Force all requests to go to the same origin to avoid CORS issues
      // This is critical for Replit as it uses various domain formats
      const baseUrl = window.location.origin;
      apiUrl = `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    }
    
    console.log(`QueryFn: Full URL: ${apiUrl}`);
    
    try {
      const res = await fetch(apiUrl, {
        credentials: "include",
        headers: {
          // Add headers to help with CORS and Replit's environment
          "X-Requested-With": "XMLHttpRequest"
        },
        // Ensure we include mode for CORS handling
        mode: "cors"
      });

      console.log(`QueryFn: Response status: ${res.status}`);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      console.log(`QueryFn: Response data:`, data);
      return data;
    } catch (error) {
      console.error(`QueryFn: Error fetching ${url}`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
