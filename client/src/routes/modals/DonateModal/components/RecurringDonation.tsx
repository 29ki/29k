import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import * as yup from 'yup';
import Sentry from '../../../../lib/sentry';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {
  DEV_RECURRING_OPTIONS,
  RECURRING_OPTION,
  RECURRING_OPTIONS,
} from '../constants/donationOptions';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {BottomSheetActionTextInput} from '../../../../lib/components/ActionList/ActionItems/ActionTextInput';
import ActionList from '../../../../lib/components/ActionList/ActionList';
import {
  Body16,
  Body18,
  BodyBold,
} from '../../../../lib/components/Typography/Body/Body';
import {preferedCurrency, formatCurrency} from '../utils/currency';
import {Spacer16, Spacer8} from '../../../../lib/components/Spacers/Spacer';
import Button from '../../../../lib/components/Buttons/Button';
import {EnvelopeIcon} from '../../../../lib/components/Icons';
import useUser from '../../../../lib/user/hooks/useUser';
import {getRecurringPaymentIntent} from '../api/stripe';
import useStripePayment from '../hooks/useStripePayment';
import {last, head} from 'ramda';
import DonationHeart from './DonationHeart';
import {useTranslation} from 'react-i18next';
import {Payment} from '../types';

const OPTIONS = __DEV__ ? DEV_RECURRING_OPTIONS : RECURRING_OPTIONS;

const Choices = styled.View({});

const Error = styled(Body16)({
  color: COLORS.ERROR,
});

const AmountButton = styled(TouchableOpacity)<{active: boolean}>(
  ({active}) => ({
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: COLORS.PURE_WHITE,
    borderWidth: 5,
    borderColor: active ? COLORS.PRIMARY : COLORS.PURE_WHITE,
    overflow: 'hidden',
  }),
);

type RecurringDonationProps = {
  setPayment: (payment: Payment) => void;
};
const RecurringDonation: React.FC<RecurringDonationProps> = ({setPayment}) => {
  const {t} = useTranslation('Modal.Donate');
  const startPayment = useStripePayment();

  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState<RECURRING_OPTION>();
  const [email, setEmail] = useState(user?.email ?? '');
  const [error, setError] = useState<'invalidEmail' | undefined>();

  const toggleChoice = useCallback(
    (newOption: RECURRING_OPTION) => () => {
      setOption(newOption);
    },
    [],
  );

  const onChangeEmail = useCallback((newEmail: string) => {
    setEmail(newEmail);
    setError(undefined);
  }, []);

  const onError = useCallback(
    (err: any) => {
      setLoading(false);
      if (err.code !== 'Canceled') {
        Sentry.captureException(err);
        Alert.alert('Oops!', t('errors.generic'));
      }
    },
    [t],
  );

  const initializePaymentSheet = useCallback(async () => {
    if (email && option) {
      if (!yup.string().email().isValidSync(email)) {
        setError('invalidEmail');
        return;
      }

      setLoading(true);

      let payment, result;
      try {
        payment = await getRecurringPaymentIntent(email, option.id);
        result = await startPayment(payment.clientSecret);
      } catch (err) {
        onError(err);
      }

      if (result?.error) {
        onError(result.error);
        return;
      }

      setLoading(false);

      if (payment) {
        setPayment(payment);
      }
    }
  }, [option, startPayment, email, setPayment, onError]);

  const Heart = useCallback(
    () => (
      <DonationHeart
        minAmount={last(OPTIONS[preferedCurrency])?.amount ?? 0}
        maxAmount={head(OPTIONS[preferedCurrency])?.amount ?? 1}
        amount={option?.amount ?? 0}
      />
    ),
    [option?.amount],
  );

  return (
    <>
      <Choices>
        {OPTIONS[preferedCurrency].map(recurringOption => (
          <AmountButton
            key={recurringOption.id}
            onPress={toggleChoice(recurringOption)}
            active={recurringOption === option}>
            <Body18 numberOfLines={1}>
              <BodyBold>
                {t('monthlyAmount', {
                  amount: formatCurrency(recurringOption.amount),
                })}
              </BodyBold>
            </Body18>
          </AmountButton>
        ))}
      </Choices>
      <ActionList>
        <BottomSheetActionTextInput
          placeholder={t('emailAddress')}
          keyboardType="email-address"
          onChangeText={onChangeEmail}
          defaultValue={email}
          Icon={EnvelopeIcon}
          hasError={error === 'invalidEmail'}
        />
      </ActionList>
      {error && (
        <>
          <Spacer8 />
          <Error>{t(`errors.${error}`)}</Error>
        </>
      )}
      <Spacer16 />
      <Button
        variant="secondary"
        loading={loading}
        disabled={loading || !option || !email}
        onPress={initializePaymentSheet}
        LeftIcon={Heart}>
        {t('donate')}
      </Button>
    </>
  );
};

export default RecurringDonation;
