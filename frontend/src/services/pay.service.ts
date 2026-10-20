const API_URL = 'https://nuve-miru.onrender.com';

export const payOrder = async (orderId: number): Promise<void> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  const response = await fetch(
    `${API_URL}/orders/${orderId}/pay`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.message || 'Error al iniciar el pago con Stripe'
    );
  }

  const data: { url: string | null } = await response.json();

  if (!data.url) {
    throw new Error('Stripe no ha devuelto una URL de pago');
  }

  // Redirige al checkout alojado por Stripe.
  window.location.assign(data.url);
};
