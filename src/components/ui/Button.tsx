import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'secondary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 cursor-pointer select-none whitespace-nowrap',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          {
            sm: 'text-xs px-3 py-1.5 rounded-lg',
            md: 'text-sm px-4 py-2',
            lg: 'text-base px-6 py-3',
          }[size],
          {
            primary: 'bg-[var(--accent-cyan)] text-[var(--bg-void)] hover:brightness-110 active:scale-95 font-semibold',
            secondary: 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-hover)] active:scale-95',
            ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] active:scale-95',
            danger: 'bg-[var(--accent-coral)] bg-opacity-10 text-[var(--accent-coral)] border border-[var(--accent-coral)] border-opacity-20 hover:bg-opacity-20 active:scale-95',
            outline: 'border border-[var(--border-accent)] text-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)] hover:bg-opacity-10 active:scale-95',
          }[variant],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
