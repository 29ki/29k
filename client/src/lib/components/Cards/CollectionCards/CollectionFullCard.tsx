import React, {useMemo} from 'react';
import {ImageSourcePropType} from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

import {COLORS} from '../../../../../../shared/src/constants/colors';

import Image from '../../Image/Image';
import {Display22} from '../../Typography/Display/Display';
import {SPACINGS} from '../../../constants/spacings';
import TouchableOpacity from '../../TouchableOpacity/TouchableOpacity';
import {Spacer16, Spacer4, Spacer8} from '../../Spacers/Spacer';
import SessionProgress from '../../SessionProgress/SessionProgress';
import {CollectionIcon} from '../../Icons';
import {Body12} from '../../Typography/Body/Body';
import {PlayfairDisplayMedium} from '../../../constants/fonts';
import SETTINGS from '../../../constants/settings';

export const HEIGHT = 114;

type CollectionFullCardProps = {
  title: string;
  description?: string;
  image: ImageSourcePropType;
  progressItems: Array<boolean>;
  backgroundColorGradient?: {color: string}[];
  textColor?: string;
  onPress: () => void;
};

const Container = styled(TouchableOpacity)({
  height: HEIGHT,
  backgroundColor: COLORS.GREYLIGHTEST,
  borderRadius: SPACINGS.SIXTEEN,
});

const Heading = styled(Display22)<{color?: string}>(
  ({color = COLORS.BLACK}) => ({
    fontFamily: PlayfairDisplayMedium,
    lineHeight: 27,
    color,
  }),
);

const Description = styled(Body12)<{color?: string}>(
  ({color = COLORS.BLACK}) => ({
    fontFamily: PlayfairDisplayMedium,
    color,
  }),
);

const IconWrapper = styled.View({
  width: 23,
  height: 23,
  alignItems: 'center',
  justifyContent: 'center',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: 1,
});

const LeftColumn = styled.View({
  flex: 1,
  height: 86,
  paddingVertical: SPACINGS.EIGHT,
});

const TitleWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const GraphicsWrapper = styled.View({
  width: 64,
  height: 64,
});

const Gradient = styled(LinearGradient).attrs<{colors: string[]}>(
  ({colors}) => ({
    colors,
    angle: 180,
  }),
)({
  flex: 1,
  borderRadius: SETTINGS.BORDER_RADIUS.ACTION_LISTS,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const CollectionFullCard: React.FC<CollectionFullCardProps> = ({
  title,
  image,
  description,
  progressItems,
  backgroundColorGradient,
  textColor,
  onPress,
}) => {
  const colors = useMemo(
    () => backgroundColorGradient?.map(({color}) => color),
    [backgroundColorGradient],
  );

  return (
    <Container onPress={onPress}>
      <Gradient colors={colors || ['transparent']}>
        <Row>
          <LeftColumn>
            <TitleWrapper>
              <IconWrapper>
                <CollectionIcon fill={textColor} />
              </IconWrapper>
              <Spacer8 />
              <Heading numberOfLines={3} color={textColor}>
                {title}
              </Heading>
            </TitleWrapper>
            <Spacer8 />
            <Description numberOfLines={2} color={textColor}>
              {description}
            </Description>
          </LeftColumn>
          <Spacer16 />
          <GraphicsWrapper>
            <Image source={image} />
          </GraphicsWrapper>
        </Row>
        <SessionProgress items={progressItems} />
        <Spacer4 />
      </Gradient>
    </Container>
  );
};

export default React.memo(CollectionFullCard);
