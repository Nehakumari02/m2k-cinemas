/**
 * Open Razorpay checkout and verify payment on the server.
 * Returns true if payment succeeded, false otherwise.
 */
export async function launchRazorpayPayment({
  amount,
  description = 'M2K Cinemas payment',
  user,
  setAlert,
}) {
  const notify = (msg, type, timeout = 5000) => {
    if (setAlert) setAlert(msg, type, timeout);
  };

  const token = localStorage.getItem('jwtToken');
  if (!token) {
    notify('Please log in to continue payment', 'error');
    return { ok: false };
  }

  const loadScript = () =>
    new Promise(resolve => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const sdkLoaded = await loadScript();
  if (!sdkLoaded) {
    notify('Unable to load payment gateway', 'error');
    return { ok: false };
  }

  const configResponse = await fetch('/payments/config', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const configData = await configResponse.json();
  if (!configResponse.ok || !configData.keyId) {
    notify(
      configData.error || 'Online payment is not configured. Use wallet or contact support.',
      'error',
      6000
    );
    return { ok: false };
  }

  const orderResponse = await fetch('/payments/create-order', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount }),
  });
  const orderData = await orderResponse.json();
  if (!orderResponse.ok || !orderData.order) {
    notify(orderData.error || 'Could not start payment', 'error');
    return { ok: false };
  }

  return new Promise(resolve => {
    const options = {
      key: configData.keyId,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: 'M2K Cinemas',
      description,
      order_id: orderData.order.id,
      handler: async response => {
        const verifyResponse = await fetch('/payments/verify', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(response),
        });
        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok || !verifyData.verified) {
          notify(verifyData.error || 'Payment verification failed', 'error');
          return resolve({ ok: false });
        }
        return resolve({ ok: true, razorpay: response });
      },
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: { color: '#b72429' },
      modal: { ondismiss: () => resolve({ ok: false, razorpay: null }) },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  });
}
