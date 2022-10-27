import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Gutters from '../Gutters/Gutters';
import {Spacer16} from '../Spacers/Spacer';
import {Body16} from '../Typography/Body/Body';
import {Display24, Display36} from '../Typography/Display/Display';
import Modal from './HalfModal';

export const DefaultModal = () => (
  <Modal>
    <ScrollView>
      <Display36>DefaultModal</Display36>
      <Body16>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s.
      </Body16>
    </ScrollView>
  </Modal>
);

export const WithBackgroundColor = () => (
  <Modal backgroundColor={COLORS.ACTIVE}>
    <ScrollView>
      <Gutters>
        <Spacer16 />
        <Display24>WithBackgroundColor</Display24>
        <Body16>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Body16>
      </Gutters>
    </ScrollView>
  </Modal>
);

export const WithCloseButton = () => (
  <Modal onClose={() => {}}>
    <ScrollView>
      <Gutters>
        <Spacer16 />
        <Display36>WithCloseButton</Display36>
        <Body16>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s.
        </Body16>
      </Gutters>
    </ScrollView>
  </Modal>
);
