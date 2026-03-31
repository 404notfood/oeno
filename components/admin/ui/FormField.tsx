"use client";

import { forwardRef } from "react";

// Base props for all field types
interface BaseFieldProps {
  label: string;
  name: string;
  error?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

// Input field
interface InputFieldProps
  extends BaseFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date" | "time" | "datetime-local";
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      name,
      error,
      description,
      required,
      disabled,
      className = "",
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-1 ${className}`}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gris-dark"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
        {description && (
          <p className="text-xs text-gris-tech">{description}</p>
        )}
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          disabled={disabled}
          className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-bordeaux/20 ${
            error
              ? "border-danger focus:border-danger"
              : "border-beige-dark focus:border-bordeaux"
          } ${disabled ? "bg-beige cursor-not-allowed" : "bg-white"}`}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
InputField.displayName = "InputField";

// Textarea field
interface TextareaFieldProps
  extends BaseFieldProps,
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  (
    {
      label,
      name,
      error,
      description,
      required,
      disabled,
      className = "",
      rows = 3,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-1 ${className}`}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gris-dark"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
        {description && (
          <p className="text-xs text-gris-tech">{description}</p>
        )}
        <textarea
          ref={ref}
          id={name}
          name={name}
          rows={rows}
          disabled={disabled}
          className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-bordeaux/20 resize-none ${
            error
              ? "border-danger focus:border-danger"
              : "border-beige-dark focus:border-bordeaux"
          } ${disabled ? "bg-beige cursor-not-allowed" : "bg-white"}`}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
TextareaField.displayName = "TextareaField";

// Select field
interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends BaseFieldProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "name"> {
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    {
      label,
      name,
      error,
      description,
      required,
      disabled,
      className = "",
      options,
      placeholder = "Selectionner...",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-1 ${className}`}>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gris-dark"
        >
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
        {description && (
          <p className="text-xs text-gris-tech">{description}</p>
        )}
        <select
          ref={ref}
          id={name}
          name={name}
          disabled={disabled}
          className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-bordeaux/20 ${
            error
              ? "border-danger focus:border-danger"
              : "border-beige-dark focus:border-bordeaux"
          } ${disabled ? "bg-beige cursor-not-allowed" : "bg-white"}`}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

// Checkbox field
interface CheckboxFieldProps
  extends BaseFieldProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type"> {}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  (
    { label, name, error, description, required, disabled, className = "", ...props },
    ref
  ) => {
    return (
      <div className={`space-y-1 ${className}`}>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            id={name}
            name={name}
            disabled={disabled}
            className="h-4 w-4 rounded border-beige-dark text-bordeaux focus:ring-bordeaux focus:ring-offset-0"
            {...props}
          />
          <span className="text-sm font-medium text-gris-dark">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </span>
        </label>
        {description && (
          <p className="text-xs text-gris-tech ml-7">{description}</p>
        )}
        {error && <p className="text-xs text-danger ml-7">{error}</p>}
      </div>
    );
  }
);
CheckboxField.displayName = "CheckboxField";

// Switch/Toggle field
type SwitchFieldProps = Omit<CheckboxFieldProps, "type">;

export const SwitchField = forwardRef<HTMLInputElement, SwitchFieldProps>(
  (
    { label, name, error, description, required, disabled, className = "", ...props },
    ref
  ) => {
    return (
      <div className={`space-y-1 ${className}`}>
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-gris-dark">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </span>
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={name}
              name={name}
              disabled={disabled}
              className="sr-only peer"
              {...props}
            />
            <div className="w-11 h-6 bg-beige-dark rounded-full peer peer-checked:bg-bordeaux transition-colors"></div>
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform"></div>
          </div>
        </label>
        {description && (
          <p className="text-xs text-gris-tech">{description}</p>
        )}
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    );
  }
);
SwitchField.displayName = "SwitchField";
