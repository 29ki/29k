import React from 'react';
import {useMemo} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import RNSubtitles from 'react-native-subtitles';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../../../constants/spacings';
import hexToRgba from 'hex-to-rgba';

type SubtitleProps = {
  src: string;
  time: number;
  backgroundColor?: string;
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    minWidth: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: hexToRgba(COLORS.PURE_WHITE, 0.51),
  },
  textStyle: {
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
  },
});

const Subtitles: React.FC<SubtitleProps> = ({src, time, backgroundColor}) => {
  const subtititles = useMemo(() => ({file: src}), [src]);

  const containerStyle = useMemo<ViewStyle>(
    () =>
      backgroundColor
        ? {
            ...styles.containerStyle,
            backgroundColor: hexToRgba(backgroundColor, 0.51),
          }
        : styles.containerStyle,

    [backgroundColor],
  );

  return (
    <RNSubtitles
      currentTime={time}
      containerStyle={containerStyle}
      textStyle={styles.textStyle}
      selectedsubtitle={subtititles}
    />
  );
};

export default Subtitles;
