import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import Gutters from '../../../common/components/Gutters/Gutters';
import {Spacer8} from '../../../common/components/Spacers/Spacer';
import TouchableOpacity from '../../../common/components/TouchableOpacity/TouchableOpacity';
import {
  Body18,
  BodyItalic,
} from '../../../common/components/Typography/Body/Body';
import ProfilePicture from '../../../common/components/User/ProfilePicture';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import useUser from '../../../lib/user/hooks/useUser';

const Wrapper = styled(Gutters)({
  flexDirection: 'row',
  alignItems: 'center',
});

const Picture = styled(ProfilePicture)({
  width: 30,
  height: 30,
});

const ProfileMini = () => {
  const {t} = useTranslation('Screen.Profile');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const user = useUser();

  const onPress = useCallback(
    () => navigate('ProfileSettingsModal'),
    [navigate],
  );

  return (
    <TouchableOpacity onPress={onPress}>
      <Wrapper>
        <Picture pictureURL={user?.photoURL} letter={user?.displayName?.[0]} />
        <Spacer8 />
        <Body18>
          {user?.displayName || <BodyItalic>{t('noDisplayName')}</BodyItalic>}
        </Body18>
      </Wrapper>
    </TouchableOpacity>
  );
};

export default ProfileMini;
