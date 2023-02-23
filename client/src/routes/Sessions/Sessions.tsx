import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import hexToRgba from 'hex-to-rgba';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ListRenderItem} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

import {COLORS} from '../../../../shared/src/constants/colors';
import ExerciseWalletCard from '../../lib/components/Cards/WalletCards/ExerciseWalletCard';
import Gutters from '../../lib/components/Gutters/Gutters';
import Screen from '../../lib/components/Screen/Screen';
import {
  Spacer16,
  Spacer60,
  Spacer8,
  TopSafeArea,
} from '../../lib/components/Spacers/Spacer';
import {Heading16} from '../../lib/components/Typography/Heading/Heading';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import useExerciseIds from '../../lib/content/hooks/useExerciseIds';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import {formatExerciseName} from '../../lib/utils/string';

const BottomGradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 40,
});

type ExerciseCardProps = {
  exerciseId: string;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
};
const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseId,
  hasCardBefore,
  hasCardAfter,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const exercise = useExerciseById(exerciseId);

  const image = useMemo(() => {
    if (exercise?.card?.image) {
      return {uri: exercise.card.image.source};
    }
  }, [exercise]);

  const onPress = useCallback(() => {
    navigate('CreateSessionModal', {exerciseId, discover: true});
  }, [exerciseId, navigate]);

  if (!exercise) {
    return null;
  }

  return (
    <ExerciseWalletCard
      title={formatExerciseName(exercise)}
      image={image}
      hasCardBefore={hasCardBefore}
      hasCardAfter={hasCardAfter}
      onPress={onPress}
    />
  );
};

const Sessions = () => {
  const exerciseIds = useExerciseIds();
  const {t} = useTranslation('Screen.Sessions');
  const colors = useMemo(
    () => [hexToRgba(COLORS.WHITE, 0), hexToRgba(COLORS.WHITE, 1)],
    [],
  );

  const renderItem = useCallback<ListRenderItem<string>>(
    ({item, index}) => {
      const hasCardBefore = index > 0;
      const hasCardAfter = index !== exerciseIds.length - 1;
      return (
        <Gutters>
          <ExerciseCard
            exerciseId={item}
            hasCardBefore={hasCardBefore}
            hasCardAfter={hasCardAfter}
          />
        </Gutters>
      );
    },
    [exerciseIds],
  );

  const keyExtractor = useCallback((id: string) => id, []);

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea />
      <Spacer16 />

      <FlatList
        data={exerciseIds}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <Gutters>
            <Heading16>{t('sessionsHeading')}</Heading16>
            <Spacer8 />
          </Gutters>
        }
        ListFooterComponent={Spacer60}
      />
      <BottomGradient colors={colors} />
    </Screen>
  );
};

export default Sessions;
