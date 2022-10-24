import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
import Gutters from '../../../common/components/Gutters/Gutters';
import IconButton from '../../../common/components/Buttons/IconButton/IconButton';
import {BellIcon, DeleteIcon, PlusIcon} from '../../../common/components/Icons';
import Image from '../../../common/components/Image/Image';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer16, Spacer8} from '../../../common/components/Spacers/Spacer';
import {Display24} from '../../../common/components/Typography/Display/Display';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {RootStackProps} from '../../../common/constants/routes';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';
import {userAtom} from '../../../lib/user/state/state';
import useAddToCalendar from '../hooks/useAddToCalendar';
import useSessionNotificationReminder from '../hooks/useSessionNotificationReminder';
import useSessions from '../hooks/useSessions';

const Content = styled(Gutters)({
  flexDirection: 'row',
  justifyContent: 'space-between',
});
const BottomContent = styled(Gutters)({
  alignItems: 'center',
  flexDirection: 'row',
});

const ImageContainer = styled.View({
  flex: 1,
  height: 80,
});

const DeleteButton = styled(IconButton)({
  backgroundColor: COLORS.DELETE,
});

const Title = styled(Display24)({
  flex: 2,
});

const SessionModal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<RootStackProps, 'SessionModal'>>();
  const {t} = useTranslation(NS.COMPONENT.SESSION_MODAL);
  const user = useRecoilValue(userAtom);
  const navigation = useNavigation();
  const {deleteSession} = useSessions();
  const addToCalendar = useAddToCalendar();
  const exercise = useExerciseById(session?.contentId);
  const {reminderEnabled, toggleReminder} =
    useSessionNotificationReminder(session);

  const startTime = dayjs(session.startTime);
  const startingNow = dayjs().isAfter(startTime.subtract(10, 'minutes'));
  if (!session || !exercise) {
    return null;
  }

  const onPress = () =>
    startingNow
      ? navigation.navigate(
          'SessionStack',
          {
            screen: 'ChangingRoom',
            params: {
              sessionId: session.id,
            },
          },
          navigation.goBack(),
        )
      : addToCalendar(exercise.name, startTime, startTime.add(30, 'minutes'));

  const onDelete = () => {
    Alert.alert(t('delete.header'), t('delete.text'), [
      {text: t('delete.buttons.cancel'), style: 'cancel', onPress: () => {}},
      {
        text: t('delete.buttons.confirm'),
        style: 'destructive',

        onPress: async () => {
          await deleteSession(session.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <HalfModal>
      <Spacer16 />
      <Content>
        <Title>{exercise?.name}</Title>
        <ImageContainer>
          <Image
            resizeMode="contain"
            source={{uri: exercise?.card?.image?.source}}
          />
        </ImageContainer>
      </Content>
      <Spacer16 />
      <BottomContent>
        <Button
          small
          LeftIcon={!startingNow ? PlusIcon : undefined}
          variant={startingNow ? 'primary' : 'secondary'}
          onPress={onPress}>
          {startingNow ? t('join') : t('addToCalendar')}
        </Button>
        <Spacer8 />
        <Button
          small
          LeftIcon={BellIcon}
          variant="secondary"
          active={reminderEnabled}
          onPress={() => toggleReminder(!reminderEnabled)}>
          {t('addReminder')}
        </Button>
        <Spacer8 />
        {user?.uid === session?.facilitator && (
          <DeleteButton small onPress={onDelete} Icon={DeleteIcon} />
        )}
      </BottomContent>
    </HalfModal>
  );
};

export default SessionModal;
