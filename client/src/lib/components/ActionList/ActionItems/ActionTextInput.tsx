import React, {forwardRef} from 'react';
import styled from 'styled-components/native';
import {TextInput as RNTextInput, TextInputProps} from 'react-native';
import {TextInput as RNGHTextInput} from 'react-native-gesture-handler';
import {BottomSheetTextInput as BSTextInput} from '@gorhom/bottom-sheet';
import {SPACINGS} from '../../../constants/spacings';
import textStyles from '../../Typography/styles';
import ActionItem from '../ActionItem';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import hexToRgba from 'hex-to-rgba';
import {PencilIcon} from '../../Icons';
import {Spacer8} from '../../Spacers/Spacer';
import {BottomSheetTextInputProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';

const style = ({hasError = false}) => ({
  flex: 1,
  paddingLeft: SPACINGS.SIXTEEN,
  ...textStyles.Body16,
  color: hasError ? COLORS.ERROR : undefined,
});

const attrs = ({hasError = false}) => ({
  placeholderTextColor: hasError ? hexToRgba(COLORS.ERROR, 0.5) : undefined,
});

const TextInput =
  styled(RNTextInput).attrs<ActionTextInputProps>(attrs)<ActionTextInputProps>(
    style,
  );

const BottomSheetTextInput =
  styled(BSTextInput).attrs<ActionTextInputProps>(attrs)<ActionTextInputProps>(
    style,
  );

const IconWrapper = styled.View({
  minWidth: 21,
  height: 21,
});

type ActionTextInputProps = {
  hasError?: boolean;
  Icon?: React.ComponentType;
};
const ActionTextInput = forwardRef<
  RNTextInput,
  ActionTextInputProps & TextInputProps
>(({Icon, ...props}, ref) => (
  <ActionItem>
    <TextInput {...props} ref={ref} />
    <IconWrapper>{Icon ? <Icon /> : <PencilIcon />}</IconWrapper>
    <Spacer8 />
  </ActionItem>
));

export const BottomSheetActionTextInput = forwardRef<
  RNGHTextInput,
  ActionTextInputProps & BottomSheetTextInputProps
>(({Icon, ...props}, ref) => (
  <ActionItem>
    <BottomSheetTextInput {...props} ref={ref} />
    <IconWrapper>{Icon ? <Icon /> : <PencilIcon />}</IconWrapper>
    <Spacer8 />
  </ActionItem>
));

export default ActionTextInput;
