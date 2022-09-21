import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../constants/colors';
import Icon from '../Icon';

export const FilmCameraOffIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M21.319 24.423a.756.756 0 0 0 1.064 0 .765.765 0 0 0 0-1.064L3.879 4.874a.756.756 0 0 0-1.064 0 .774.774 0 0 0 0 1.064l18.504 18.485ZM17.157 6.861H7.532l12.666 12.665c.057-.273.085-.63.085-.96v-8.57c0-1.996-1.093-3.135-3.127-3.135Zm4.51 10.791 3.211 2.769c.396.339.8.556 1.206.556.762 0 1.28-.547 1.28-1.375V9.686c0-.829-.518-1.375-1.28-1.375-.405 0-.81.216-1.206.555l-3.21 2.769v6.017ZM7.175 22.38h10.424L4.142 8.923c-.103.264-.16.687-.16 1.102v9.266c0 1.987 1.159 3.089 3.193 3.089Z"
      fill={fill}
    />
  </Icon>
);
