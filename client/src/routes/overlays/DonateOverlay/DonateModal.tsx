import React, {useState} from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {BottomSafeArea, Spacer8} from '../../../lib/components/Spacers/Spacer';
import Gutters from '../../../lib/components/Gutters/Gutters';
import Button from '../../../lib/components/Buttons/Button';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import OneTimeDonation from './components/OneTimeDonation';

const Types = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

export const DonateModal = () => {
  const {goBack} = useNavigation();
  const [type, setType] = useState<'one-time' | 'recurring'>('one-time');

  return (
    <SheetModal onPressClose={goBack}>
      {/*
      <Message>
        <BottomSheetScrollView>
          <Gutters>
            <Markdown>
              {`Hi Sanna,
We hope you’re enjoying our app and finding it helpful. We have an awkward request to make, but it’s an important one. You see, we’re a non-profit organisation called the 29k Foundation, and we rely on donations to keep this app alive and thriving.

> Here’s the thing: **people like you already donate to ensure that the 29k app remains free for everyone**. We’re incredibly grateful for this kind of support, and it’s because of our users generosity that we can continue providing this valuable resource to as many people as possible.
>
> We know that money can be a sensitive topic, and we completely understand if you’re unable to contribute at the moment. But if you’re able to **spare a minute to consider making a donation**, it would make a tremendous difference in sustaining our existence and improving the app even further.

And hey, if you know someone who might be willing and able to support us with a donation, we’d greatly appreciate it if you could recommend our app to them.
Thank you for being a part of our community, and for your understanding as we ask for your support.

Best regards,
*Maria Modigh - co-CEO of the 29k Foundation*`}
            </Markdown>
            <Spacer32 />
          </Gutters>
        </BottomSheetScrollView>
        <BottomGradient />
      </Message>
       */}
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
          <Spacer8 />
          {type === 'one-time' && <OneTimeDonation />}
        </Gutters>
        <BottomSafeArea minSize={16} />
      </KeyboardAvoidingView>
    </SheetModal>
  );
};

export default DonateModal;
