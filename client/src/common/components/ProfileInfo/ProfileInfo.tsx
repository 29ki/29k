import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import Button from '../Buttons/Button';
import {Spacer16} from '../Spacers/Spacer';
import {BottomSheetTextInput} from '../Typography/TextInput/TextInput';
import {SPACINGS} from '../../constants/spacings';
import useChangeProfileInfo from '../../../routes/Profile/hooks/useChangeProfileInfo';
import ProfilePicture from '../User/ProfilePicture';
import useUser from '../../../lib/user/hooks/useUser';
import {COLORS} from '../../../../../shared/src/constants/colors';

const Container = styled.View({
  alignItems: 'center',
});

const InputWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const StyledInut = styled(BottomSheetTextInput)<{hasError: boolean}>(
  ({hasError}) => ({
    flex: 1,
    borderWidth: hasError ? 1 : undefined,
    borderColor: hasError ? COLORS.ERROR : undefined,
  }),
);

const StyledButton = styled(Button)<{customDisabled: boolean}>(
  ({customDisabled}) => ({
    backgroundColor: customDisabled ? COLORS.GREYMEDIUM : undefined,
  }),
);

const ProfilePicutreWrapper = styled.View({
  width: SPACINGS.NINTYSIX,
  height: SPACINGS.NINTYSIX,
});

const ProfileInfo = () => {
  const {t} = useTranslation('Component.ProfileInfo');
  const user = useUser();
  const {changeProfilePicture, changeProfileName} = useChangeProfileInfo();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [nameMissing, setNameMissing] = useState(false);
  const [pictureMissing, setPictureMissing] = useState(false);

  const onSave = useCallback(async () => {
    if (displayName.length <= 2) {
      setNameMissing(true);
    } else {
      await changeProfileName(displayName);
      setNameMissing(false);
    }

    if (!user?.photoURL) {
      setPictureMissing(true);
    } else {
      setPictureMissing(false);
    }
  }, [user, displayName, changeProfileName]);

  return (
    <Container>
      <ProfilePicutreWrapper>
        <ProfilePicture
          pictureURL={user?.photoURL}
          hasError={pictureMissing}
          onPress={changeProfilePicture}
        />
      </ProfilePicutreWrapper>
      <Spacer16 />
      <InputWrapper>
        <StyledInut
          hasError={nameMissing}
          value={displayName}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={onSave}
          placeholder={t('displayName')}
          onChangeText={setDisplayName}
        />
        <Spacer16 />
        <StyledButton
          customDisabled={displayName.length < 2 || !user?.photoURL}
          onPress={onSave}>
          {t('cta')}
        </StyledButton>
      </InputWrapper>
    </Container>
  );
};

export default ProfileInfo;
