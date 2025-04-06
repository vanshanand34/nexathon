import React, { createContext, useState, useContext, useCallback } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

type ToastVariant = 'default' | 'success' | 'error' | 'info';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toast: (props: { title: string; description?: string; variant?: ToastVariant }) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, description, variant = 'default' }: { 
    title: string; 
    description?: string; 
    variant?: ToastVariant 
  }) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, title, description, variant }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);

    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismissToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`p-4 rounded-lg shadow-lg flex items-start max-w-sm w-full transform transition-all duration-300 
              ${toast.variant === 'success' ? 'bg-green-50 border border-green-100' : 
                toast.variant === 'error' ? 'bg-red-50 border border-red-100' : 
                toast.variant === 'info' ? 'bg-blue-50 border border-blue-100' : 
                'bg-white border border-gray-200'}`}
            style={{ opacity: 1, transform: 'translateX(0)' }}
          >
            <div className="flex-shrink-0 mr-3">
              {toast.variant === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : toast.variant === 'error' ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : toast.variant === 'info' ? (
                <Info className="h-5 w-5 text-blue-500" />
              ) : null}
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-medium
                ${toast.variant === 'success' ? 'text-green-800' : 
                  toast.variant === 'error' ? 'text-red-800' :
                  toast.variant === 'info' ? 'text-blue-800' :  
                  'text-gray-900'}`}>
                {toast.title}
              </h3>
              {toast.description && (
                <p className={`mt-1 text-sm
                  ${toast.variant === 'success' ? 'text-green-700' : 
                    toast.variant === 'error' ? 'text-red-700' :
                    toast.variant === 'info' ? 'text-blue-700' :  
                    'text-gray-700'}`}>
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className={`ml-4 text-sm flex-shrink-0
                ${toast.variant === 'success' ? 'text-green-500 hover:text-green-700' : 
                  toast.variant === 'error' ? 'text-red-500 hover:text-red-700' :
                  toast.variant === 'info' ? 'text-blue-500 hover:text-blue-700' :  
                  'text-gray-500 hover:text-gray-700'}`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}