const API_URL = 'https://nuve-miru.onrender.com';

interface PayResponse {
  url?: string | null;
  message?: string;
  error?: string;
}

export const payOrder = async (orderId: number): Promise<void> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  console.log('Intentando pagar pedido:', orderId);

  const response = await fetch(
    `${API_URL}/orders/${orderId}/pay`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const responseText = await response.text();

  let data: PayResponse | null = null;

  try {
    data = responseText
      ? (JSON.parse(responseText) as PayResponse)
      : null;
  } catch {
    console.error('Respuesta no JSON del backend:', responseText);
  }

  console.log('Respuesta /pay:', {
    status: response.status,
    ok: response.ok,
    data,
  });

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      responseText ||
      `Error HTTP ${response.status}`
    );
  }

  const url = data?.url;

  if (!url) {
    throw new Error('Stripe no ha devuelto una URL de pago');
  }

  window.location.assign(url);
};