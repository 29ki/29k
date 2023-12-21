import React from 'react';
import {useMemo} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import RNSubtitles from '../../subtitles';
import hexToRgba from 'hex-to-rgba';

import {COLORS} from '../../../../../shared/src/constants/colors';
import textStyles from '../Typography/styles';

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
};

const textStyle: TextStyle = {
  ...textStyles.Body16,
  color: COLORS.BLACK,
  padding: 6,
  textAlign: 'center',
  alignSelf: 'center',
  borderRadius: 4,
  backgroundColor: hexToRgba(COLORS.PURE_WHITE, 0.51),
  overflow: 'hidden',
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
