import React, {useCallback} from 'react';
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
import * as linking from '../../../lib/linking/nativeLinks';

const SafetyToolkitModal = () => {
  const {t} = useTranslation('Modal.SafetyToolkit');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const onFaqPress = useCallback(() => linking.openURL(t('faq_url')), [t]);
  const onCalmDownPress = useCallback(
    () => navigate('CalmDownModal'),
    [navigate],
  );
  const onReportPress = useCallback(() => navigate('ReportModal'), [navigate]);
  const onHelplinesPress = useCallback(
    () => linking.openURL(t('helplines_url')),
    [t],
  );

  return (
    <SheetModal>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer16 />
          <ActionList>
            <ActionButton Icon={HangUpIcon} onPress={onFaqPress}>
              {t('actions.faq')}
            </ActionButton>
            <ActionButton Icon={HangUpIcon} onPress={onCalmDownPress}>
              {t('actions.calmDown')}
            </ActionButton>
            <ActionButton Icon={HangUpIcon} onPress={onReportPress}>
              {t('actions.report')}
            </ActionButton>
            <ActionButton Icon={HangUpIcon} onPress={onHelplinesPress}>
              {t('actions.helplines')}
            </ActionButton>
          </ActionList>
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default SafetyToolkitModal;
