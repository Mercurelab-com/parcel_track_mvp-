/** Primitive Button — wraps .btn-primary / .btn-secondary from index.css */
export function Button({ children, variant = 'primary', className = '', ...props }) {
  const cls = variant === 'primary' ? 'btn-primary' : 'btn-secondary'
  return (
    <button className={`${cls} ${className}`} {...props}>
      {children}
    </button>
  )
}
