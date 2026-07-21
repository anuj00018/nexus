/**
 * Nexus Input Component
 *
 * Covers text input, textarea, and password variants.
 * Supports label, helper text, error state, and leading/trailing icons.
 */

import * as React from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Base Input ───────────────────────────────────────────────────────
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label displayed above the input */
  label?: string;
  /** Helper text below the input */
  helperText?: string;
  /** Error message — triggers error state */
  error?: string;
  /** Icon at the left side of the input */
  leftIcon?: React.ReactNode;
  /** Icon or element at the right side */
  rightElement?: React.ReactNode;
  /** Container className for wrapping div */
  containerClassName?: string;
  /** Whether to show required asterisk */
  required?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      leftIcon,
      rightElement,
      type = 'text',
      id,
      required,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputId = id ?? React.useId();
    const isPasswordType = type === 'password';
    const resolvedType = isPasswordType && showPassword ? 'text' : type;
    const hasError = Boolean(error);

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-foreground leading-none',
              hasError && 'text-destructive'
            )}
          >
            {label}
            {required && (
              <span className="ml-1 text-destructive" aria-hidden="true">*</span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 flex items-center justify-center text-muted-foreground pointer-events-none">
              {leftIcon}
            </span>
          )}

          {/* Input element */}
          <input
            id={inputId}
            ref={ref}
            type={resolvedType}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            className={cn(
              // Base
              'flex w-full rounded-lg border bg-background',
              'px-3 py-2 text-sm text-foreground',
              'placeholder:text-muted-foreground',
              // Focus
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
              // Transition
              'transition-all duration-150',
              // Disabled
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted',
              // Border states
              hasError
                ? 'border-destructive focus-visible:ring-destructive/30'
                : 'border-input hover:border-foreground/30 focus-visible:border-ring',
              // Icon padding
              leftIcon && 'pl-10',
              (rightElement || isPasswordType) && 'pr-10',
              className
            )}
            {...props}
          />

          {/* Right element — password toggle or custom */}
          {isPasswordType ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          ) : rightElement ? (
            <span className="absolute right-3 flex items-center justify-center text-muted-foreground">
              {rightElement}
            </span>
          ) : null}
        </div>

        {/* Error message */}
        {hasError && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-destructive"
          >
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}

        {/* Helper text */}
        {helperText && !hasError && (
          <p id={`${inputId}-helper`} className="text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ─── Textarea ─────────────────────────────────────────────────────────
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  /** Show character count */
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      helperText,
      error,
      id,
      maxLength,
      showCount,
      value,
      ...props
    },
    ref
  ) => {
    const textareaId = id ?? React.useId();
    const hasError = Boolean(error);
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className={cn('flex flex-col gap-1.5', containerClassName)}>
        {/* Label row */}
        {(label || (showCount && maxLength)) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={textareaId}
                className={cn(
                  'text-sm font-medium text-foreground',
                  hasError && 'text-destructive'
                )}
              >
                {label}
              </label>
            )}
            {showCount && maxLength && (
              <span
                className={cn(
                  'text-xs tabular-nums',
                  charCount > maxLength * 0.9
                    ? 'text-destructive'
                    : 'text-muted-foreground'
                )}
              >
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          maxLength={maxLength}
          value={value}
          aria-invalid={hasError}
          className={cn(
            'flex min-h-[80px] w-full rounded-lg border bg-background',
            'px-3 py-2 text-sm text-foreground resize-none',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-150',
            hasError
              ? 'border-destructive focus-visible:ring-destructive/30'
              : 'border-input hover:border-foreground/30',
            className
          )}
          {...props}
        />

        {hasError && (
          <p role="alert" className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {error}
          </p>
        )}

        {helperText && !hasError && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
