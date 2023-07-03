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
import apiClient from '../../../../lib/apiClient/apiClient';
import useUser from '../../../../lib/user/hooks/useUser';
import {getOneTimePaymentIntent} from '../api/stripe';
import useStripePayment from '../hooks/useStripePayment';
import DonationHeart from './DonationHeart';
import {head, last} from 'ramda';

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

const OneTimeDonation = () => {
  const textRef = useRef<TextInput>(null);
  const startPayment = useStripePayment();

  const user = useUser();
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

  const initializePaymentSheet = useCallback(async () => {
    setLoading(true);
    const {id, clientSecret} = await getOneTimePaymentIntent(
      amount * 100,
      preferedCurrency,
    );

    const {error} = await startPayment(clientSecret);

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.prompt(
        'Thank you for your donation!',
        'Would you like to receive a receipt?',
        [
          {
            text: 'Yes',
            style: 'default',
            onPress: async email => {
              await apiClient(`stripe/paymentIntent/${id}`, {
                method: 'put',
                body: JSON.stringify({
                  email,
                }),
              });
            },
          },
          {
            text: 'No',
            style: 'cancel',
          },
        ],
        'plain-text',
        user?.email ?? undefined,
      );
    }
    setLoading(false);
  }, [amount, startPayment, user?.email]);

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
          placeholder="Custom Amount"
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
        Donate
      </Button>
    </>
  );
};

export default OneTimeDonation;
