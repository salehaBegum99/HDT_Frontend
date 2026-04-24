import React, { forwardRef } from 'react';
import './Input.css';

const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  id,
  ...rest
}, ref) => {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required" aria-hidden="true"> *</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`input-field ${error ? 'input-field--error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...rest}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="input-hint">{hint}</p>
      )}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="input-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
