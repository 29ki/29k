import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Gutters from '../../../common/components/Gutters/Gutters';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {Body16} from '../../../common/components/Typography/Body/Body';
import {
  Display24,
  Display36,
} from '../../../common/components/Typography/Display/Display';
import SheetModal from './SheetModal';

export const DefaultModal = () => (
  <SheetModal>
    <ScrollView>
      <Display36>DefaultModal</Display36>
      <Body16>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s.
      </Body16>
    </ScrollView>
  </SheetModal>
);

export const WithBackgroundColor = () => (
  <SheetModal backgroundColor={COLORS.ACTIVE}>
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
  </SheetModal>
);

export const WithCloseButton = () => (
  <SheetModal onClose={() => {}}>
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
  </SheetModal>
);
