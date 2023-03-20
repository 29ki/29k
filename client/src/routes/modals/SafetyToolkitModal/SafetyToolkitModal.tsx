import React from 'react';
import {useTranslation} from 'react-i18next';

import ActionList from '../../../lib/components/ActionList/ActionList';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';

import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';

import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import ActionButton from '../../../lib/components/ActionList/ActionItems/ActionButton';

import {HangUpIcon} from '../../../lib/components/Icons';
import {Spacer16} from '../../../lib/components/Spacers/Spacer';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';

const SafetyToolkitModal = () => {
  const {t} = useTranslation('Modal.SafetyToolkit');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer16 />
          <ActionList>
            <ActionButton Icon={HangUpIcon} onPress={() => {}}>
              {t('actions.faq')}
            </ActionButton>
            <ActionButton
              Icon={HangUpIcon}
              onPress={() => navigate('CalmDownModal')}>
              {t('actions.calmDown')}
            </ActionButton>
            <ActionButton
              Icon={HangUpIcon}
              onPress={() => navigate('ReportModal')}>
              {t('actions.report')}
            </ActionButton>
            <ActionButton Icon={HangUpIcon} onPress={() => {}}>
              {t('actions.helplines')}
            </ActionButton>
          </ActionList>
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default SafetyToolkitModal;
