import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Temple} from '../../../../../../shared/src/types/Temple';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import NS from '../../../../lib/i18n/constants/namespaces';
import useTempleNotificationReminder from '../../../../routes/Temples/hooks/useTempleNotificationReminder';
import {RootStackProps} from '../../../constants/routes';
import {PlusIcon, BellIcon} from '../../Icons';
import Card from '../Card';
import dayjs from 'dayjs';
import useAddToCalendar from '../../../../routes/Temples/hooks/useAddToCalendar';

type TempleCardProps = {
  temple: Temple;
};

const TempleCard: React.FC<TempleCardProps> = ({temple}) => {
  const {contentId, startTime} = temple;
  const exercise = useExerciseById(contentId);
  const addToCalendar = useAddToCalendar();
  const {t} = useTranslation(NS.COMPONENT.TEMPLE_CARD);
  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackProps>>();
  const {reminderEnabled} = useTempleNotificationReminder(temple);

  const startAt = dayjs(startTime);
  const startingNow = dayjs().isAfter(startAt.subtract(10, 'minutes'));

  const onPress = () =>
    startingNow
      ? navigate('TempleStack', {
          screen: 'ChangingRoom',
          params: {
            templeId: temple.id,
          },
        })
      : addToCalendar(exercise?.name, startAt, startAt.add(30, 'minutes'));

  const onContextPress = () => navigate('TempleModal', {temple});

  return (
    <Card
      title={exercise?.name}
      buttonText={startingNow ? t('join') : t('addToCalendar')}
      ButtonIcon={PlusIcon}
      image={{
        uri: exercise?.card?.image?.source,
      }}
      onPress={onPress}
      onContextPress={onContextPress}
      Icon={reminderEnabled ? BellIcon : undefined}
    />
  );
};

export default TempleCard;
