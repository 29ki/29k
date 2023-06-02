import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Share, View} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import Button from '../../../lib/components/Buttons/Button';
import Gutters from '../../../lib/components/Gutters/Gutters';

import {ShareIcon} from '../../../lib/components/Icons';
import SheetModal from '../../../lib/components/Modals/SheetModal';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';

import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useUser from '../../../lib/user/hooks/useUser';

import {BottomSafeArea, Spacer16} from '../../../lib/components/Spacers/Spacer';
import {Body16} from '../../../lib/components/Typography/Body/Body';

import {COLORS} from '../../../../../shared/src/constants/colors';

import {SPACINGS} from '../../../lib/constants/spacings';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import useConfirmSessionReminder from '../../../lib/sessions/hooks/useConfirmSessionReminder';
import {getSessionHostingLink} from '../../../lib/sessions/api/session';

const Row = styled(View)({
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const AssignNewHostModal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<ModalStackProps, 'AssignNewHostModal'>>();

  const {t} = useTranslation('Modal.AssignNewHost');
  const user = useUser();

  const exercise = useExerciseById(session?.exerciseId);
  const confirmToggleReminder = useConfirmSessionReminder(session);

  const isHost = user?.uid === session.hostId;

  const onHostChange = useCallback(async () => {
    const link = await getSessionHostingLink(session.id);
    if (link) {
      Share.share({
        message: link,
      });
    }
  }, [session.id]);

  useEffect(() => {
    if (isHost) {
      // Allways try to set / update reminders for hosts
      confirmToggleReminder(true);
    }
  }, [isHost, confirmToggleReminder]);

  if (!session || !exercise) {
    return null;
  }

  return (
    <SheetModal backgroundColor={COLORS.CREAM}>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Spacer16 />
        <Gutters>
          <ModalHeading>{t('editHost.heading')}</ModalHeading>
          <Spacer16 />
          <Body16>{t('editHost.description')}</Body16>
          <Spacer16 />
          <Row>
            <Button
              variant="secondary"
              onPress={onHostChange}
              RightIcon={ShareIcon}>
              {t('editHost.button')}
            </Button>
          </Row>
        </Gutters>
        <BottomSafeArea minSize={SPACINGS.THIRTYTWO} />
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default AssignNewHostModal;
