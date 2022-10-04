import React from 'react';
import {Pressable, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import styled from 'styled-components/native';
import {BottomSafeArea, Spacer24} from '../Spacers/Spacer';
import IconButton from '../Buttons/IconButton/IconButton';
import {CloseIcon} from '../Icons';
import {ScrollView} from 'react-native-gesture-handler';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Gutters from '../Gutters/Gutters';
import SETTINGS from '../../constants/settings';
import {SPACINGS} from '../../constants/spacings';

const Container = styled.View<{deviceHeight: number; backgroundColor?: string}>(
  ({deviceHeight, backgroundColor}) => ({
    backgroundColor: backgroundColor ? backgroundColor : COLORS.CREAM,
    borderTopLeftRadius: SETTINGS.BORDER_RADIUS.CARDS,
    borderTopRightRadius: SETTINGS.BORDER_RADIUS.CARDS,
    minHeight: deviceHeight / 3,
    maxHeight: deviceHeight - 50,
    ...SETTINGS.BOXSHADOW,
  }),
);

const KeyboardAvoidingView = styled.KeyboardAvoidingView({
  flex: 1,
  justifyContent: 'flex-end',
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
  const navigation = useNavigation();
  const {height} = dimensions;

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <Pressable style={[StyleSheet.absoluteFill]} onPress={handleOnClose} />
      <Container deviceHeight={height} backgroundColor={backgroundColor}>
        <Gutters>
          <Spacer24 />
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
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
        </Gutters>
        <BottomSafeArea minSize={16} />
      </Container>
    </KeyboardAvoidingView>
  );
};

export default HalfModal;
