import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import Gutters from '../../../common/components/Gutters/Gutters';
import Modal from '../../../common/components/Modal/Modal';
import {
  Spacer16,
  Spacer24,
  Spacer8,
} from '../../../common/components/Spacers/Spacer';
import {Display24} from '../../../common/components/Typography/Display/Display';

import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import Button from '../../../common/components/Buttons/Button';

const AddSessionModal: React.FC = () => {
  const {t} = useTranslation('Component.AddSessionModal');

  const {popToTop, navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <Modal>
      <Spacer16 />
      <Gutters>
        <Display24>{t('title')}</Display24>
        <Spacer24 />
        <Button
          onPress={() => {
            popToTop();
            navigate('CreateSessionModal');
          }}>
          {t('create')}
        </Button>
        <Spacer8 />
        <Button
          onPress={() => {
            popToTop();
            navigate('JoinSessionModal', {inviteCode: undefined});
          }}>
          {t('join')}
        </Button>
      </Gutters>
    </Modal>
  );
};

export default AddSessionModal;
