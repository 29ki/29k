import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import Button from '../Buttons/Button';
import {Spacer16} from '../Spacers/Spacer';
import {BottomSheetTextInput} from '../Typography/TextInput/TextInput';
import {SPACINGS} from '../../constants/spacings';
import useChangeProfileInfo from '../../../routes/Profile/hooks/useChangeProfileInfo';
import ProfilePicture from '../User/ProfilePicture';
import useUser from '../../../lib/user/hooks/useUser';

const Container = styled.View({
  alignItems: 'center',
});

const StyledInut = styled(BottomSheetTextInput)({width: '50%'});

const ProfilePicutreWrapper = styled.View({
  width: SPACINGS.NINTYSIX,
  height: SPACINGS.NINTYSIX,
});

const ProfileInfo = () => {
  const {t} = useTranslation('Component.ProfileInfo');
  const user = useUser();
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
        placeholder={t('displayName')}
        onChangeText={setDisplayName}
      />
      <Spacer16 />
      <Button onPress={setProfileName}>{t('cta')}</Button>
    </Container>
  );
};

export default ProfileInfo;
