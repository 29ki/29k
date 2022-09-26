import React from 'react';
import {useRecoilValue} from 'recoil';
import {useTranslation} from 'react-i18next';

import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {Spacer16, Spacer48} from '../../common/components/Spacers/Spacer';
import {Body18} from '../../common/components/Typography/Body/Body';
import useCheckForUpdate from '../../lib/codePush/hooks/useCheckForUpdate';
import useClearUpdates from '../../lib/codePush/hooks/useClearUpdates';
import {useSignOutUser} from '../../lib/user/hooks/useSignOutUser';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';
import {userAtom} from '../../lib/user/state/state';
import {LANGUAGE_TAGS} from '../../../../shared/src/constants/i18n';
import {Heading24} from '../../common/components/Typography/Heading/Heading';
import NS from '../../lib/i18n/constants/namespaces';

const Wrapper = styled.View({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Profile = () => {
  const {i18n, t} = useTranslation(NS.SCREEN.PROFILE);
  const user = useRecoilValue(userAtom);
  const {toggle: toggleUiLib} = useUiLib();
  const clearUpdates = useClearUpdates();
  const checkForUpdate = useCheckForUpdate();
  const {signOut} = useSignOutUser();

  return (
    <Wrapper>
      <Gutters>
        {user && (
          <>
            <Heading24>{t('userId')}</Heading24>
            <Body18 selectable>{user.uid}</Body18>
            <Spacer16 />
          </>
        )}
        <Button onPress={toggleUiLib}>{t('uiLib')}</Button>
        <Spacer16 />
        <Button onPress={clearUpdates}>{t('clearUpdate')}</Button>
        <Spacer16 />
        <Button onPress={checkForUpdate}>{t('checkUpdate')}</Button>
        <Spacer48 />

        <Heading24>{t('language')}</Heading24>
        <Spacer16 />
        <Row>
          {LANGUAGE_TAGS.map(languageTag => (
            <Button
              key={languageTag}
              onPress={() => i18n.changeLanguage(languageTag)}>
              {languageTag.toUpperCase()}
            </Button>
          ))}
        </Row>
        <Spacer48 />
        <Button onPress={signOut}>{t('logout')}</Button>
      </Gutters>
    </Wrapper>
  );
};

export default Profile;
