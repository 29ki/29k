import React from 'react';
import {Alert} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Gutters from '../Gutters/Gutters';
import {Spacer16} from '../Spacers/Spacer';
import {Body16} from '../Typography/Body/Body';
import {ModalHeading} from '../Typography/Heading/Heading';
import CardModal from './CardModal';
import SheetModal from './SheetModal';

const Wrapper = styled.View({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
});

const SheetWrapper = styled(Wrapper)({
  height: '50%',
});

const CardWrapper = styled(Wrapper)({
  height: 200,
  margin: 10,
});

export const SheetModalDefaults = () => (
  <SheetWrapper>
    <SheetModal>
      <Gutters>
        <ModalHeading>Sheet Modal Defaults</ModalHeading>
        <Spacer16 />
        <Body16>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Body16>
      </Gutters>
    </SheetModal>
  </SheetWrapper>
);

export const SheetModalWithBackgroundColor = () => (
  <SheetWrapper>
    <SheetModal backgroundColor={COLORS.ACTIVE}>
      <Gutters>
        <ModalHeading>Sheet Modal With Background Color</ModalHeading>
        <Spacer16 />
        <Body16>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Body16>
      </Gutters>
    </SheetModal>
  </SheetWrapper>
);

export const SheetModalWithCloseButton = () => (
  <SheetWrapper>
    <SheetModal onPressClose={() => Alert.alert('Close!')}>
      <Gutters>
        <ModalHeading>Sheet Modal With Close Button</ModalHeading>
        <Spacer16 />
        <Body16>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Body16>
      </Gutters>
    </SheetModal>
  </SheetWrapper>
);

export const CardModalDefaults = () => (
  <CardWrapper>
    <CardModal>
      <Gutters>
        <ModalHeading>Card Modal Defaults</ModalHeading>
        <Spacer16 />
        <Body16>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Body16>
      </Gutters>
    </CardModal>
  </CardWrapper>
);

export const CardModalWithBackgroundColor = () => (
  <CardWrapper>
    <CardModal backgroundColor={COLORS.ACTIVE}>
      <Gutters>
        <ModalHeading>Card Modal With Background Color</ModalHeading>
        <Spacer16 />
        <Body16>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Body16>
      </Gutters>
    </CardModal>
  </CardWrapper>
);
