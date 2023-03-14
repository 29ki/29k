import React from 'react';
import {useTranslation} from 'react-i18next';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';

import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';

import {useIsFocused} from '@react-navigation/native';

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {Spacer16} from '../../../lib/components/Spacers/Spacer';

const ReportModal = () => {
  const {t} = useTranslation('Modal.Report');

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer16 />
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default ReportModal;
