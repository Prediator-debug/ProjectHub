export const initiatePayment = ({ project, amount, onSuccess, onDismiss }) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_PLACEHOLDER',
    amount: amount * 100, // paise
    currency: 'INR',
    name: 'ProBuild',
    description: `Advance Payment — ${project.domain} Project`,
    handler: function (response) {
      onSuccess(response);
    },
    prefill: {
      name: project.name,
      email: project.email,
    },
    theme: { color: '#6366f1' },
    modal: {
      ondismiss: () => onDismiss?.(),
      escape: true,
      backdropclose: false,
    },
  };

  if (window.Razorpay) {
    const rzp = new window.Razorpay(options);
    // Handle payment failure — also reset button
    rzp.on('payment.failed', () => onDismiss?.());
    rzp.open();
  } else {
    // Mock payment when Razorpay not loaded (development)
    if (window.confirm(`[MOCK] Pay ₹${amount} for ${project.domain} project? (Razorpay not loaded)`)) {
      onSuccess({ razorpay_payment_id: 'mock_' + Date.now() });
    } else {
      onDismiss?.();
    }
  }
};
