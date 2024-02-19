import {TouchableOpacity} from 'react-native';
import {SPACINGS} from '../../constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';
import styled from 'styled-components/native';
import {TouchableProps} from 'react-native-svg';
import React from 'react';
import hexToRgba from 'hex-to-rgba';
import LinearGradient, {
  LinearGradientProps,
} from 'react-native-linear-gradient';

const Card = styled(TouchableOpacity).attrs(({onPress}) => ({
  disabled: !onPress,
}))<{backgroundColor: string}>(({backgroundColor}) => ({
  flex: 1,
  backgroundColor,
  borderRadius: 24,
  padding: SPACINGS.SIXTEEN,
  overflow: 'hidden',
}));

type BottomGradientProps = {
  color: string;
};

const BottomGradient = styled(LinearGradient).attrs<BottomGradientProps>(
  ({color}) => ({
    colors: [hexToRgba(color, 0), hexToRgba(color, 1)],
    locations: [0, 0.66],
  }),
  // Fixes issue with types not being passed down properly from .attrs
)<Optional<LinearGradientProps, 'colors'>>({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: 48,
});

type Props = {
  onPress?: TouchableProps['onPress'];
  backgroundColor?: string;
  clip?: boolean;
  children?: React.ReactNode;
};

const PostCard: React.FC<Props> = ({
  onPress,
  clip = false,
  backgroundColor = COLORS.WHITE,
  children,
}) => (
  <Card onPress={onPress} backgroundColor={backgroundColor}>
    {children}
    {clip && <BottomGradient color={backgroundColor} />}
  </Card>
);

export default PostCard;
