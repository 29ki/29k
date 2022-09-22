import React from 'react';
import {BaseButtonProps} from '../../../../common/components/Buttons/BaseButton';
import IconButton, {
  BaseIconButtonProps,
} from '../../../../common/components/Buttons/IconButton/IconButton';
import {HangUpIcon} from '../../../../common/components/Icons';

type LeaveButton = BaseButtonProps & BaseIconButtonProps;

const LeaveButton: React.FC<LeaveButton> = ({onPress, fill}) => (
  <IconButton
    fill={fill}
    variant="secondary"
    Icon={HangUpIcon}
    onPress={onPress}
  />
);

export default LeaveButton;
