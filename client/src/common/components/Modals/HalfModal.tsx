import React from 'react';
import {Pressable, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import styled from 'styled-components/native';
import {BottomSafeArea, Spacer24} from '../Spacers/Spacer';
import IconButton from '../Buttons/IconButton/IconButton';
import {Rewind} from '../Icons';
import {ScrollView} from 'react-native-gesture-handler';
import {COLORS} from '../../constants/colors';
import Gutters from '../Gutters/Gutters';
import SETTINGS from '../../constants/settings';

const Container = styled.View<{deviceHeight: number; backgroundColor?: string}>(
  ({deviceHeight, backgroundColor}) => ({
    backgroundColor: backgroundColor ? backgroundColor : COLORS.CREAM,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: deviceHeight - 50,
    ...SETTINGS.BOXSHADOW,
  }),
);

const KeyboardAvoidingView = styled.KeyboardAvoidingView({
  flex: 1,
  justifyContent: 'flex-end',
});

const CloseIconWrapper = styled.View({
  height: 30,
  width: 54,
  top: 15,
  right: 0,
  paddingLeft: 8,
  position: 'absolute',
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
                variant="primary"
                Icon={Rewind}
                onPress={handleOnClose}
              />
            </CloseIconWrapper>
          )}
          <BottomSafeArea minSize={16} />
        </Gutters>
      </Container>
    </KeyboardAvoidingView>
  );
};

export default HalfModal;
