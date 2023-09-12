import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {MicrophoneOffIcon} from '../../../components/Icons';

const Wrapper = styled.View({
  height: 24,
  width: 24,
  borderRadius: 45,
  backgroundColor: COLORS.RED_TRANSPARENT_50,
  padding: 2,
});

type AudioDeniedIndicatorProps = {style?: ViewStyle};

const AudioDeniedIndicator: React.FC<AudioDeniedIndicatorProps> = ({style}) => (
  <Wrapper style={style}>
    <MicrophoneOffIcon fill={COLORS.PURE_WHITE} />
  </Wrapper>
);

export default React.memo(AudioDeniedIndicator);
