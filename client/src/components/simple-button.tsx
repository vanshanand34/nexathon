import React from "react";

export interface ButtonProps {
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  variant = "default",
  size = "default",
  className = "",
  children,
  asChild = false,
  onClick,
  disabled = false,
  type = "button",
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const getVariantClasses = () => {
    switch (variant) {
      case "default":
        return "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700";
      case "outline":
        return "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700";
      case "destructive":
        return "bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700";
      case "secondary":
        return "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600";
      case "ghost":
        return "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800";
      case "link":
        return "bg-transparent text-blue-600 hover:underline dark:text-blue-400";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-3 py-1 text-sm";
      case "lg":
        return "px-6 py-3 text-lg";
      default:
        return "px-4 py-2 text-base";
    }
  };

  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const buttonClasses = `${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`;

  // Instead of using asChild with cloneElement, we'll create a custom wrapper component
  if (asChild && React.isValidElement(children)) {
    // Get the component from children
    const ChildComponent = children.type;
    // Get the props for the child
    const childProps = {
      ...children.props,
      className: `${children.props.className || ''} ${buttonClasses}`,
    };
    
    // Return the child with the additional props
    return <ChildComponent {...childProps}>{children.props.children}</ChildComponent>;
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}