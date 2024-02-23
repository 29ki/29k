import React, {useCallback, useMemo} from 'react';
import AnimatedLottieView from 'lottie-react-native';
import styled from 'styled-components/native';
import {Category as CategoryType} from '../../../../../../shared/src/types/generated/Category';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Body18} from '../../../../lib/components/Typography/Body/Body';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  OverlayStackProps,
  ExploreStackProps,
} from '../../../../lib/navigation/constants/routes';

const Container = styled(TouchableOpacity)({
  height: 100,
  paddingTop: 16,
  paddingHorizontal: 16,
  paddingBottom: 8,
  alignItems: 'center',
  backgroundColor: COLORS.WHITE,
  borderRadius: 16,
  overflow: 'hidden',
});

const LottieAnimation = styled(AnimatedLottieView)({
  width: 24,
  height: 24,
});

const Name = styled.View({
  flex: 1,
  justifyContent: 'center',
});

const Text = styled(Body18).attrs({
  numberOfLines: 2,
})({
  textAlign: 'center',
});

type Props = {
  category: CategoryType;
};
const Category: React.FC<Props> = ({category}) => {
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ExploreStackProps>
    >();

  const source = useMemo(
    () => category.lottie?.source && {uri: category.lottie?.source},
    [category.lottie],
  );

  const onPress = useCallback(() => {
    navigate('ExploreCategory', {categoryId: category.id});
  }, [navigate, category.id]);

  return (
    <Container onPress={onPress}>
      {source && <LottieAnimation source={source} autoPlay loop />}
      <Name>
        <Text>{category.name}</Text>
      </Name>
    </Container>
  );
};

export default React.memo(Category);
