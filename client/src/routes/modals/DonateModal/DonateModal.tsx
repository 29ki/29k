import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {
  BottomSafeArea,
  Spacer16,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Button from '../../../lib/components/Buttons/Button';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import OneTimeDonation from './components/OneTimeDonation';
import RecurringDonation from './components/RecurringDonation';
import DoantionSuccess from './components/DonationSuccess';
import {Payment} from './types';

const Types = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

export const DonateModal = () => {
  const {goBack} = useNavigation();
  const [type, setType] = useState<'one-time' | 'recurring'>('one-time');
  const [payment, setPayment] = useState<Payment>();

  if (payment) {
    return (
      <SheetModal onPressClose={goBack}>
        <DoantionSuccess payment={payment} setPayment={setPayment} />
      </SheetModal>
    );
  }

  return (
    <SheetModal onPressClose={goBack}>
      <KeyboardAvoidingView
        behavior={Platform.select({ios: 'padding', android: undefined})}>
        <Gutters>
          <Spacer8 />
          <Types>
            <Button
              variant={type === 'one-time' ? 'primary' : 'tertiary'}
              small
              onPress={() => setType('one-time')}>
              One time
            </Button>
            <Spacer8 />
            <Button
              variant={type === 'recurring' ? 'primary' : 'tertiary'}
              small
              onPress={() => setType('recurring')}>
              Monthly
            </Button>
          </Types>
          <Spacer16 />
          {type === 'one-time' && <OneTimeDonation setPayment={setPayment} />}
          {type === 'recurring' && (
            <RecurringDonation setPayment={setPayment} />
          )}
        </Gutters>
        <BottomSafeArea minSize={16} />
      </KeyboardAvoidingView>
    </SheetModal>
  );
};

export default DonateModal;
