import React from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';
import AnimatedLottieView, {AnimationObject} from 'lottie-react-native';

import {SPACINGS} from '../../../constants/spacings';
import Image from '../../Image/Image';
import {Display16} from '../../Typography/Display/Display';
import Byline from '../../Bylines/Byline';
import WalletCardBase, {WalletCardBaseProps} from './WalletCardBase';

export const HEIGHT = 80;

const ContentWrapper = styled.View({
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

const Spacer2 = styled.View({height: 2});

const LeftCol = styled.View({
  flex: 1,
  paddingHorizontal: SPACINGS.SIXTEEN,
  paddingVertical: SPACINGS.EIGHT,
});

type SessionWalletCardProps = WalletCardBaseProps & {
  title?: string;
  image?: ImageSourcePropType;
  lottie?: AnimationObject | {uri: string};
  hostPictureURL?: string;
  hostName?: string;
};

export const SessionWalletCard: React.FC<SessionWalletCardProps> = ({
  title,
  lottie,
  image,
  hostPictureURL,
  hostName,
  onPress,
  hasCardBefore,
  hasCardAfter,
  completed,
  children,
}) => (
  <WalletCardBase
    hasCardBefore={hasCardBefore}
    hasCardAfter={hasCardAfter}
    completed={completed}
    onPress={onPress}>
    <ContentWrapper>
      <LeftCol>
        {title && <Display16 numberOfLines={1}>{title}</Display16>}
        <Spacer2 />
        <Byline small pictureURL={hostPictureURL} name={hostName} />
        <Spacer2 />
        {children}
      </LeftCol>
      <GraphicsWrapper>
        {lottie ? (
          <Lottie source={lottie} autoPlay loop />
        ) : image ? (
          <Image resizeMode="contain" source={image} />
        ) : null}
      </GraphicsWrapper>
    </ContentWrapper>
  </WalletCardBase>
);

export default SessionWalletCard;
