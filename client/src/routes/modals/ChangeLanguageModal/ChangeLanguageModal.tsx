import React from 'react';
import {useTranslation} from 'react-i18next';
import ActionRadioButton from '../../../lib/components/ActionList/ActionItems/ActionRadioButton';
import ActionList from '../../../lib/components/ActionList/ActionList';

import Gutters from '../../../lib/components/Gutters/Gutters';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {Spacer24, Spacer8} from '../../../lib/components/Spacers/Spacer';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import {
  CLIENT_LANGUAGE_TAGS,
  LANGUAGE_TAGS,
  LANGUAGES,
} from '../../../lib/i18n';
import useSetPreferredLanguage from '../../../lib/i18n/hooks/useSetPreferedLanguage';

const ChangeLanguageModal = () => {
  const {i18n, t} = useTranslation('Modal.ChangeLanguage');
  const setPreferredLanguage = useSetPreferredLanguage();

  return (
    <SheetModal>
      <Gutters>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer24 />
        <ActionList>
          {CLIENT_LANGUAGE_TAGS.map(languageTag => (
            <ActionRadioButton
              key={languageTag}
              onPress={() => setPreferredLanguage(languageTag)}
              checked={languageTag === i18n.resolvedLanguage}>
              {LANGUAGES[languageTag]}
            </ActionRadioButton>
          ))}
        </ActionList>
        <Spacer8 />
        <ActionList>
          {LANGUAGE_TAGS.filter(
            languageTag => !CLIENT_LANGUAGE_TAGS.includes(languageTag),
          ).map(languageTag => (
            <ActionRadioButton
              key={languageTag}
              onPress={() => setPreferredLanguage(languageTag)}
              checked={languageTag === i18n.resolvedLanguage}>
              {LANGUAGES[languageTag]}
            </ActionRadioButton>
          ))}
        </ActionList>
      </Gutters>
    </SheetModal>
  );
};

export default ChangeLanguageModal;
