import React from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';

import {SPACINGS} from '../../../constants/spacings';
import Image from '../../Image/Image';
import {Display16} from '../../Typography/Display/Display';
import WalletCardBase, {WalletCardBaseProps} from './WalletCardBase';

export const WALLET_CARD_HEIGHT = 80;

const Wrapper = styled.View({
  flex: 1,
  flexDirection: 'row',

  justifyContent: 'space-between',
});

const GraphicsWrapper = styled.View({
  width: 64,
  height: 64,
  marginVertical: SPACINGS.EIGHT,
  marginHorizontal: SPACINGS.SIXTEEN,
});

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: '1',
});

const LeftCol = styled.View({
  width: 64,
  height: 64,
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingHorizontal: SPACINGS.SIXTEEN,
  marginVertical: SPACINGS.EIGHT,
});

type ExerciseWalletCardProps = WalletCardBaseProps & {
  title?: string;
  image?: ImageSourcePropType;
  lottie?: AnimationObject | {uri: string};
};

export const ExerciseWalletCard: React.FC<ExerciseWalletCardProps> = ({
  title,
  lottie,
  image,
  onPress,
  hasCardBefore,
  hasCardAfter,
  completed,
}) => (
  <WalletCardBase
    hasCardBefore={hasCardBefore}
    hasCardAfter={hasCardAfter}
    completed={completed}
    onPress={onPress}>
    <Wrapper>
      <LeftCol>
        {title && <Display16 numberOfLines={2}>{title}</Display16>}
      </LeftCol>
      <GraphicsWrapper>
        {lottie ? (
          <Lottie source={lottie} autoPlay loop />
        ) : image ? (
          <Image resizeMode="contain" source={image} />
        ) : null}
      </GraphicsWrapper>
    </Wrapper>
  </WalletCardBase>
);

export default ExerciseWalletCard;
