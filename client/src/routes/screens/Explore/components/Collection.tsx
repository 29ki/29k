import React, {useCallback, useMemo} from 'react';
import AnimatedLottieView from 'lottie-react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  OverlayStackProps,
  ExploreStackProps,
} from '../../../../lib/navigation/constants/routes';
import {
  Body12,
  Body18,
  BodyBold,
} from '../../../../lib/components/Typography/Body/Body';
import {Spacer4} from '../../../../lib/components/Spacers/Spacer';
import {Collection as CollectionType} from '../../../../../../shared/src/types/generated/Collection';
import {Display16} from '../../../../lib/components/Typography/Display/Display';
import useExercisesByCollectionId from '../../../../lib/content/hooks/useExercisesByCollectionId';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {prop} from 'ramda';

const Container = styled(TouchableOpacity)({});

const Card = styled(LinearGradient).attrs({
  angle: 180,
})({
  aspectRatio: 1.3625,
  borderRadius: 16,
  overflow: 'hidden',
});

const BackgroundImage = styled.Image({
  ...StyleSheet.absoluteFillObject,
});

type Props = {
  collection: CollectionType;
};
const Collection: React.FC<Props> = ({collection}) => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();

  const exercises = useExercisesByCollectionId(collection.id);

  const bgColors = useMemo(() => {
    const colors = collection.card?.backgroundColorGradient
      ? collection.card?.backgroundColorGradient.map(prop('color'))
      : [];

    while (colors.length < 2) {
      colors.push('transparent');
    }

    return colors;
  }, [collection.card?.backgroundColorGradient]);

  const source = useMemo(
    () => ({uri: collection.image?.source}),
    [collection.image],
  );

  const onPress = useCallback(() => {
    navigate('Collection', {collectionId: collection.id});
  }, [navigate, collection.id]);

  return (
    <Container onPress={onPress}>
      <Card colors={bgColors}>
        <BackgroundImage source={source} />
        <Body12>
          <BodyBold>{exercises.length} sessions</BodyBold>
        </Body12>
      </Card>
      <Display16>{collection.name}</Display16>
    </Container>
  );
};

export default Collection;
