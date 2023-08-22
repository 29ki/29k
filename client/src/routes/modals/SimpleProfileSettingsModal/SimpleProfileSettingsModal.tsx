import React from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import Gutters from '../../../lib/components/Gutters/Gutters';
import {Spacer16} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import ProfileInfo from '../../../lib/components/ProfileInfo/ProfileInfo';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../lib/navigation/constants/routes';

const SimpleProfileSettingsModal = () => {
  const {t} = useTranslation('Modal.SimpleProfileSettings');
  const {goBack} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();

  return (
    <SheetModal>
      <Gutters big>
        <Spacer16 />
        <ModalHeading>{t('text')}</ModalHeading>
        <Spacer16 />
        <ProfileInfo onSaveCallback={goBack} />
      </Gutters>
    </SheetModal>
  );
};

export default SimpleProfileSettingsModal;
