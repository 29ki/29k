import {initStripe} from '@stripe/stripe-react-native';
import {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_APPLE_MERCHANT_IDENTIFIER,
  DEEP_LINK_SCHEME,
} from 'config';

export const init = async () => {
  if (STRIPE_PUBLISHABLE_KEY) {
    await initStripe({
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: STRIPE_APPLE_MERCHANT_IDENTIFIER,
      urlScheme: DEEP_LINK_SCHEME,
    });
  }
};
