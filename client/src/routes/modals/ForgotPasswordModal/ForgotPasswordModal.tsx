import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import {BottomSheetActionTextInput} from '../../../lib/components/ActionList/ActionItems/ActionTextInput';
import ActionList from '../../../lib/components/ActionList/ActionList';
import Button from '../../../lib/components/Buttons/Button';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer32,
} from '../../../lib/components/Spacers/Spacer';
import {
  Heading16,
  ModalHeading,
} from '../../../lib/components/Typography/Heading/Heading';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import {COLORS} from '../../../../../shared/src/constants/colors';
import useResetPassword from '../../../lib/user/hooks/useResetPassword';

const StyledButton = styled(Button)({
  alignSelf: 'flex-start',
});

const Error = styled(Body16)({
  color: COLORS.ERROR,
});

const ForgotPasswordModal = () => {
  const {t} = useTranslation('Modal.ForgotPassword');
  const {goBack} = useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const resetPassword = useResetPassword();

  const [isResetting, setIsResetting] = useState(false);
  const [email, setEmail] = useState('');
  const [showResetSent, setResetSent] = useState(false);
  const [error, setError] = useState('');

  const sendResetEmail = useCallback(async () => {
    setIsResetting(true);
    const errorCode = await resetPassword(email);
    if (errorCode) {
      setError(errorCode);
    } else {
      setError('');
      setResetSent(true);
    }
    setIsResetting(false);
  }, [resetPassword, email]);

  return (
    <SheetModal>
      <Gutters>
        <ModalHeading>{t('resetTitle')}</ModalHeading>
        <Spacer24 />
        {showResetSent ? (
          <>
            <Heading16>{t('checkEmailHeader')}</Heading16>
            <Spacer16 />
            <Body16>{t('emailSentInfo')}</Body16>
            <Spacer32 />

            <StyledButton variant="primary" onPress={goBack}>
              {t('confirmSent')}
            </StyledButton>
          </>
        ) : (
          <>
            <ActionList>
              <BottomSheetActionTextInput
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                onSubmitEditing={sendResetEmail}
                placeholder={t('email')}
                onChangeText={setEmail}
                defaultValue={email}
              />
            </ActionList>
            <Spacer16 />
            {error && (
              <>
                <Error>{t(`resetErrors.${error}`)}</Error>
                <Spacer16 />
              </>
            )}
            <StyledButton
              variant="primary"
              disabled={!email}
              loading={isResetting}
              onPress={sendResetEmail}>
              {t('sendToEmail')}
            </StyledButton>
          </>
        )}
      </Gutters>
    </SheetModal>
  );
};

export default ForgotPasswordModal;
