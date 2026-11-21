/** Primitive select */
export function Select({ error, className = '', children, ...props }) {
  return (
    <select
      className={`input-field ${error ? 'input-error' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}
