import React from 'react';
import styled from 'styled-components/native';

import {SPACINGS} from '../../../constants/spacings';
import IconButton from '../IconButton/IconButton';
import {ArrowLeftIcon} from '../../Icons';

const StyledBackButton = styled(IconButton)({
  marginLeft: -SPACINGS.SIXTEEN,
});
export type BaseIconButtonProps = {
  onPress: () => void;
  fill?: string;
};

const BackButton: React.FC<BaseIconButtonProps> = ({onPress, fill}) => (
  <StyledBackButton
    onPress={onPress}
    fill={fill}
    noBackground
    Icon={ArrowLeftIcon}
  />
);
export default BackButton;
