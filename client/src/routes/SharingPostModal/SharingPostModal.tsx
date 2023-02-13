import React from 'react';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import Gutters from '../../lib/components/Gutters/Gutters';

import SheetModal from '../../lib/components/Modals/SheetModal';
import {Spacer16} from '../../lib/components/Spacers/Spacer';
import {COLORS} from '../../../../shared/src/constants/colors';
import {SPACINGS} from '../../lib/constants/spacings';
import {Body14} from '../../lib/components/Typography/Body/Body';
import BylineUser from '../../lib/components/Bylines/BylineUser';

import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ModalStackProps} from '../../lib/navigation/constants/routes';

const TextWrapper = styled.View({
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: 24,
  padding: SPACINGS.SIXTEEN,
});

const SharingPostModal = () => {
  const {
    params: {userProfile, text},
  } = useRoute<RouteProp<ModalStackProps, 'SharingPostModal'>>();
  const {goBack} = useNavigation();

  return (
    <SheetModal onPressClose={goBack} backgroundColor={COLORS.WHITE}>
      <BottomSheetScrollView>
        <Gutters>
          <BylineUser user={userProfile} />
          <Spacer16 />
          <TextWrapper>
            <Body14>{text}</Body14>
          </TextWrapper>
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default SharingPostModal;
