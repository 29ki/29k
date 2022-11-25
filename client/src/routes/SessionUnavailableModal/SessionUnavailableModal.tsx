import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import Gutters from '../../common/components/Gutters/Gutters';
import Image from '../../common/components/Image/Image';
import SheetModal from '../../common/components/Modals/SheetModal';
import {Spacer28} from '../../common/components/Spacers/Spacer';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';

const ImageWrapper = styled.View({
  width: '65%',
  height: 276,
  alignSelf: 'center',
});

const SessionUnavailableModal = () => {
  const {t} = useTranslation('Modal.SessionUnavailable');

  return (
    <SheetModal>
      <Gutters big>
        <ModalHeading>{t('description')}</ModalHeading>
      </Gutters>
      <ImageWrapper>
        <Spacer28 />
        <Image resizeMode="contain" source={{uri: t('image__image')}} />
      </ImageWrapper>
    </SheetModal>
  );
};

export default SessionUnavailableModal;
