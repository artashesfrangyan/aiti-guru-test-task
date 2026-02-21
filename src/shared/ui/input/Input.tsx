import { forwardRef } from 'react';
import styles from './Input.module.scss';

type ComponentSize = 'xs' | 'sm' | 'md' | 'lg';
type ComponentVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  size?: ComponentSize;
  variant?: ComponentVariant;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    icon, 
    action, 
    size = 'md', 
    variant = 'primary',
    className = '',
    ...props 
  }, ref) => {
    const inputClassName = `${styles.input} ${styles[`input--${size}`]} ${styles[`input--${variant}`]} ${className}`;
    
    return (
      <div className={styles.field}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.wrapper}>
          {icon && <div className={styles.icon}>{icon}</div>}
          <input 
            ref={ref} 
            className={inputClassName} 
            {...props} 
          />
          {action && <div className={styles.action}>{action}</div>}
        </div>
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
