import React from 'react';
import {useMemo} from 'react';
import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import RNSubtitles from 'react-native-subtitles';
import hexToRgba from 'hex-to-rgba';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';

type SubtitleProps = {
  src: string;
  time: number;
  backgroundColor?: string;
};

const containerStyle: ViewStyle = {
  flex: 1,
  minWidth: '80%',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 4,
  backgroundColor: hexToRgba(COLORS.PURE_WHITE, 0.51),
};

const textStyle: TextStyle = {
  textAlign: 'center',
  borderRadius: 4,
  fontSize: 16,
  fontFamily: 'HK Grotesk',
  backgroundColor: undefined,
  color: COLORS.BLACK,
  paddingVertical: 6,
  paddingHorizontal: SPACINGS.FOUR,
  alignSelf: undefined,
  textShadowColor: undefined,
  textShadowOffset: undefined,
  textShadowRadius: undefined,
};

const Subtitles: React.FC<SubtitleProps> = ({src, time, backgroundColor}) => {
  const subtititles = useMemo(() => ({file: src}), [src]);

  const customContainerStyle = useMemo<ViewStyle>(
    () =>
      backgroundColor
        ? {
            ...containerStyle,
            backgroundColor: hexToRgba(backgroundColor, 0.51),
          }
        : containerStyle,

    [backgroundColor],
  );

  return (
    <RNSubtitles
      currentTime={time}
      containerStyle={customContainerStyle}
      textStyle={textStyle}
      selectedsubtitle={subtititles}
    />
  );
};

export default Subtitles;
