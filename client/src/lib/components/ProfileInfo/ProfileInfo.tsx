import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import Button from '../Buttons/Button';
import {Spacer16} from '../Spacers/Spacer';
import {BottomSheetTextInput} from '../Typography/TextInput/TextInput';
import {SPACINGS} from '../../constants/spacings';
import useChangeProfilePicture from '../../user/hooks/useChangeProfilePicture';
import useUpdateProfileDetails from '../../user/hooks/useUpdateProfileDetails';
import ProfilePicture from '../User/ProfilePicture';
import useUser from '../../user/hooks/useUser';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {ModalStackProps} from '../../navigation/constants/routes';

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

const ProfileInfo = () => {
  const {t} = useTranslation('Component.ProfileInfo');
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<ModalStackProps, 'UpdateProfileDetailsModal'>
    >();
  const user = useUser();
  const {changeProfilePicture, isUpdatingProfilePicture} =
    useChangeProfilePicture();
  const {updateProfileDetails, isUpdatingProfileDetails} =
    useUpdateProfileDetails();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [nameMissing, setNameMissing] = useState(false);
  const [pictureMissing, setPictureMissing] = useState(false);

  useEffect(() => {
    let pictureTimeoutId: NodeJS.Timeout | undefined;
    let nameTimeoutId: NodeJS.Timeout | undefined;
    if (pictureMissing) {
      pictureTimeoutId = setTimeout(() => {
        setPictureMissing(false);
      }, 500);
    }
    if (nameMissing) {
      nameTimeoutId = setTimeout(() => {
        setNameMissing(false);
      }, 300);
    }
    return () => {
      clearTimeout(pictureTimeoutId);
      clearTimeout(nameTimeoutId);
    };
  }, [pictureMissing, nameMissing]);

  const onSave = useCallback(async () => {
    if (displayName.length <= 2) {
      setNameMissing(true);
    } else {
      try {
        await updateProfileDetails({displayName});
      } catch (err: any) {
        if (err.code ?? err.message === 'auth/requires-recent-login') {
          navigate('UpdateProfileDetailsModal', {displayName});
        }
      }
      setNameMissing(false);
    }

    if (!user?.photoURL) {
      setPictureMissing(true);
    } else {
      setPictureMissing(false);
    }
  }, [user, displayName, updateProfileDetails, navigate]);

  return (
    <Container>
      <ProfilePicture
        pictureURL={user?.photoURL}
        hasError={pictureMissing}
        loading={isUpdatingProfilePicture}
        onPress={changeProfilePicture}
        size={SPACINGS.NINTYSIX}
      />
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
          disabled={isUpdatingProfileDetails}
          loading={isUpdatingProfileDetails}
          onPress={onSave}>
          {t('cta')}
        </StyledButton>
      </InputWrapper>
    </Container>
  );
};

export default ProfileInfo;
