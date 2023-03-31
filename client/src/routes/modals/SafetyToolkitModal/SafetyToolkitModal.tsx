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

import {
  QuestionIcon,
  SparklesIcon,
  ReportIcon,
  HelplinesIcon,
} from '../../../lib/components/Icons';
import {Spacer16} from '../../../lib/components/Spacers/Spacer';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import * as linking from '../../../lib/linking/nativeLinks';
import {getCurrentRouteName} from '../../../lib/navigation/utils/routes';

const SafetyToolkitModal = () => {
  const {t} = useTranslation('Modal.SafetyToolkit');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const onFaqPress = useCallback(() => linking.openURL(t('faq_url')), [t]);
  const onCalmDownPress = useCallback(
    () => navigate('CalmDownModal'),
    [navigate],
  );
  const screen = getCurrentRouteName() as string;
  const onReportPress = useCallback(
    () => navigate('ReportModal', {originScreen: screen}),
    [navigate, screen],
  );
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
            <ActionButton Icon={QuestionIcon} onPress={onFaqPress}>
              {t('actions.faq')}
            </ActionButton>
            <ActionButton Icon={SparklesIcon} onPress={onCalmDownPress}>
              {t('actions.calmDown')}
            </ActionButton>
            <ActionButton Icon={ReportIcon} onPress={onReportPress}>
              {t('actions.report')}
            </ActionButton>
            <ActionButton Icon={HelplinesIcon} onPress={onHelplinesPress}>
              {t('actions.helplines')}
            </ActionButton>
          </ActionList>
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default SafetyToolkitModal;
