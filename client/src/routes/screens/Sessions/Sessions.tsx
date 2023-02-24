import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import hexToRgba from 'hex-to-rgba';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ListRenderItem} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';
import ExerciseWalletCard from '../../../lib/components/Cards/WalletCards/ExerciseWalletCard';
import Gutters from '../../../lib/components/Gutters/Gutters';
import MiniProfile from '../../../lib/components/MiniProfile/MiniProfile';
import Screen from '../../../lib/components/Screen/Screen';
import {
  Spacer24,
  Spacer60,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import StickyHeading from '../../../lib/components/StickyHeading/StickyHeading';
import TopBar from '../../../lib/components/TopBar/TopBar';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import {SPACINGS} from '../../../lib/constants/spacings';
import useExercises from '../../../lib/content/hooks/useExercises';
import {
  ModalStackProps,
  OverlayStackProps,
} from '../../../lib/navigation/constants/routes';
import {formatExerciseName} from '../../../lib/utils/string';

const BottomGradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 40,
});

type ExerciseCardProps = {
  exercise: Exercise;
  hasCardBefore: boolean;
  hasCardAfter: boolean;
};
const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  hasCardBefore,
  hasCardAfter,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const image = useMemo(() => {
    if (exercise?.card?.image) {
      return {uri: exercise.card.image.source};
    }
  }, [exercise]);

  const onPress = useCallback(() => {
    navigate('CreateSessionModal', {exerciseId: exercise.id, discover: true});
  }, [exercise, navigate]);

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
  const {navigate} =
    useNavigation<NativeStackNavigationProp<OverlayStackProps>>();
  const exercises = useExercises();
  const {t} = useTranslation('Screen.Sessions');
  const colors = useMemo(
    () => [hexToRgba(COLORS.WHITE, 0), hexToRgba(COLORS.WHITE, 1)],
    [],
  );

  const onPressEllipsis = useCallback(() => {
    navigate('AboutOverlay');
  }, [navigate]);

  const renderItem = useCallback<ListRenderItem<Exercise>>(
    ({item, index}) => {
      const hasCardBefore = index > 0;
      const hasCardAfter = index !== exercises.length - 1;
      return (
        <Gutters>
          <ExerciseCard
            exercise={item}
            hasCardBefore={hasCardBefore}
            hasCardAfter={hasCardAfter}
          />
        </Gutters>
      );
    },
    [exercises],
  );

  const stickyHeaderIndices = useMemo(() => [0], []);

  const keyExtractor = useCallback((item: Exercise) => item.id, []);

  return (
    <Screen backgroundColor={COLORS.PURE_WHITE}>
      <TopSafeArea minSize={SPACINGS.SIXTEEN} />
      <TopBar
        backgroundColor={COLORS.PURE_WHITE}
        onPressEllipsis={onPressEllipsis}>
        <MiniProfile />
      </TopBar>
      <Spacer24 />

      <FlatList
        data={exercises}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        stickyHeaderIndices={stickyHeaderIndices}
        ListHeaderComponent={
          <StickyHeading backgroundColor={COLORS.PURE_WHITE}>
            <Heading16>{t('sessionsHeading')}</Heading16>
          </StickyHeading>
        }
        ListFooterComponent={Spacer60}
      />
      <BottomGradient colors={colors} />
    </Screen>
  );
};

export default Sessions;
