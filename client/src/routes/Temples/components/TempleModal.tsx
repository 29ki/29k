import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
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
import useTempleNotificationReminder from '../hooks/useTempleNotificationReminder';
import useTemples from '../hooks/useTemples';

const Content = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});
const BottomContent = styled.View({
  flex: 1,
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

const TempleModal = () => {
  const {
    params: {temple},
  } = useRoute<RouteProp<RootStackProps, 'TempleModal'>>();
  const {t} = useTranslation(NS.COMPONENT.TEMPLE_MODAL);
  const user = useRecoilValue(userAtom);
  const navigation = useNavigation();
  const {deleteTemple} = useTemples();
  const addToCalendar = useAddToCalendar();
  const exercise = useExerciseById(temple?.contentId);
  const {reminderEnabled, toggleReminder} =
    useTempleNotificationReminder(temple);

  if (!temple || !exercise) {
    return null;
  }

  const onDelete = () => {
    Alert.alert(t('delete.header'), t('delete.text'), [
      {text: t('delete.buttons.cancel'), style: 'cancel', onPress: () => {}},
      {
        text: t('delete.buttons.confirm'),
        style: 'destructive',

        onPress: async () => {
          await deleteTemple(temple.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <HalfModal>
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
          LeftIcon={PlusIcon}
          variant="secondary"
          onPress={() =>
            addToCalendar(
              temple.name,
              exercise.name,
              dayjs().add(2, 'days'),
              dayjs().add(2, 'days').add(1, 'hour'),
            )
          }>
          {t('addToCalendar')}
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
        {user?.uid === temple?.facilitator && (
          <DeleteButton small onPress={onDelete} Icon={DeleteIcon} />
        )}
      </BottomContent>
    </HalfModal>
  );
};

export default TempleModal;
