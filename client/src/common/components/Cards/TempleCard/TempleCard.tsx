import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Temple} from '../../../../../../shared/src/types/Temple';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import NS from '../../../../lib/i18n/constants/namespaces';
import {RootStackProps} from '../../../constants/routes';
import Card from '../Card';

type TempleCardProps = {
  temple: Temple;
};

const TempleCard: React.FC<TempleCardProps> = ({temple}) => {
  const {name, contentId} = temple;
  const exercise = useExerciseById(contentId);
  const {t} = useTranslation(NS.COMPONENT.TEMPLE_CARD);
  const {navigate} = useNavigation<NativeStackNavigationProp<RootStackProps>>();

  return (
    <Card
      title={exercise?.name}
      description={name}
      buttonText={t('join_button')}
      backgroundColor={exercise?.card?.backgroundColor}
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
    />
  );
};

export default TempleCard;
