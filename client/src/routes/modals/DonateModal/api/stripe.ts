import apiClient from '../../../../lib/apiClient/apiClient';
import {CURRENCY_CODE} from '../../../../lib/i18n';
import {Payment} from '../types';

export const getOneTimePaymentIntent = async (
  amount: number,
  currency: CURRENCY_CODE,
) => {
  const response = await apiClient(
    'stripe/paymentIntent/oneTime',
    {
      method: 'post',
      body: JSON.stringify({
        amount,
        currency,
      }),
    },
    false,
  );

  const payment = await response.json();

  return payment as Payment;
};

export const getRecurringPaymentIntent = async (
  email: string,
  priceId: string,
) => {
  const response = await apiClient(
    'stripe/paymentIntent/recurring',
    {
      method: 'post',
      body: JSON.stringify({
        email,
        priceId,
      }),
    },
    false,
  );

  const payment = await response.json();

  return payment as Payment;
};
export const sendReceipt = async (paymentIntentId: string, email: string) => {
  const response = await apiClient(
    `stripe/paymentIntent/${paymentIntentId}`,
    {
      method: 'PUT',
      body: JSON.stringify({
        email,
      }),
    },
    false,
  );

  const payment = await response.json();

  return payment as Payment;
};
