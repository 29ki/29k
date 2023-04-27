import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {UserProfileType} from '../../../../../shared/src/schemas/User';
import {SPACINGS} from '../../constants/spacings';
import Image from '../Image/Image';
import {Spacer4} from '../Spacers/Spacer';
import {Body14} from '../Typography/Body/Body';

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
});

const ImageContainer = styled.View({
  backgroundColor: COLORS.GREYMEDIUM,
  width: SPACINGS.TWENTYFOUR,
  height: SPACINGS.TWENTYFOUR,
  borderRadius: SPACINGS.TWELVE,
  overflow: 'hidden',
  shadowColor: COLORS.GREYDARK,
});

type BylineUserProps = {user?: UserProfileType | null};

const BylineUser: React.FC<BylineUserProps> = React.memo(({user}) => {
  const {t} = useTranslation('Component.BylineUser');
  return (
    <Container>
      <ImageContainer>
        {user?.photoURL && <Image source={{uri: user?.photoURL}} />}
      </ImageContainer>
      <Spacer4 />
      <Body14 numberOfLines={1}>
        {user?.displayName ? user.displayName : t('anonymous')}
      </Body14>
    </Container>
  );
});

export default React.memo(BylineUser);
