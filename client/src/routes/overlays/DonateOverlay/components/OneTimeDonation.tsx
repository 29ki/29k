import React, {useCallback, useRef, useState} from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import {TextInput} from 'react-native-gesture-handler';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {ONE_TIME_AMOUNTS} from '../constants/donationAmounts';
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
import {HeartFillIcon} from '../../../../lib/components/Icons';
import {PlatformPay, useStripe} from '@stripe/stripe-react-native';
import apiClient from '../../../../lib/apiClient/apiClient';
import useUser from '../../../../lib/user/hooks/useUser';

const Choices = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
});

const DonateButton = styled(TouchableOpacity)<{active: boolean}>(
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
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
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

  const fetchPaymentSheetParams = useCallback(async () => {
    const response = await apiClient('stripe/paymentIntent/oneTime', {
      method: 'post',
      body: JSON.stringify({
        amount: amount * 100,
        currency: preferedCurrency,
      }),
    });

    const {id, clientSecret} = await response.json();

    return {
      id,
      clientSecret,
    };
  }, [amount]);

  const initializePaymentSheet = useCallback(async () => {
    setLoading(true);
    const {id, clientSecret} = await fetchPaymentSheetParams();

    await initPaymentSheet({
      merchantDisplayName: 'Stiftelsen 29k Foundation',
      paymentIntentClientSecret: clientSecret,
      allowsDelayedPaymentMethods: true,
      applePay: {
        merchantCountryCode: 'SE',
        buttonType: PlatformPay.ButtonType.Donate,
      },
      googlePay: {
        merchantCountryCode: 'SE',
        testEnv: true, // use test environment
      },
      primaryButtonLabel: 'Donate',
    });

    const {error} = await presentPaymentSheet();

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
  }, [
    fetchPaymentSheetParams,
    initPaymentSheet,
    presentPaymentSheet,
    user?.email,
  ]);

  return (
    <>
      <Choices>
        {ONE_TIME_AMOUNTS[preferedCurrency].map(donationAmount => (
          <DonateButton
            onPress={toggleChoice(donationAmount)}
            active={donationAmount === amount}>
            <Body18 numberOfLines={1}>
              <BodyBold>{formatCurrency(donationAmount)}</BodyBold>
            </Body18>
          </DonateButton>
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
        LeftIcon={HeartFillIcon}>
        Donate
      </Button>
    </>
  );
};

export default OneTimeDonation;
