import React from 'react';
import IconButton from '../../../../common/components/Buttons/IconButton/IconButton';
import {IconType} from '../../../../common/components/Icons';
import {COLORS} from '../../../../common/constants/colors';

const NotesButton: React.FC<{Icon: IconType}> = ({Icon}) => (
  <IconButton
    onPress={() => {}}
    Icon={Icon}
    noBackground
    small
    fill={COLORS.BLACK}
  />
);

export default NotesButton;
