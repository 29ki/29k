import styled from 'styled-components/native';
import {ViewStyle} from 'react-native';
import {COLORS} from '../../constants/colors';
import {SPACINGS} from '../../constants/spacings';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import SETTINGS from '../../constants/settings';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';

export type BaseButtonProps = {
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  disabled?: boolean;
  children?: React.ReactNode;
  small?: boolean;
  elevated?: boolean;
  active?: boolean;
};

const BaseButton = styled(TouchableOpacity)<BaseButtonProps>(
  ({variant, small, elevated, disabled, active}) => ({
    backgroundColor: disabled
      ? COLORS.GREYMEDIUM
      : active
      ? COLORS.ACTIVE
      : variant === 'secondary'
      ? COLORS.BLACK
      : variant === 'tertiary'
      ? COLORS.GREYLIGHT
      : COLORS.PRIMARY,
    borderRadius: small ? SPACINGS.TWELVE : SPACINGS.SIXTEEN,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...(elevated ? SETTINGS.BOXSHADOW : {}),
  }),
);

export default BaseButton;
