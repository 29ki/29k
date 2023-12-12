import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const Forward15: IconType = ({fill = COLORS.BLACK, style}) => (
  <Icon style={style}>
    <Path
      d="M14.737 25.3825C20.0764 25.3825 24.4835 20.9754 24.4835 15.6361C24.4835 12.5944 22.9674 9.71287 20.6885 7.999C20.18 7.58466 19.5585 7.65999 19.2477 8.10259C18.9087 8.56401 19.0594 9.11961 19.4925 9.5057C21.3477 10.9276 22.5248 13.1218 22.5342 15.6361C22.5436 19.9584 19.0594 23.4332 14.737 23.4332C10.4147 23.4332 6.95871 19.9584 6.95871 15.6361C6.95871 11.9823 9.42592 8.94069 12.7972 8.08375V9.44919C12.7972 10.1743 13.3339 10.372 13.9178 9.94829L17.1007 7.69766C17.5715 7.34924 17.5809 6.82189 17.1007 6.48289L13.9272 4.22284C13.3339 3.79908 12.7972 3.98742 12.7972 4.72194V6.0968C8.37123 7.01023 5 10.9653 5 15.6361C5 20.9754 9.40709 25.3825 14.737 25.3825ZM12.0438 19.5817C12.4676 19.5817 12.7312 19.2992 12.7312 18.8472V13.0088C12.7312 12.4438 12.4299 12.1518 11.9308 12.1518C11.6295 12.1518 11.4035 12.246 11.0362 12.5191L9.82143 13.3854C9.56717 13.5926 9.45417 13.7809 9.45417 14.0352C9.45417 14.3742 9.72726 14.6567 10.0569 14.6567C10.2734 14.6567 10.3959 14.6002 10.5748 14.4307L11.3658 13.7904V18.8472C11.3658 19.2898 11.6295 19.5817 12.0438 19.5817ZM16.7711 19.6759C18.3531 19.6759 19.389 18.6589 19.389 17.0957C19.389 15.6926 18.4473 14.732 17.1572 14.732C16.5827 14.732 15.9801 15.0051 15.7164 15.4477L15.867 13.4702H18.5697C18.9087 13.4702 19.1629 13.2065 19.1629 12.8487C19.1629 12.4908 18.9087 12.2554 18.5697 12.2554H15.5751C15.0572 12.2554 14.7653 12.5662 14.7276 13.1124L14.5393 15.7962C14.4922 16.3047 14.7747 16.5589 15.2173 16.5589C15.5657 16.5589 15.6975 16.493 15.9518 16.2952C16.2814 16.0033 16.5545 15.8715 16.9217 15.8715C17.6186 15.8715 18.0706 16.38 18.0706 17.1239C18.0706 17.8961 17.5338 18.4611 16.8182 18.4611C16.2814 18.4611 15.8482 18.1598 15.6034 17.7078C15.4621 17.4818 15.2926 17.3499 15.0289 17.3499C14.6805 17.3499 14.4357 17.5948 14.4357 17.9526C14.4357 18.0939 14.4639 18.2257 14.5204 18.367C14.7747 19.0167 15.6128 19.6759 16.7711 19.6759Z"
      fill={fill}
    />
  </Icon>
);
