import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {useIsFocused} from '@react-navigation/native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../lib/constants/spacings';

import useUser from '../../../lib/user/hooks/useUser';

import {submitReport} from '../../../lib/report/api/report';

import Gutters from '../../../lib/components/Gutters/Gutters';
import {Spacer16, Spacer8} from '../../../lib/components/Spacers/Spacer';
import {
  Heading16,
  ModalHeading,
} from '../../../lib/components/Typography/Heading/Heading';
import Button from '../../../lib/components/Buttons/Button';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {BottomSheetTextInput} from '../../../lib/components/Typography/TextInput/TextInput';
import {Display24} from '../../../lib/components/Typography/Display/Display';

const Container = styled(Gutters)({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  height: 250,
});

const ReportInput = styled(BottomSheetTextInput)({
  borderRadius: SPACINGS.SIXTEEN,
  backgroundColor: COLORS.PURE_WHITE,
  padding: SPACINGS.SIXTEEN,
  fontSize: SPACINGS.SIXTEEN,
  height: 250,
});

const ButtonWrapper = styled.View({
  flexGrow: 0,
  flexDirection: 'row',
  justifyContent: 'center',
});

const ReportModal = () => {
  const {t} = useTranslation('Modal.Report');
  const user = useUser();
  const [text, setText] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [submitted, setSubmitted] = useState<boolean>(false);

  const onSubmit = useCallback(() => {
    if (text?.length) {
      submitReport({text, email});
      setSubmitted(true);
    }
  }, [text, email]);

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        {submitted ? (
          <Container>
            <Display24>{t('confirmationText')}</Display24>
          </Container>
        ) : (
          <Gutters>
            <ModalHeading>{t('title')}</ModalHeading>
            <Spacer16 />

            <>
              <Heading16>{t('reportHeading')}</Heading16>
              <Spacer8 />
              <ReportInput
                placeholder={t('reportPlaceholder')}
                editable
                multiline
                onChangeText={setText}
                textAlignVertical="top"
              />
              <Spacer16 />
              <Heading16>{t('emailHeading')}</Heading16>
              <Spacer8 />
              <BottomSheetTextInput
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                placeholder={t('emailPlaceholder')}
                onChangeText={setEmail}
                defaultValue={user?.email || undefined}
              />
              <Spacer16 />
              <ButtonWrapper>
                <Button
                  variant="secondary"
                  onPress={onSubmit}
                  disabled={!text?.length}>
                  {t('confirmButton')}
                </Button>
              </ButtonWrapper>
            </>
          </Gutters>
        )}
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default ReportModal;
