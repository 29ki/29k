import React from 'react';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import IconButton from '../../../../common/components/Buttons/IconButton/IconButton';
import {IconType} from '../../../../common/components/Icons';

const NavButton: React.FC<{Icon: IconType}> = ({Icon}) => (
  <IconButton
    onPress={() => {}}
    Icon={Icon}
    noBackground
    small
    fill={COLORS.BLACK}
  />
);

export default NavButton;
