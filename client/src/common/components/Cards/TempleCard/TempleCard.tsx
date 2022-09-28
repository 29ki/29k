import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useRecoilValue} from 'recoil';
import {Temple} from '../../../../../../shared/src/types/Temple';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import NS from '../../../../lib/i18n/constants/namespaces';
import {userAtom} from '../../../../lib/user/state/state';
import useSessionNotificationReminder from '../../../../routes/Temples/hooks/useSessionNotificationReminder';
import {RootStackProps} from '../../../constants/routes';
import {BellIcon} from '../../Icons';
import Card from '../Card';

type TempleCardProps = {
  temple: Temple;
};

const TempleCard: React.FC<TempleCardProps> = ({temple}) => {
  const {name, contentId, facilitator} = temple;
  const exercise = useExerciseById(contentId);
  const {t} = useTranslation(NS.COMPONENT.TEMPLE_CARD);
  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackProps>>();
  const user = useRecoilValue(userAtom);
  const [reminder] = useSessionNotificationReminder(temple);

  return (
    <Card
      title={exercise?.name}
      description={name}
      buttonText={t('join_button')}
      image={{
        uri: exercise?.card?.image?.source,
      }}
      onPress={() =>
        navigate('TempleStack', {
          screen: 'ChangingRoom',
          params: {
            templeId: temple.id,
          },
        })
      }
      onContextPress={
        user && facilitator === user.uid
          ? () => {
              navigate('TempleModal', {templeId: temple.id});
            }
          : undefined
      }
      Icon={reminder && BellIcon}
    />
  );
};

export default TempleCard;
