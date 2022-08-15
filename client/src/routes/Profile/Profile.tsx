import React from 'react';
import {useRecoilValue} from 'recoil';
import auth from '@react-native-firebase/auth';
import {useTranslation} from 'react-i18next';

import styled from 'styled-components/native';
import Button from '../../common/components/Buttons/Button';
import Gutters from '../../common/components/Gutters/Gutters';
import {Spacer16, Spacer48} from '../../common/components/Spacers/Spacer';
import {B1} from '../../common/components/Typography/Text/Text';
import useCheckForUpdate from '../../lib/codePush/hooks/useCheckForUpdate';
import useClearUpdates from '../../lib/codePush/hooks/useClearUpdates';
import {useUiLib} from '../../lib/uiLib/hooks/useUiLib';
import {userAtom} from '../../lib/user/state/state';
import {LANGUAGE_TAGS} from '../../../../shared/src/constants/i18n';
import {H3} from '../../common/components/Typography/Heading/Heading';
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
  const logout = () => {
    auth().signOut();
  };

  return (
    <Wrapper>
      <Gutters>
        {user && (
          <>
            <H3>{t('userId')}</H3>
            <B1>{user.uid}</B1>
            <Spacer16 />
          </>
        )}
        <Button onPress={toggleUiLib}>{t('uiLib')}</Button>
        <Spacer16 />
        <Button onPress={clearUpdates}>{t('clearUpdate')}</Button>
        <Spacer16 />
        <Button onPress={checkForUpdate}>{t('checkUpdate')}</Button>
        <Spacer48 />

        <H3>{t('language')}</H3>
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
        <Button onPress={logout}>{t('logout')}</Button>
      </Gutters>
    </Wrapper>
  );
};

export default Profile;
