import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {UserProfileType} from '../../../../../shared/src/schemas/User';
import {SPACINGS} from '../../constants/spacings';
import {Spacer4} from '../Spacers/Spacer';
import {Body14} from '../Typography/Body/Body';
import ProfilePicture from '../User/ProfilePicture';

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

type BylineUserProps = {
  user?: Pick<UserProfileType, 'displayName' | 'photoURL'> | null;
};

const BylineUser: React.FC<BylineUserProps> = React.memo(({user}) => {
  const {t} = useTranslation('Component.BylineUser');
  return (
    <Container>
      <ProfilePicture
        size={SPACINGS.TWENTYFOUR}
        pictureURL={user?.photoURL}
        letter={user?.displayName?.[0]}
      />
      <Spacer4 />
      <Body14 numberOfLines={1}>
        {user?.displayName ? user.displayName : t('anonymous')}
      </Body14>
    </Container>
  );
});

export default React.memo(BylineUser);
