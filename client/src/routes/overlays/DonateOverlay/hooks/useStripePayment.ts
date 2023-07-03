import {PlatformPay, useStripe} from '@stripe/stripe-react-native';
import {useCallback} from 'react';

const useStripePayment = () => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const startPayment = useCallback(
    async (paymentIntentClientSecret: string) => {
      let result;

      result = await initPaymentSheet({
        merchantDisplayName: 'Stiftelsen 29k Foundation',
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
        primaryButtonLabel: 'Donate',
      });

      result = await presentPaymentSheet();

      return result;
    },
    [initPaymentSheet, presentPaymentSheet],
  );

  return startPayment;
};

export default useStripePayment;
