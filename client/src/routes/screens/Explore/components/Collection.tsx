import React, {useCallback} from 'react';
import styled from 'styled-components/native';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {
  Body12,
  BodyBold,
} from '../../../../lib/components/Typography/Body/Body';
import {Display16} from '../../../../lib/components/Typography/Display/Display';
import useExercisesByCollectionId from '../../../../lib/content/hooks/useExercisesByCollectionId';
import {StyleSheet} from 'react-native';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Spacer4} from '../../../../lib/components/Spacers/Spacer';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  OverlayStackProps,
  ExploreStackProps,
} from '../../../../lib/navigation/constants/routes';
import {useFeaturedCollectionIds} from '../../../../lib/content/hooks/useFeaturedContent';
import CardGraphic from '../../../../lib/components/CardGraphic/CardGraphic';
import {CollectionWithLanguage} from '../../../../lib/content/types';

const Card = styled.View<{backgroundColor?: string}>(({backgroundColor}) => ({
  aspectRatio: '1.3625',
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor,
}));

const New = styled.View({
  position: 'absolute',
  top: 10,
  left: 10,
  paddingHorizontal: 4,
  paddingVertical: 2,
  borderRadius: 4,
  backgroundColor: COLORS.BLACK,
  overflow: 'hidden',
});

const WhiteBody12 = styled(Body12)({
  color: COLORS.PURE_WHITE,
});

const Background = styled(CardGraphic)({
  ...StyleSheet.absoluteFillObject,
  aspectRatio: '1',
});

const Footer = styled(LinearGradient).attrs({
  colors: [
    'rgba(28, 28, 28, 0)',
    'rgba(31, 31, 31, 0.14)',
    'rgba(34, 34, 34, 0.34)',
    'rgba(41, 41, 41, 0.7)',
  ],
  // Fixes issue with types not being passed down properly from .attrs
})<Optional<LinearGradientProps, 'colors'>>({
  ...StyleSheet.absoluteFillObject,
  top: '50%',
  paddingHorizontal: 10,
  paddingBottom: 6,
  justifyContent: 'flex-end',
});

const Lessons = styled(Body12)({
  color: COLORS.PURE_WHITE,
});

type Props = {
  collection: CollectionWithLanguage;
};
const Collection: React.FC<Props> = ({collection}) => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();

  const {t} = useTranslation('Component.Collection');

  const exercises = useExercisesByCollectionId(collection.id);
  const featuredIds = useFeaturedCollectionIds();

  const onPress = useCallback(() => {
    navigate('Collection', {collectionId: collection.id});
  }, [navigate, collection.id]);

  return (
    <TouchableOpacity onPress={onPress}>
      <Card>
        <Background graphic={collection.card} />
        {featuredIds.includes(collection.id) && (
          <New>
            <WhiteBody12>{t('new')}</WhiteBody12>
          </New>
        )}
        <Footer>
          <Lessons>
            <BodyBold>
              {exercises.length} {t('sessions')}
            </BodyBold>
          </Lessons>
        </Footer>
      </Card>
      <Spacer4 />
      <Display16>{collection.name}</Display16>
    </TouchableOpacity>
  );
};

export default React.memo(Collection);
