import React from 'react';
import IconButton from '../../../common/components/Buttons/IconButton/IconButton';
import {HangUpIcon} from '../../../common/components/Icons/HangUp/HangUp';

type LeaveButton = {
  onPress: () => void;
};

const LeaveButton: React.FC<LeaveButton> = ({onPress}) => (
  <IconButton Icon={HangUpIcon} onPress={onPress} />
);

export default LeaveButton;
