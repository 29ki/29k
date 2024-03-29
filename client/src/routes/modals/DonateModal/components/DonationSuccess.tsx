import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import * as yup from 'yup';

import VideoLooper, {
  VideoLooperProperties,
} from '../../../../lib/components/VideoLooper/VideoLooper';
import {BottomGradient} from '../../Contributors/components/BottomGradient';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {Display36} from '../../../../lib/components/Typography/Display/Display';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {BottomSheetTextInput} from '../../../../lib/components/Typography/TextInput/TextInput';
import {
  BottomSafeArea,
  Spacer16,
  Spacer24,
  Spacer8,
} from '../../../../lib/components/Spacers/Spacer';
import Button from '../../../../lib/components/Buttons/Button';
import {CheckIcon, EnvelopeIcon} from '../../../../lib/components/Icons';
import useUser from '../../../../lib/user/hooks/useUser';
import {Body16, Body18} from '../../../../lib/components/Typography/Body/Body';
import {useTranslation} from 'react-i18next';
import {sendReceipt} from '../api/stripe';
import {Payment} from '../types';

const Gratitude = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const ThankYou = styled(Display36)({
  textAlign: 'center',
});

const Receipt = styled(Gutters)({
  backgroundColor: COLORS.WHITE,
  alignItems: 'center',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const StyledTextInput = styled(BottomSheetTextInput)({
  flex: 1,
});

const Error = styled(Body16)({
  color: COLORS.ERROR,
});

const BackgroundVideo = styled(VideoLooper).attrs({
  repeat: true,
  muted: true,
  paused: false,
  sources: [
    {
      source: 'clouds.mp4',
      repeat: true,
    },
  ],
  // Fixes issue with types not being passed down properly from .attrs
})<Optional<VideoLooperProperties, 'sources'>>({
  ...StyleSheet.absoluteFillObject,
});

type DonationSuccessProps = {
  payment: Payment;
  setPayment: (payment: Payment) => void;
};
const DoantionSuccess: React.FC<DonationSuccessProps> = ({
  payment,
  setPayment,
}) => {
  const {t} = useTranslation('Modal.Donate');
  const user = useUser();
  const [email, setEmail] = useState(user?.email ?? '');
  const [error, setError] = useState<'invalidEmail' | undefined>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onChangeEmail = useCallback((newEmail: string) => {
    setEmail(newEmail);
    setSent(false);
    setError(undefined);
  }, []);

  const onSendReceipt = useCallback(async () => {
    if (!yup.string().email().isValidSync(email)) {
      setError('invalidEmail');
      return;
    }

    setLoading(true);

    setPayment(await sendReceipt(payment.id, email));

    setSent(true);
    setLoading(false);
    setEmail('');
  }, [email, payment, setPayment]);

  return (
    <>
      <BackgroundVideo />
      <Gratitude>
        <BottomGradient />
        <Gutters big>
          <ThankYou>{t('thankYou')}</ThankYou>
        </Gutters>
      </Gratitude>
      <Receipt>
        {payment.receiptEmail ? (
          <>
            <Body18>{t('receiptSentTo', {email: payment.receiptEmail})}</Body18>
            <Spacer24 />
          </>
        ) : (
          <>
            <Row>
              <StyledTextInput
                placeholder={t('emailAddress')}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                onChangeText={onChangeEmail}
                defaultValue={email}
                hasError={error === 'invalidEmail'}
              />
              <Spacer8 />
              <Button
                variant="secondary"
                LeftIcon={sent ? CheckIcon : EnvelopeIcon}
                onPress={onSendReceipt}
                disabled={!email}
                loading={loading}>
                {t('sendReceipt')}
              </Button>
            </Row>
            {error && (
              <>
                <Spacer8 />
                <Error>{t(`errors.${error}`)}</Error>
              </>
            )}
            <Spacer16 />
          </>
        )}
        <BottomSafeArea />
      </Receipt>
    </>
  );
};

export default DoantionSuccess;
