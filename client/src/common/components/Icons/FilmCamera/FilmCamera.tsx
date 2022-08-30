import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const FilmCameraIcon: IconType = ({fill = COLORS.GREY200}) => (
  <Icon>
    <Path
      d="M7.175 22.38h9.906c2.034 0 3.202-1.14 3.202-3.136V9.997c0-1.997-1.093-3.136-3.127-3.136H7.176c-1.96 0-3.202 1.14-3.202 3.136v9.313c0 1.987 1.177 3.07 3.202 3.07Zm14.492-4.728 3.22 2.769c.387.339.801.556 1.197.556.762 0 1.28-.547 1.28-1.375V9.686c0-.829-.518-1.375-1.28-1.375-.405 0-.81.216-1.196.556l-3.22 2.768v6.017Z"
      fill={fill}
    />
  </Icon>
);
