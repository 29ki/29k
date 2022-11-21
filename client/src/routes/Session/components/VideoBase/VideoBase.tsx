import React from 'react';
import styled from 'styled-components/native';
import RNVideo, {VideoProperties} from 'react-native-video';
import {Platform} from 'react-native';
import {COLORS} from '../../../../../../shared/src/constants/colors';

type CommonProps =
  | 'mixWithOthers'
  | 'ignoreSilentSwitch'
  | 'playInBackground'
  | 'playWhenInactive';

export const VideoBase = React.forwardRef<
  RNVideo,
  Omit<VideoProperties, CommonProps>
>((props, ref) => {
  return (
    <RNVideo
      {...props}
      mixWithOthers="mix"
      ignoreSilentSwitch={Platform.select({
        ios: 'ignore',
      })}
      playInBackground
      playWhenInactive
      allowsExternalPlayback={true}
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
