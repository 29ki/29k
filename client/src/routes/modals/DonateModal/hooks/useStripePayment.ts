import {PlatformPay, useStripe} from '@stripe/stripe-react-native';
import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';

const useStripePayment = () => {
  const {t} = useTranslation('Modal.Donate');

  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const startPayment = useCallback(
    async (paymentIntentClientSecret: string) => {
      let result;

      result = await initPaymentSheet({
        merchantDisplayName: t('merchantDisplayName'),
        paymentIntentClientSecret,
        allowsDelayedPaymentMethods: true,
        applePay: {
          merchantCountryCode: 'SE',
          buttonType: PlatformPay.ButtonType.Donate,
        },
        googlePay: {
          merchantCountryCode: 'SE',
          testEnv: __DEV__,
        },
        primaryButtonLabel: t('donate'),
      });

      if (result.error) {
        return result;
      }

      result = await presentPaymentSheet();

      return result;
    },
    [initPaymentSheet, presentPaymentSheet, t],
  );

  return startPayment;
};

export default useStripePayment;
