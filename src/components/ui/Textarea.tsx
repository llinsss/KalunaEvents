import styles from './Input.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
}

export function Textarea({ label, className, ...props }: TextareaProps) {
    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <textarea
                className={`${styles.input} ${className || ''}`}
                style={{ minHeight: '120px', resize: 'vertical' }}
                {...props}
            />
        </div>
    );
}
