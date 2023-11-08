import React from 'react';

import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {BottomSafeArea} from '../../../lib/components/Spacers/Spacer';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../lib/constants/spacings';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import FeedbackPostCard from '../../../lib/components/PostCard/FeedbackPostCard';

const FeedbackPostModal = () => {
  const {
    params: {feedbackPost},
  } = useRoute<RouteProp<ModalStackProps, 'FeedbackPostModal'>>();

  return (
    <SheetModal backgroundColor={COLORS.PURE_WHITE}>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          <FeedbackPostCard feedbackPost={feedbackPost} />
        </Gutters>
        <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default React.memo(FeedbackPostModal);
