import React from 'react';
import {useTranslation} from 'react-i18next';

import Gutters from '../../common/components/Gutters/Gutters';
import Modal from '../../common/components/Modal/Modal';
import {Spacer16, Spacer24} from '../../common/components/Spacers/Spacer';
import {Body16} from '../../common/components/Typography/Body/Body';

const SessionUnavailableModal = () => {
  const {t} = useTranslation('Modal.SessionUnavailable');

  return (
    <Modal>
      <Spacer16 />
      <Gutters>
        <Spacer24 />
        <Body16>{t('description')}</Body16>
        <Spacer24 />
      </Gutters>
    </Modal>
  );
};

export default SessionUnavailableModal;
