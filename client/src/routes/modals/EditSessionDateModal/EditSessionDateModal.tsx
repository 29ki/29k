import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Alert, View} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import Button from '../../../lib/components/Buttons/Button';
import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';

import {
  ModalStackProps,
  AppStackProps,
} from '../../../lib/navigation/constants/routes';

import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useUser from '../../../lib/user/hooks/useUser';
import useSessions from '../../../lib/sessions/hooks/useSessions';

import {BottomSafeArea, Spacer16} from '../../../lib/components/Spacers/Spacer';

import {COLORS} from '../../../../../shared/src/constants/colors';

import DateTimePicker from '../../../lib/components/DateTimePicker/DateTimePicker';
import {updateSession} from '../../../lib/sessions/api/session';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import {SPACINGS} from '../../../lib/constants/spacings';
import useConfirmSessionReminder from '../../../lib/sessions/hooks/useConfirmSessionReminder';

const SpaceBetweenRow = styled(View)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const DeleteButton = styled(Button)({
  backgroundColor: COLORS.DELETE,
});

const EditSessionDateModal = () => {
  const {
    params: {session: initialSessionData},
  } = useRoute<RouteProp<ModalStackProps, 'EditSessionDateModal'>>();

  const [session, setSession] = useState<LiveSessionType>(initialSessionData);

  const {t} = useTranslation('Modal.Session');
  const user = useUser();
  const {deleteSession, fetchSessions} = useSessions();

  const initialStartTime = dayjs(session.startTime).utc();
  const [sessionDateTime, setSessionDateTime] =
    useState<dayjs.Dayjs>(initialStartTime);

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();

  const exercise = useExerciseById(session?.exerciseId);

  const confirmToggleReminder = useConfirmSessionReminder(session);

  const isHost = user?.uid === session.hostId;

  const onDelete = useCallback(() => {
    Alert.alert(t('delete.header'), t('delete.text'), [
      {text: t('delete.buttons.cancel'), style: 'cancel', onPress: () => {}},
      {
        text: t('delete.buttons.confirm'),
        style: 'destructive',

        onPress: async () => {
          await deleteSession(session.id);
          navigation.popToTop();
        },
      },
    ]);
  }, [t, navigation, deleteSession, session.id]);

  const onUpdateSession = useCallback(async () => {
    const updatedSession = await updateSession(session.id, {
      startTime: sessionDateTime.utc().toISOString(),
    });

    await setSession(updatedSession);
    fetchSessions();
    navigation.goBack();
  }, [setSession, fetchSessions, session.id, sessionDateTime, navigation]);

  const onChange = useCallback(
    (dateTime: dayjs.Dayjs) => setSessionDateTime(dateTime),
    [setSessionDateTime],
  );

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
          <DateTimePicker
            initialDateTime={initialStartTime}
            minimumDate={dayjs()}
            onChange={onChange}
          />
          <Spacer16 />
          <SpaceBetweenRow>
            <Button variant="secondary" onPress={onUpdateSession}>
              {t('done')}
            </Button>
            <DeleteButton small onPress={onDelete}>
              {t('deleteButton')}
            </DeleteButton>
          </SpaceBetweenRow>
        </Gutters>
        <BottomSafeArea minSize={SPACINGS.THIRTYTWO} />
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default EditSessionDateModal;
