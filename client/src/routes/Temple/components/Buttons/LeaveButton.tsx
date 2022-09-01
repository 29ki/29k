import React from 'react';
import IconButton from '../../../../common/components/Buttons/IconButton/IconButton';
import {HangUpIcon} from '../../../../common/components/Icons';

type LeaveButton = {
  onPress: () => void;
  fill: string;
};

const LeaveButton: React.FC<LeaveButton> = ({onPress, fill}) => (
  <IconButton Icon={HangUpIcon} onPress={onPress} fill={fill} />
);

export default LeaveButton;
