const Button = ({ children, variant = 'primary', style, ...props }) => {
  const baseStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    ...style
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: '#fff',
    },
    secondary: {
      backgroundColor: 'var(--surface-hover)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)'
    },
    success: {
      backgroundColor: 'var(--success)',
      color: '#fff',
    },
    danger: {
      backgroundColor: 'var(--danger)',
      color: '#fff',
    }
  };

  return (
    <button style={{ ...baseStyle, ...variants[variant] }} {...props}>
      {children}
    </button>
  );
};

export default Button;
