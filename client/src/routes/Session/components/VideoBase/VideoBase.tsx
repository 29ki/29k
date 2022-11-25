import React from 'react';
import styled from 'styled-components/native';
import RNVideo, {VideoProperties} from 'react-native-video';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Platform} from 'react-native';

type CommonProps = 'mixWithOthers' | 'playInBackground' | 'playWhenInactive';

const getMixWithOthersSetting = () =>
  // This might not be needed in daily >= 0.32.0
  Platform.OS === 'ios' && parseFloat(Platform.Version as string) < 16
    ? 'mix'
    : 'inherit';

export const VideoBase = React.forwardRef<
  RNVideo,
  Omit<VideoProperties, CommonProps>
>((props, ref) => {
  return (
    <RNVideo
      {...props}
      mixWithOthers={getMixWithOthersSetting()} // Make sure to mix this audio with daily call
      playInBackground
      playWhenInactive
      allowsExternalPlayback={false}
      ref={ref}
    />
  );
});

const StyledVideo = styled(VideoBase)({
  flex: 1,
  shadowOpacity: 1, // Removes ugly frame on iPhone 13 mini (found in thread: https://github.com/react-native-video/react-native-video/issues/1638)
  shadowColor: COLORS.WHITE_TRANSPARENT_01, // Removes ugly frame on iPhone 13 mini (found in thread: https://github.com/react-native-video/react-native-video/issues/1638)
});

const StyledVideoBase = React.forwardRef<
  RNVideo,
  Omit<VideoProperties, CommonProps>
>((props, ref) => {
  return <StyledVideo {...props} ref={ref} />;
});

export default StyledVideoBase;
