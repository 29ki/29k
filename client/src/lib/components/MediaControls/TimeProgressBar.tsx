import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import hexToRgba from 'hex-to-rgba';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import ProgressBar from './ProgressBar';

const Wrapper = styled.View<{color?: string}>(({color}) => ({
  flexDirection: 'row',
  backgroundColor: color ? hexToRgba(color, 0.5) : COLORS.BLACK_TRANSPARENT_30,
  borderRadius: SPACINGS.EIGHT,
  height: SPACINGS.FOUR,
}));

type TimeProgressBarProps = {
  length?: number;
  index?: number;
  color?: string;
  style?: ViewStyle;
};

const TimeProgressBar: React.FC<TimeProgressBarProps> = ({
  index = 0,
  length = 1,
  color,
  style,
}) => (
  <>
    <Wrapper color={color} style={style}>
      <ProgressBar color={color} percentage={index / (length - 1)} />
    </Wrapper>
  </>
);

export default React.memo(TimeProgressBar);
