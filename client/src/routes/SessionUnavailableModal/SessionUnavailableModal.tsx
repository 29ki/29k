import React from 'react';
import {useTranslation} from 'react-i18next';

import Gutters from '../../common/components/Gutters/Gutters';
import Image from '../../common/components/Image/Image';
import SheetModal from '../../common/components/Modals/SheetModal';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';

const SessionUnavailableModal = () => {
  const {t} = useTranslation('Modal.SessionUnavailable');

  return (
    <SheetModal>
      <Gutters big>
        <ModalHeading>{t('description')}</ModalHeading>
      </Gutters>
      <Image resizeMode="contain" source={{uri: t('image')}} />
    </SheetModal>
  );
};

export default SessionUnavailableModal;
