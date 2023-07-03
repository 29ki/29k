import React, {useCallback, useRef, useState} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import {TextInput} from 'react-native-gesture-handler';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {ONE_TIME_AMOUNTS} from '../constants/donationOptions';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {BottomSheetActionTextInput} from '../../../../lib/components/ActionList/ActionItems/ActionTextInput';
import ActionList from '../../../../lib/components/ActionList/ActionList';
import {
  Body18,
  BodyBold,
} from '../../../../lib/components/Typography/Body/Body';
import {
  preferedCurrency,
  formatCurrency,
  getCurrencySymbol,
} from '../utils/currency';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import Button from '../../../../lib/components/Buttons/Button';
import {getOneTimePaymentIntent} from '../api/stripe';
import useStripePayment from '../hooks/useStripePayment';
import DonationHeart from './DonationHeart';
import {head, last} from 'ramda';
import {Payment} from '../types';
import Sentry from '../../../../lib/sentry';
import {useTranslation} from 'react-i18next';

const Choices = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
});

const AmountButton = styled(TouchableOpacity)<{active: boolean}>(
  ({active}) => ({
    width: '32%',
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

const CurrencySymbol = () => (
  <Body18 numberOfLines={1}>
    <BodyBold>{getCurrencySymbol()}</BodyBold>
  </Body18>
);

type OneTimeDonationProps = {
  setPayment: (payment: Payment) => void;
};
const OneTimeDonation: React.FC<OneTimeDonationProps> = ({setPayment}) => {
  const {t} = useTranslation('Modal.Donate');

  const textRef = useRef<TextInput>(null);
  const startPayment = useStripePayment();

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  const toggleChoice = useCallback(
    (newAmount: number) => () => {
      textRef.current?.blur();
      textRef.current?.clear();
      setAmount(newAmount);
    },
    [],
  );

  const onCustomAmountChange = useCallback((value: string) => {
    setAmount(parseInt(value, 10));
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
    setLoading(true);

    let payment, result;
    try {
      payment = await getOneTimePaymentIntent(amount * 100, preferedCurrency);
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
  }, [amount, startPayment, setPayment, onError]);

  const Heart = useCallback(
    () => (
      <DonationHeart
        minAmount={last(ONE_TIME_AMOUNTS[preferedCurrency]) ?? 0}
        maxAmount={head(ONE_TIME_AMOUNTS[preferedCurrency]) ?? 1}
        amount={amount ?? 0}
      />
    ),
    [amount],
  );

  return (
    <>
      <Choices>
        {ONE_TIME_AMOUNTS[preferedCurrency].map((donationAmount, i) => (
          <AmountButton
            key={i}
            onPress={toggleChoice(donationAmount)}
            active={donationAmount === amount}>
            <Body18 numberOfLines={1}>
              <BodyBold>{formatCurrency(donationAmount)}</BodyBold>
            </Body18>
          </AmountButton>
        ))}
      </Choices>
      <ActionList>
        <BottomSheetActionTextInput
          placeholder={t('customAmount')}
          keyboardType="number-pad"
          onChangeText={onCustomAmountChange}
          Icon={CurrencySymbol}
          ref={textRef}
        />
      </ActionList>
      <Spacer16 />
      <Button
        variant="secondary"
        loading={loading}
        disabled={loading || !amount}
        onPress={initializePaymentSheet}
        LeftIcon={Heart}>
        {t('donate')}
      </Button>
    </>
  );
};

export default OneTimeDonation;
