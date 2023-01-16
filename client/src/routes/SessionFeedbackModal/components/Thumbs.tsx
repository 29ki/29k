import * as React from 'react';
import {Platform} from 'react-native';
import Svg, {G, Path, SvgProps} from 'react-native-svg';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';

const StyledSvg = styled(Svg)<{active: boolean}>(({active}) => ({
  shadowColor: COLORS.BLACK,
  shadowOffset: '0 0',
  shadowOpacity: active ? 0.16 : 0,
  shadowRadius: 12,
}));

type ThumbProps = {
  active?: boolean;
  style?: SvgProps['style'];
};

export const ThumbsUp: React.FC<ThumbProps> = ({active = false, style}) => (
  <StyledSvg
    width="100%"
    height="100%"
    viewBox="-12 -12 88 88"
    style={style}
    active={active}>
    <G
      strokeWidth={active ? 8 : 0}
      stroke={Platform.select({
        ios: COLORS.PURE_WHITE,
        android: COLORS.GREYLIGHT, // Shadow / elevation doesn't work on Android
      })}>
      <Path d="M31.8 27.1s-4.4.9-.8-6.6c2.6-5.4 2.3-11.7 0-15C27.2.2 19.9 1.9 20.7 5c2.6 10.5-3.3 13.7-6.3 20.3-3.1 6.7-2.8 16.3-1.4 24.8.9 5.3 3.2 11.9 11.5 11.9H36l-4.2-34.9Z" />
      <Path d="M46 35.8H31.8c-5 0-5-8.7 0-8.7H46c5 0 5 8.7 0 8.7ZM47.5 44.6h-17c-6 0-6-8.7 0-8.7h17.1c5.9 0 5.9 8.7-.1 8.7Z" />
      <Path d="M45.9 53.3H31.5c-5 0-5-8.7 0-8.7h14.4c5.1 0 5.1 8.7 0 8.7ZM44.4 62h-9.3c-5.4 0-5.4-8.7 0-8.7h9.3c5.4 0 5.4 8.7 0 8.7Z" />
    </G>
    <G fill="#FFDD67">
      <Path d="M31.8 27.1s-4.4.9-.8-6.6c2.6-5.4 2.3-11.7 0-15C27.2.2 19.9 1.9 20.7 5c2.6 10.5-3.3 13.7-6.3 20.3-3.1 6.7-2.8 16.3-1.4 24.8.9 5.3 3.2 11.9 11.5 11.9H36l-4.2-34.9Z" />
      <Path d="M46 35.8H31.8c-5 0-5-8.7 0-8.7H46c5 0 5 8.7 0 8.7ZM47.5 44.6h-17c-6 0-6-8.7 0-8.7h17.1c5.9 0 5.9 8.7-.1 8.7Z" />
      <Path d="M45.9 53.3H31.5c-5 0-5-8.7 0-8.7h14.4c5.1 0 5.1 8.7 0 8.7ZM44.4 62h-9.3c-5.4 0-5.4-8.7 0-8.7h9.3c5.4 0 5.4 8.7 0 8.7Z" />
    </G>
    <G fill="#EBA352">
      <Path d="M25.8 60.5c-8.3 0-10.1-6.6-11-11.9-1.4-8.5-1.6-15.3 1.1-22.2 3-7.5 6.1-7.7 6.1-22.5 0-.7.4-1.2.8-1.6-1.4.5-2.2 1.3-2.2 2.5 0 11.1-3.1 13.8-6.1 20.5-3.2 6.7-2.9 16.3-1.5 24.8.9 5.3 3.2 11.9 11.5 11.9H36v-1.5H25.8Z" />
      <Path d="M47.1 34.4H32.9c-3.4 0-4.4-4-3.3-6.5-2.7 2.1-1.9 8 2.1 8H46c1.6 0 2.7-.9 3.3-2.2-.6.4-1.3.7-2.2.7ZM48.9 43.1H31.8c-4 0-5.3-4-3.9-6.5-3.2 2.1-2.3 8 2.6 8h17.1c1.9 0 3.2-.9 3.9-2.2-.7.4-1.6.7-2.6.7ZM47.1 51.8H32.6c-3.4 0-4.5-4-3.3-6.6-2.7 2.1-2 8 2.2 8h14.4c1.6 0 2.7-.9 3.3-2.2-.5.6-1.3.8-2.1.8ZM45.6 60.6h-9.3c-3.6 0-4.8-4-3.5-6.6-2.9 2.1-2.1 8 2.3 8h9.3c1.8 0 2.9-.9 3.5-2.2-.6.5-1.4.8-2.3.8Z" />
    </G>
  </StyledSvg>
);

export const ThumbsDown = styled(ThumbsUp)({
  transform: 'scaleY(-1)',
});
