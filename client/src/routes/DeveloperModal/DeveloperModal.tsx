import React from 'react';
import {useTranslation} from 'react-i18next';

import ActionList from '../../common/components/ActionList/ActionList';

import Gutters from '../../common/components/Gutters/Gutters';
import SheetModal from '../../common/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer8,
} from '../../common/components/Spacers/Spacer';
import {ModalHeading} from '../../common/components/Typography/Heading/Heading';
import ActionButton from '../../common/components/ActionList/ActionItems/ActionButton';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';
import useToggleHiddenContent from '../../lib/i18n/hooks/useToggleHiddenContent';
import useAppState from '../../lib/appState/state/state';
import useClearUpdates from '../../lib/codePush/hooks/useClearUpdates';
import useCheckForUpdate from '../../lib/codePush/hooks/useCheckForUpdate';
import ActionSwitch from '../../common/components/ActionList/ActionItems/ActionSwitch';

const DeveloperModal = () => {
  const {t} = useTranslation('Modal.Developer');
  const {toggle: toggleUiLib} = useUiLib();
  const toggleHiddenContent = useToggleHiddenContent();
  const showHiddenContent = useAppState(state => state.showHiddenContent);
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();

  return (
    <SheetModal>
      <Gutters>
        <ModalHeading>{t('title')}</ModalHeading>
        <Spacer24 />
        <ActionList>
          <ActionButton onPress={toggleUiLib}>{t('uiLib')}</ActionButton>
          <ActionSwitch
            onValueChange={toggleHiddenContent}
            value={showHiddenContent}>
            {t('showHiddenContent')}
          </ActionSwitch>
        </ActionList>
        <Spacer8 />
        <ActionList>
          <ActionButton onPress={clearUpdates}>{t('clearUpdate')}</ActionButton>
          <ActionButton onPress={checkForUpdate}>
            {t('checkUpdate')}
          </ActionButton>
        </ActionList>
        <Spacer16 />
      </Gutters>
    </SheetModal>
  );
};

export default DeveloperModal;
