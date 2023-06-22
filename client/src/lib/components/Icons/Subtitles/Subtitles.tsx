import React from 'react';
import {Path} from 'react-native-svg';
import {IconType} from '..';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Icon from '../Icon';

export const SubtitlesIcon: IconType = ({fill = COLORS.BLACK}) => (
  <Icon>
    <Path
      d="M10.5174 25.1388C11.0541 25.1388 11.4496 24.8752 12.0994 24.3007L15.3294 21.4569H20.9983C23.8328 21.4569 25.4242 19.8183 25.4242 17.0215V9.70462C25.4242 6.90782 23.8328 5.26929 20.9983 5.26929H8.99184C6.16678 5.26929 4.56592 6.90782 4.56592 9.70462V17.0215C4.56592 19.8277 6.21387 21.4569 8.92592 21.4569H9.31201V23.764C9.31201 24.6021 9.7546 25.1388 10.5174 25.1388ZM10.9882 23.0295V20.3457C10.9882 19.7901 10.7434 19.5735 10.216 19.5735H9.05776C7.28739 19.5735 6.43987 18.6789 6.43987 16.965V9.76113C6.43987 8.04726 7.28739 7.15266 9.05776 7.15266H20.9418C22.7028 7.15266 23.5503 8.04726 23.5503 9.76113V16.965C23.5503 18.6789 22.7028 19.5735 20.9418 19.5735H15.2258C14.6514 19.5735 14.3689 19.6677 13.9734 20.082L10.9882 23.0295ZM9.13309 14.479H12.7492C13.0882 14.479 13.3518 14.1965 13.3518 13.8575C13.3518 13.5279 13.0882 13.2454 12.7492 13.2454H9.13309C8.8035 13.2454 8.53983 13.5279 8.53983 13.8575C8.53983 14.1965 8.8035 14.479 9.13309 14.479ZM14.7267 14.479H20.8665C21.2055 14.479 21.4692 14.1965 21.4692 13.8575C21.4692 13.5279 21.2055 13.2454 20.8665 13.2454H14.7267C14.3877 13.2454 14.124 13.5279 14.124 13.8575C14.124 14.1965 14.3971 14.479 14.7267 14.479ZM9.13309 16.9556H10.668C11.007 16.9556 11.2801 16.6731 11.2801 16.3435C11.2801 15.9951 11.007 15.722 10.668 15.722H9.13309C8.8035 15.722 8.53983 16.0045 8.53983 16.3435C8.53983 16.6731 8.8035 16.9556 9.13309 16.9556ZM12.6456 16.9556H17.1468C17.4858 16.9556 17.7589 16.6731 17.7589 16.3435C17.7589 15.9951 17.4858 15.722 17.1468 15.722H12.6456C12.316 15.722 12.0429 16.0045 12.0429 16.3435C12.0429 16.6731 12.316 16.9556 12.6456 16.9556ZM19.1244 16.9556H20.8665C21.1961 16.9556 21.4692 16.6731 21.4692 16.3435C21.4692 15.9951 21.1961 15.722 20.8665 15.722H19.1244C18.7948 15.722 18.5217 16.0045 18.5217 16.3435C18.5217 16.6731 18.7948 16.9556 19.1244 16.9556Z"
      fill={fill}
    />
  </Icon>
);
