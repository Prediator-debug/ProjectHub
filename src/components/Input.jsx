const Input = ({ label, type = 'text', ...props }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>{label}</label>}
      {type === 'textarea' ? (
        <textarea rows={4} {...props} />
      ) : type === 'select' ? (
        <select {...props}>
          {props.children}
        </select>
      ) : (
        <input type={type} {...props} />
      )}
    </div>
  );
};

export default Input;
