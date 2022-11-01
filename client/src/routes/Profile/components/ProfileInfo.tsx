import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import Input from '../../../common/components/Typography/TextInput/TextInput';
import {SPACINGS} from '../../../common/constants/spacings';
import {userAtom} from '../../../lib/user/state/state';
import useChangeProfileInfo from '../hooks/useChangeProfileInfo';
import ProfilePicture from './ProfilePicture';

const Container = styled.View({
  alignItems: 'center',
});

const StyledInut = styled(Input)({width: '50%'});

const ProfilePicutreWrapper = styled.View({
  width: SPACINGS.NINTYSIX,
  height: SPACINGS.NINTYSIX,
});

const ProfileInfo = () => {
  const {t} = useTranslation('Screen.Profile');
  const user = useRecoilValue(userAtom);
  const {changeProfilePicture, changeProfileName} = useChangeProfileInfo();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');

  const setProfileName = () => changeProfileName(displayName);

  return (
    <Container>
      <ProfilePicutreWrapper>
        <ProfilePicture
          pictureURL={user?.photoURL}
          onPress={changeProfilePicture}
        />
      </ProfilePicutreWrapper>
      <Spacer16 />
      <StyledInut
        value={displayName}
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={setProfileName}
        placeholder={t('userProfile.displayName')}
        onChangeText={setDisplayName}
      />
      <Spacer16 />
      <Button onPress={setProfileName}>{t('userProfile.saveButton')}</Button>
    </Container>
  );
};

export default ProfileInfo;
