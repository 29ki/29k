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
import {COLORS} from '../../../../../shared/src/constants/colors';

const ImageWrapper = styled.View({
  width: '65%',
  height: 276,
  alignSelf: 'center',
});

const Description = styled(Body16)({
  textAlign: 'center',
});

const HostingInviteFailModal = () => {
  const {t} = useTranslation('Modal.HostingInviteFail');
  const {
    params: {hostName = t('hostNameFallback')},
  } = useRoute<RouteProp<ModalStackProps, 'HostingInviteFailModal'>>();

  return (
    <SheetModal backgroundColor={COLORS.CREAM}>
      <Gutters big>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer16 />
        <Description>{t('description', {hostName})}</Description>
      </Gutters>
      <ImageWrapper>
        <Spacer28 />
        <Image resizeMode="contain" source={{uri: t('image__image')}} />
      </ImageWrapper>
    </SheetModal>
  );
};

export default HostingInviteFailModal;
