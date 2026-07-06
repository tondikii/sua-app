import type { ReactNode } from 'react';
import { C, FONT } from '../colors';

type FormFieldProps = {
  label: string;
  required?: boolean;
  optional?: boolean;
  focused?: boolean;
  children: ReactNode;
  hint?: string;
};

/** Label + wrapper konsisten — selaras Screen18EditProfil & Screen13 */
export function FormField({ label, required, optional, focused, children, hint }: FormFieldProps) {
  return (
    <div style={{ fontFamily: FONT }}>
      <label style={{ fontSize: 13, fontWeight: 700, color: C.charcoal, display: 'block', marginBottom: 8 }}>
        {label}
        {required && <span style={{ color: C.coral }}> *</span>}
        {optional && (
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, marginLeft: 4 }}>(opsional)</span>
        )}
      </label>
      <div
        style={
          focused
            ? {
                borderRadius: 14,
                boxShadow: `0 0 0 3px ${C.coralLight}`,
              }
            : undefined
        }
      >
        {children}
      </div>
      {hint && (
        <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0', fontWeight: 500, lineHeight: 1.45 }}>{hint}</p>
      )}
    </div>
  );
}

type FormInputBoxProps = {
  value?: string;
  placeholder?: string;
  focused?: boolean;
  leftIcon?: ReactNode;
  multiline?: boolean;
};

export function FormInputBox({ value, placeholder, focused = Boolean(value), leftIcon, multiline }: FormInputBoxProps) {
  const filled = Boolean(value);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: multiline ? 'flex-start' : 'center',
        gap: 10,
        backgroundColor: C.light,
        borderRadius: 14,
        padding: '13px 16px',
        border: focused || filled ? `1.5px solid ${C.coral}` : `1.5px solid ${C.border}`,
        minHeight: multiline ? 88 : undefined,
      }}
    >
      {leftIcon && (
        <span style={{ flexShrink: 0, display: 'flex', marginTop: multiline ? 2 : 0 }}>{leftIcon}</span>
      )}
      <span
        style={{
          fontSize: filled ? 15 : 14,
          color: filled ? C.charcoal : C.mutedLight,
          fontWeight: filled ? 500 : 400,
          flex: 1,
          minWidth: 0,
          lineHeight: multiline ? 1.6 : 1.35,
          overflow: multiline ? undefined : 'hidden',
          textOverflow: multiline ? undefined : 'ellipsis',
          whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
        }}
      >
        {value || placeholder}
      </span>
    </div>
  );
}
