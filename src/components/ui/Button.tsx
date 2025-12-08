import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    block?: boolean;
}

export function Button({ variant = 'primary', block, className, ...props }: ButtonProps) {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${block ? styles.block : ''} ${className || ''}`}
            {...props}
        />
    );
}
