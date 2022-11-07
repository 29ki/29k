import React from 'react';
import {StyleSheet, Dimensions, Platform} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/core';

import styled from 'styled-components/native';
import {BottomSafeArea} from '../Spacers/Spacer';
import IconButton from '../Buttons/IconButton/IconButton';
import {CloseIcon} from '../Icons';
import {COLORS} from '../../../../../shared/src/constants/colors';
import SETTINGS from '../../constants/settings';
import {SPACINGS} from '../../constants/spacings';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';

const Background = styled.Pressable({
  ...StyleSheet.absoluteFillObject,
});

const Container = styled.View<{deviceHeight: number; backgroundColor?: string}>(
  ({deviceHeight, backgroundColor}) => ({
    backgroundColor: backgroundColor ? backgroundColor : COLORS.CREAM,
    borderTopLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
    borderTopRightRadius: SETTINGS.BORDER_RADIUS.CARDS,

    maxHeight: deviceHeight - 50,
    ...SETTINGS.BOXSHADOW,
  }),
);

const KeyboardAvoidingView = styled.KeyboardAvoidingView.attrs({
  behavior: Platform.select({ios: 'padding', android: undefined}),
})({
  flex: 1,
  justifyContent: 'flex-end',
});

const Content = styled.View({
  justifyContent: 'space-between',
});

const CloseIconWrapper = styled.View({
  position: 'absolute',
  top: -SPACINGS.SIXTEEN,
  right: SPACINGS.EIGHT,
});

type HalfModalProps = {
  onClose?: () => void;
  backgroundColor?: string;
  children: React.ReactNode;
};

export const HalfModal: React.FC<HalfModalProps> = ({
  children,
  onClose,
  backgroundColor,
}) => {
  const dimensions = Dimensions.get('window');
  const navigation =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const isFocused = useIsFocused();

  const {height} = dimensions;

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
    navigation.popToTop();
  };

  if (!isFocused) {
    return null;
  }

  return (
    <KeyboardAvoidingView>
      <Background onPress={handleOnClose} />
      <Container deviceHeight={height} backgroundColor={backgroundColor}>
        <Content>{children}</Content>
        {onClose && (
          <CloseIconWrapper>
            <IconButton
              small
              variant="secondary"
              Icon={CloseIcon}
              onPress={handleOnClose}
            />
          </CloseIconWrapper>
        )}
        <BottomSafeArea minSize={16} />
      </Container>
    </KeyboardAvoidingView>
  );
};

export default HalfModal;
