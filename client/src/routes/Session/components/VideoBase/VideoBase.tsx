import React from 'react';
import styled from 'styled-components/native';
import RNVideo, {VideoProperties} from 'react-native-video';
import {Platform} from 'react-native';
import {COLORS} from '../../../../../../shared/src/constants/colors';

const StyledVideo = styled(RNVideo)({
  flex: 1,
  shadowOpacity: 1, // Removes ugly frame on iPhone 13 mini (found in thread: https://github.com/react-native-video/react-native-video/issues/1638)
  shadowColor: COLORS.WHITE_TRANSPARENT_01, // Removes ugly frame on iPhone 13 mini (found in thread: https://github.com/react-native-video/react-native-video/issues/1638)
});

const getSilentSwitchSetting = () =>
  parseFloat(Platform.Version as string) >= 16 ? 'ignore' : undefined;

type CommonProps =
  | 'mixWithOthers'
  | 'ignoreSilentSwitch'
  | 'playInBackground'
  | 'playWhenInactive';

const VideoBase = React.forwardRef<RNVideo, Omit<VideoProperties, CommonProps>>(
  (props, ref) => {
    return (
      <StyledVideo
        {...props}
        mixWithOthers="mix"
        ignoreSilentSwitch={Platform.select({
          ios: getSilentSwitchSetting(),
        })}
        playInBackground
        playWhenInactive
        ref={ref}
      />
    );
  },
);

export default VideoBase;
