import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {FilmCameraOffIcon} from '../../../components/Icons';

const Wrapper = styled.View({
  height: 24,
  width: 24,
  borderRadius: 45,
  backgroundColor: COLORS.RED_TRANSPARENT_50,
  padding: 2,
});

type VideoOffIndicatorProps = {style?: ViewStyle};

const VideoOffIndicator: React.FC<VideoOffIndicatorProps> = ({style}) => (
  <Wrapper style={style}>
    <FilmCameraOffIcon fill={COLORS.PURE_WHITE} />
  </Wrapper>
);

export default React.memo(VideoOffIndicator);
