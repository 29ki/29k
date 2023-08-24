import React from 'react';
import {useTranslation} from 'react-i18next';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {Heading18} from '../../../lib/components/Typography/Heading/Heading';
import {Spacer16} from '../../../lib/components/Spacers/Spacer';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import styled from 'styled-components/native';

const StyledGutters = styled(Gutters)({});

const SessionEjectionModal = () => {
  const {t} = useTranslation('Modal.SessionEjection');

  return (
    <SheetModal>
      <StyledGutters big>
        <Heading18>{t('description')}</Heading18>
        <Spacer16 />
        <Body16>{t('info')}</Body16>
        <Spacer16 />
        <Body16>{t('contactInfo')}</Body16>
      </StyledGutters>
    </SheetModal>
  );
};

export default SessionEjectionModal;
