import React from 'react';
import {useMemo} from 'react';
import {TextStyle, ViewStyle} from 'react-native';
import RNSubtitles from '../../subtitles';

import {COLORS} from '../../../../../shared/src/constants/colors';
import textStyles from '../Typography/styles';

type SubtitleProps = {
  src: string;
  time: number;
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
  backgroundColor: COLORS.PURE_WHITE,
  overflow: 'hidden',
};

const Subtitles: React.FC<SubtitleProps> = ({src, time}) => {
  const subtititles = useMemo(() => ({file: src}), [src]);
  return (
    <RNSubtitles
      currentTime={time}
      containerStyle={containerStyle}
      textStyle={textStyle}
      selectedsubtitle={subtititles}
    />
  );
};

export default Subtitles;
