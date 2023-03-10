import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useIsFocused} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import ActionButton from '../../../lib/components/ActionList/ActionItems/ActionButton';
import ActionList from '../../../lib/components/ActionList/ActionList';
import * as linking from '../../../lib/linking/nativeLinks';

import Gutters from '../../../lib/components/Gutters/Gutters';
import {
  EnvelopeIcon,
  FacebookIcon,
  HomeIcon,
  InstagramIcon,
  SlackIcon,
} from '../../../lib/components/Icons';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {
  Heading16,
  ModalHeading,
} from '../../../lib/components/Typography/Heading/Heading';

const ScrollView = styled(BottomSheetScrollView)({
  flex: 1,
});

const ContactModal = () => {
  const {t} = useTranslation('Modal.Contact');

  const linkPress = (url: string) => () => {
    linking.openURL(url);
  };

  return (
    <SheetModal>
      <ScrollView focusHook={useIsFocused}>
        <Gutters>
          <ModalHeading>{t('title')}</ModalHeading>
          <Spacer24 />
          <Heading16>{t('contactInformation.heading')}</Heading16>
          <Spacer8 />
          <ActionList>
            <ActionButton
              Icon={HomeIcon}
              onPress={linkPress(t('contactInformation.www.url'))}>
              {t('contactInformation.www.label')}
            </ActionButton>
            <ActionButton
              Icon={SlackIcon}
              onPress={linkPress(t('contactInformation.chat.url'))}>
              {t('contactInformation.chat.label')}
            </ActionButton>
            <ActionButton
              Icon={EnvelopeIcon}
              onPress={linkPress(
                `mailto:${t('contactInformation.email.email')}?subject=${t(
                  'contactInformation.email.subject',
                )}`,
              )}>
              {t('contactInformation.email.label')}
            </ActionButton>
          </ActionList>
          <Spacer16 />
          <ActionList>
            <ActionButton
              Icon={InstagramIcon}
              onPress={linkPress(t('contactInformation.instagram.url'))}>
              {t('contactInformation.instagram.label')}
            </ActionButton>
            <ActionButton
              Icon={FacebookIcon}
              onPress={linkPress(t('contactInformation.facebook.url'))}>
              {t('contactInformation.facebook.label')}
            </ActionButton>
          </ActionList>

          {Boolean(t('partnerContactInformation.heading')) && (
            <>
              <Spacer32 />
              <Heading16>{t('partnerContactInformation.heading')}</Heading16>
              <Spacer8 />
              <ActionList>
                <ActionButton
                  Icon={HomeIcon}
                  onPress={linkPress(t('partnerContactInformation.www.url'))}>
                  {t('partnerContactInformation.www.label')}
                </ActionButton>
                <ActionButton
                  Icon={EnvelopeIcon}
                  onPress={linkPress(
                    `mailto:${t(
                      'partnerContactInformation.email.email',
                    )}?subject=${t('partnerContactInformation.email.subject')}`,
                  )}>
                  {t('partnerContactInformation.email.label')}
                </ActionButton>
              </ActionList>
              <Spacer16 />
              <ActionList>
                <ActionButton
                  Icon={InstagramIcon}
                  onPress={linkPress(
                    t('partnerContactInformation.instagram.url'),
                  )}>
                  {t('partnerContactInformation.instagram.label')}
                </ActionButton>
                <ActionButton
                  Icon={FacebookIcon}
                  onPress={linkPress(
                    t('partnerContactInformation.facebook.url'),
                  )}>
                  {t('partnerContactInformation.facebook.label')}
                </ActionButton>
              </ActionList>
            </>
          )}
        </Gutters>
      </ScrollView>
    </SheetModal>
  );
};

export default ContactModal;
