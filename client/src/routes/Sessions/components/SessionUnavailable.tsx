import React from 'react';
import {useTranslation} from 'react-i18next';

import Gutters from '../../../common/components/Gutters/Gutters';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer16, Spacer24} from '../../../common/components/Spacers/Spacer';

import {Display24} from '../../../common/components/Typography/Display/Display';

const SessionUnavailable = () => {
  const {t} = useTranslation('Component.SessionUnavailable');

  return (
    <HalfModal>
      <Spacer16 />
      <Gutters>
        <Spacer24 />
        <Display24>{t('description')}</Display24>
        <Spacer24 />
      </Gutters>
    </HalfModal>
  );
};

export default SessionUnavailable;
