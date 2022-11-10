import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import Gutters from '../../common/components/Gutters/Gutters';
import HalfModal from '../../common/components/Modals/HalfModal';
import {
  Spacer16,
  Spacer24,
  Spacer8,
} from '../../common/components/Spacers/Spacer';
import {Display24} from '../../common/components/Typography/Display/Display';

import {ModalStackProps} from '../../lib/navigation/constants/routes';
import Button from '../../common/components/Buttons/Button';

const AddSessionModal: React.FC = () => {
  const {t} = useTranslation('Modal.AddSession');

  const {goBack, navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <HalfModal>
      <Spacer16 />
      <Gutters>
        <Display24>{t('title')}</Display24>
        <Spacer24 />
        <Button
          onPress={() => {
            goBack();
            navigate('CreateSessionModal');
          }}>
          {t('create')}
        </Button>
        <Spacer8 />
        <Button
          onPress={() => {
            goBack();
            navigate('JoinSessionModal', {inviteCode: undefined});
          }}>
          {t('join')}
        </Button>
      </Gutters>
    </HalfModal>
  );
};

export default AddSessionModal;
