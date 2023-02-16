import React from 'react';
import styled from 'styled-components/native';
import RNVideo, {VideoProperties} from 'react-native-video';
import {COLORS} from '../../../../../../shared/src/constants/colors';

type CommonProps = 'mixWithOthers' | 'playInBackground' | 'playWhenInactive';

export const VideoBase = React.forwardRef<
  RNVideo,
  Omit<VideoProperties, CommonProps>
>((props, ref) => {
  return (
    <RNVideo
      {...props}
      mixWithOthers="mix" // Make sure to mix this audio with daily call
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
>((props, ref) => <StyledVideo {...props} ref={ref} />);

export default React.memo(StyledVideoBase);
