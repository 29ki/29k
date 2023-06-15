import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {RouteProp, useRoute} from '@react-navigation/native';

import Gutters from '../../../lib/components/Gutters/Gutters';
import Image from '../../../lib/components/Image/Image';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {Spacer16, Spacer28} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';

const ImageWrapper = styled.View({
  width: '65%',
  height: 276,
  alignSelf: 'center',
});

const HostingInviteFailModal = () => {
  const {t} = useTranslation('Modal.HostingInviteFail');
  const {
    params: {hostName = 'the host'},
  } = useRoute<RouteProp<ModalStackProps, 'HostingInviteFailModal'>>();

  return (
    <SheetModal>
      <Gutters big>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer16 />
        <Body16>{t('description', {hostName})}</Body16>
      </Gutters>
      <ImageWrapper>
        <Spacer28 />
        <Image resizeMode="contain" source={{uri: t('image__image')}} />
      </ImageWrapper>
    </SheetModal>
  );
};

export default HostingInviteFailModal;
