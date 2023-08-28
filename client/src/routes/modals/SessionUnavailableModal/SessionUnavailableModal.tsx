import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';

import Gutters from '../../../lib/components/Gutters/Gutters';
import Image from '../../../lib/components/Image/Image';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {Spacer16, Spacer28} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import {RouteProp, useRoute} from '@react-navigation/native';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import * as linking from '../../../lib/linking/nativeLinks';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';

const ImageWrapper = styled.View({
  width: '65%',
  height: 276,
  alignSelf: 'center',
});

const InfoWrapper = styled.View({
  alignItems: 'center',
});

const LinkWrapper = styled.View({
  flexDirection: 'row',
});

const LinkText = styled(Body16)({
  textDecorationLine: 'underline',
});

const SessionUnavailableModal = () => {
  const {params} =
    useRoute<RouteProp<ModalStackProps, 'SessionUnavailableModal'>>();
  const {t} = useTranslation('Modal.SessionUnavailable');

  const linkPress = useCallback(() => {
    linking.openURL(t('codeOfConductLink'));
  }, [t]);

  return (
    <SheetModal>
      <Gutters big>
        <ModalHeading>
          {params?.userRemoved ? t('descriptionUserRemoved') : t('description')}
        </ModalHeading>
        {params?.userRemoved && (
          <InfoWrapper>
            <Spacer16 />
            <Body16>{t('infoRemoved')}</Body16>
            <Spacer16 />
            <LinkWrapper>
              <Body16>{t('codeOfConductInfo')}</Body16>
              <TouchableOpacity onPress={linkPress}>
                <LinkText>{t('codeOfConductHere')}</LinkText>
              </TouchableOpacity>
            </LinkWrapper>
          </InfoWrapper>
        )}
      </Gutters>
      <ImageWrapper>
        <Spacer28 />
        <Image resizeMode="contain" source={{uri: t('image__image')}} />
      </ImageWrapper>
    </SheetModal>
  );
};

export default SessionUnavailableModal;
