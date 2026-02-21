import { forwardRef } from 'react';
import styles from './Checkbox.module.scss';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, indeterminate = false, className = '', ...props }, ref) => {
    return (
      <label className={`${styles.checkboxLabel} ${className}`}>
        <input
          ref={ref}
          type="checkbox"
          className={styles.checkboxInput}
          {...props}
        />
        <span className={`${styles.checkboxBox} ${indeterminate ? styles.indeterminate : ''}`} />
        {label && <span className={styles.label}>{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
