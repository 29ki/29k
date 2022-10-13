import React from 'react';
import styled from 'styled-components/native';
import RNVideo, {VideoProperties} from 'react-native-video';
import {Platform} from 'react-native';

const StyledVideo = styled(RNVideo)({
  flex: 1,
  shadowOpacity: 1,
  shadowColor: 'transparent',
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
