import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {Spacer8} from '../Spacers/Spacer';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Body18, BodyItalic} from '../Typography/Body/Body';
import ProfilePicture from '../User/ProfilePicture';
import {ModalStackProps} from '../../navigation/constants/routes';
import useUser from '../../user/hooks/useUser';
import Gutters from '../Gutters/Gutters';

const Profile = styled(Gutters)({
  flexDirection: 'row',
  alignItems: 'center',
});

const MiniProfile = () => {
  const {t} = useTranslation('Screen.Profile');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const user = useUser();

  const onPressProfile = useCallback(
    () => navigate('ProfileSettingsModal'),
    [navigate],
  );

  return (
    <TouchableOpacity onPress={onPressProfile}>
      <Profile>
        <ProfilePicture
          size={32}
          pictureURL={user?.photoURL}
          letter={user?.displayName?.[0]}
        />
        <Spacer8 />
        <Body18>
          {user?.displayName || <BodyItalic>{t('noDisplayName')}</BodyItalic>}
        </Body18>
      </Profile>
    </TouchableOpacity>
  );
};

export default MiniProfile;
