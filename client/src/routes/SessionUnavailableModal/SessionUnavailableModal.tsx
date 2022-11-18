import React from 'react';
import {useTranslation} from 'react-i18next';

import Gutters from '../../common/components/Gutters/Gutters';
import CardModal from '../../common/components/Modals/CardModal';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';

const SessionUnavailableModal = () => {
  const {t} = useTranslation('Modal.SessionUnavailable');

  return (
    <CardModal>
      <Gutters>
        <ModalHeading>{t('description')}</ModalHeading>
      </Gutters>
    </CardModal>
  );
};

export default SessionUnavailableModal;
