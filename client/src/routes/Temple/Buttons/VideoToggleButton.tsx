import React from 'react';
import styled from 'styled-components/native';
import IconButton from '../../../common/components/Buttons/IconButton/IconButton';
import {FilmCameraIcon} from '../../../common/components/Icons/FilmCamera/FilmCamera';
import {FilmCameraOffIcon} from '../../../common/components/Icons/FilmCameraOff/FilmCameraOff';
import {COLORS} from '../../../common/constants/colors';

const Container = styled.View({
  margin: 'auto',
  borderRadius: 25,
  backgroundColor: COLORS.GREY,
});

type VideoToggleButton = {
  onPress: () => void;
  active: boolean;
};

const VideoToggleButton: React.FC<VideoToggleButton> = ({onPress, active}) => (
  <Container>
    <IconButton
      Icon={active ? FilmCameraIcon : FilmCameraOffIcon}
      fill={active ? COLORS.SUCCESS_GREEN : COLORS.ERROR_PINK}
      onPress={onPress}
    />
  </Container>
);

export default VideoToggleButton;
