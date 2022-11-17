import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';

import Gutters from '../../common/components/Gutters/Gutters';
import {Spacer16, Spacer8} from '../../common/components/Spacers/Spacer';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import Button from '../../common/components/Buttons/Button';
import CardModal from '../../common/components/Modals/CardModal';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';

const AddSessionModal: React.FC = () => {
  const {t} = useTranslation('Modal.AddSession');

  const {popToTop, navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  return (
    <CardModal>
      <Gutters>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer16 />
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
    </CardModal>
  );
};

export default AddSessionModal;
