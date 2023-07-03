import apiClient from '../../../../lib/apiClient/apiClient';
import {CURRENCY_CODE} from '../../../../lib/i18n';

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

  const {id, clientSecret} = await response.json();

  return {
    id,
    clientSecret,
  };
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

  const {id, clientSecret} = await response.json();

  return {
    id,
    clientSecret,
  };
};
