import React from 'react';
import styled from 'styled-components/native';
import IconButton from '../../../common/components/Buttons/IconButton/IconButton';
import {HangUpIcon} from '../../../common/components/Icons/HangUp/HangUp';
import {COLORS} from '../../../common/constants/colors';

const Container = styled.View({
  margin: 'auto',
  borderRadius: 25,
  backgroundColor: COLORS.GREY,
});

type MeetingToggleButton = {
  onPress: () => void;
  active: boolean;
};

const MeetingToggleButton: React.FC<MeetingToggleButton> = ({
  onPress,
  active,
}) => (
  <Container>
    <IconButton
      Icon={HangUpIcon}
      fill={active ? COLORS.SUCCESS_GREEN : COLORS.ERROR_PINK}
      onPress={onPress}
    />
  </Container>
);

export default MeetingToggleButton;
