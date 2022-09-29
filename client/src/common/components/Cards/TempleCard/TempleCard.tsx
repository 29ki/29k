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
  const {name, contentId} = temple;
  const exercise = useExerciseById(contentId);
  const addToCalendar = useAddToCalendar();
  const {t} = useTranslation(NS.COMPONENT.TEMPLE_CARD);
  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackProps>>();
  const {reminderEnabled} = useTempleNotificationReminder(temple);

  const startingNow = false; // Calculate from starting time

  const navigateToTemple = () =>
    navigate('TempleStack', {
      screen: 'ChangingRoom',
      params: {
        templeId: temple.id,
      },
    });

  const navigateToTempleModal = () => navigate('TempleModal', {temple});

  return (
    <Card
      title={exercise?.name}
      description={name}
      buttonText={startingNow ? t('join') : t('addToCalendar')}
      ButtonIcon={PlusIcon}
      image={{
        uri: exercise?.card?.image?.source,
      }}
      onPress={
        startingNow
          ? navigateToTemple
          : () =>
              addToCalendar(
                name,
                exercise?.name,
                dayjs().add(2, 'days'),
                dayjs().add(2, 'days').add(1, 'hour'),
              )
      }
      onContextPress={navigateToTempleModal}
      Icon={reminderEnabled ? BellIcon : undefined}
    />
  );
};

export default TempleCard;
