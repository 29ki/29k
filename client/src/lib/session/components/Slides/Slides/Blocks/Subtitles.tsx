import React from 'react';
import {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import RNSubtitles from 'react-native-subtitles';
import {COLORS} from '../../../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../../../constants/spacings';

type SubtitleProps = {
  src: string;
  time: number;
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: COLORS.GREYMEDIUM,
  },
  textStyle: {
    textAlign: 'center',
    borderRadius: 4,
    fontSize: 16,
    fontFamily: 'HK Grotesk',
    backgroundColor: undefined,
    color: COLORS.BLACK,
    padding: SPACINGS.EIGHT,
    alignSelf: undefined,
    textShadowColor: undefined,
    textShadowOffset: undefined,
    textShadowRadius: undefined,
  },
});

const Subtitles: React.FC<SubtitleProps> = ({src, time}) => {
  const subtititles = useMemo(() => ({file: src}), [src]);

  return (
    <RNSubtitles
      currentTime={time}
      containerStyle={styles.containerStyle}
      textStyle={styles.textStyle}
      selectedsubtitle={subtititles}
    />
  );
};

export default Subtitles;
