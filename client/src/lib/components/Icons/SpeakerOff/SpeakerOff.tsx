import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const SpeakerOffIcon: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <Path
      d="M19.67 16.936V7.473c0-.707-.518-1.272-1.243-1.272-.48 0-.819.207-1.337.697l-3.653 3.38c-.038.038-.085.067-.132.067h-.236l6.601 6.591Zm3.296 7.044c.292.283.772.292 1.055 0a.756.756 0 0 0 0-1.064L7.523 6.427a.759.759 0 0 0-1.074 0 .762.762 0 0 0 0 1.055L22.966 23.98Zm-12.74-5.349h2.655c.085 0 .16.029.216.085l3.993 3.71c.471.453.867.65 1.347.65.546 0 .96-.282 1.149-.838L8.616 11.277c-.321.358-.49.885-.49 1.582v3.578c0 1.47.715 2.194 2.1 2.194Z"
      fill={fill}
    />
  </Icon>
);
