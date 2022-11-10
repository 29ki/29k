import React from 'react';
import {useTranslation} from 'react-i18next';

import Gutters from '../../common/components/Gutters/Gutters';
import HalfModal from '../../common/components/Modals/HalfModal';
import {Spacer16, Spacer24} from '../../common/components/Spacers/Spacer';
import {Body16} from '../../common/components/Typography/Body/Body';

const SessionUnavailableModal = () => {
  const {t} = useTranslation('Component.SessionUnavailableModal');

  return (
    <HalfModal>
      <Spacer16 />
      <Gutters>
        <Spacer24 />
        <Body16>{t('description')}</Body16>
        <Spacer24 />
      </Gutters>
    </HalfModal>
  );
};

export default SessionUnavailableModal;
