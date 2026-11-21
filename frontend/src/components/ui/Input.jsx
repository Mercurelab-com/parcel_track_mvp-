/** Primitive text input with optional error state */
export function Input({ error, className = '', ...props }) {
  return (
    <input
      className={`input-field ${error ? 'input-error' : ''} ${className}`}
      {...props}
    />
  )
}
