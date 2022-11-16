import React, {useEffect} from 'react';
import {useNavigation, useIsFocused} from '@react-navigation/core';

import styled from 'styled-components/native';
import IconButton from '../../../common/components/Buttons/IconButton/IconButton';
import {CloseIcon} from '../../../common/components/Icons';
import {SPACINGS} from '../../../common/constants/spacings';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../navigation/constants/routes';
import useModalState from '../state/state';
import {COLORS} from '../../../../../shared/src/constants/colors';

const Container = styled.View<{backgroundColor?: string}>({
  flex: 1,
});

const CloseIconWrapper = styled.View({
  position: 'absolute',
  top: -SPACINGS.SIXTEEN,
  right: SPACINGS.EIGHT,
});

type ModalProps = {
  onClose?: () => void;
  backgroundColor?: string;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({
  children,
  onClose,
  backgroundColor = COLORS.CREAM,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const setBackgroundColor = useModalState(state => state.setBackgroundColor);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setBackgroundColor(backgroundColor);
    }
  }, [isFocused, backgroundColor, setBackgroundColor]);

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
    navigation.popToTop();
  };

  return (
    <Container>
      {children}
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

export default Modal;
