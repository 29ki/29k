import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const RewindIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M14.99 24.376c5.34 0 9.747-4.407 9.747-9.747 0-4.67-3.38-8.626-7.797-9.539V3.706c0-.716-.537-.923-1.12-.5l-3.183 2.251c-.48.349-.48.876 0 1.215l3.173 2.26c.584.424 1.13.235 1.13-.499V7.077a7.759 7.759 0 0 1 5.839 7.552 7.769 7.769 0 0 1-7.788 7.797 7.763 7.763 0 0 1-7.788-7.797 7.717 7.717 0 0 1 3.032-6.13c.443-.386.584-.942.245-1.403-.31-.443-.923-.518-1.431-.104-2.288 1.714-3.795 4.596-3.795 7.637 0 5.34 4.407 9.747 9.737 9.747Z"
      fill={fill}
    />
  </Icon>
);
