import React from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/core';

import styled from 'styled-components/native';
import IconButton from '../Buttons/IconButton/IconButton';
import {CloseIcon} from '../Icons';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';

const Container = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    flex: 1,
    backgroundColor: backgroundColor ? backgroundColor : COLORS.CREAM,
  }),
);

const Content = styled.View({
  flex: 1,
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
  const navigation =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const isFocused = useIsFocused();

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
    <Container backgroundColor={backgroundColor}>
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
    </Container>
  );
};

export default HalfModal;
