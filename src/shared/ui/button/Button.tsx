import { forwardRef } from 'react';
import styles from './Button.module.scss';

type ComponentSize = 'xs' | 'sm' | 'md' | 'lg';
type ComponentVariant = 'primary' | 'secondary' | 'danger' | 'success';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ComponentSize;
  variant?: ComponentVariant;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    size = 'md', 
    variant = 'primary',
    loading = false,
    fullWidth = false,
    className = '',
    disabled,
    ...props 
  }, ref) => {
    const buttonClassName = `${styles.button} ${styles[`button--${size}`]} ${styles[`button--${variant}`]} ${
      fullWidth ? styles['button--fullWidth'] : ''
    } ${loading ? styles['button--loading'] : ''} ${className}`;
    
    return (
      <button 
        ref={ref}
        className={buttonClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <div className={styles.spinner} /> : children}
      </button>
    );
  }
);

Button.displayName = 'Button';