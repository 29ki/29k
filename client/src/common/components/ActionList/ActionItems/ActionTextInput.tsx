import React from 'react';
import styled from 'styled-components/native';
import {BottomSheetTextInput as BSTextInput} from '@gorhom/bottom-sheet';
import {SPACINGS} from '../../../constants/spacings';
import textStyles from '../../Typography/styles';
import ActionItem from '../ActionItem';

const style = {
  height: 44,
  flex: 1,
  paddingHorizontal: SPACINGS.SIXTEEN,
  ...textStyles.Body16,
};

const TextInput = styled.TextInput(style);

const BottomSheetTextInput = styled(BSTextInput)(style);

const ActionTextInput: React.FC<
  React.ComponentProps<typeof TextInput>
> = props => (
  <ActionItem>
    <TextInput {...props} />
  </ActionItem>
);

export const BottomSheetActionTextInput: React.FC<
  React.ComponentProps<typeof BottomSheetTextInput>
> = props => (
  <ActionItem>
    <BottomSheetTextInput {...props} />
  </ActionItem>
);

export default ActionTextInput;
