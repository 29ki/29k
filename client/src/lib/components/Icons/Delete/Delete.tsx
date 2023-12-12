import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const DeleteIcon: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <Path
      d="M10.678 24.395h8.654c1.45 0 2.382-.876 2.458-2.326l.63-13.56h1.036c.48 0 .848-.377.848-.848a.828.828 0 0 0-.848-.829h-4.18V5.42c0-1.45-.924-2.298-2.496-2.298H13.2c-1.572 0-2.495.848-2.495 2.298v1.412H6.544a.834.834 0 0 0-.848.83c0 .48.377.847.848.847H7.58l.63 13.56c.076 1.46.999 2.326 2.468 2.326Zm1.789-18.89c0-.48.339-.791.857-.791h3.333c.518 0 .857.31.857.79v1.328h-5.047V5.505Zm-1.601 17.204c-.518 0-.895-.386-.923-.941l-.63-13.26H20.66l-.613 13.26c-.018.565-.386.941-.922.941h-8.259Zm1.356-1.516c.405 0 .66-.254.65-.63l-.283-9.85c-.01-.377-.273-.622-.659-.622-.395 0-.65.254-.64.63l.282 9.85c.01.377.273.622.65.622Zm2.778 0c.396 0 .669-.245.669-.621v-9.85c0-.377-.274-.631-.669-.631-.396 0-.66.254-.66.63v9.85c0 .377.264.622.66.622Zm2.778.01c.377 0 .64-.255.65-.631l.282-9.85c.01-.377-.245-.622-.64-.622-.386 0-.65.245-.66.622l-.282 9.85c-.01.367.245.63.65.63Z"
      fill={fill}
    />
  </Icon>
);
