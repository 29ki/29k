import React from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {UserProfile} from '../../../../../../shared/src/types/User';
import {Body14} from '../../../components/Typography/Body/Body';
import SETTINGS from '../../../constants/settings';
import {SPACINGS} from '../../../constants/spacings';
import BylineUser from '../../../components/Bylines/BylineUser';
import {Spacer4, Spacer8} from '../../../components/Spacers/Spacer';
import Badge from '../../../components/Badge/Badge';
import {PrivateIcon, PublicIcon} from '../../../components/Icons';
import {useTranslation} from 'react-i18next';

const SharingCard = styled.View({
  backgroundColor: COLORS.CREAM,
  borderRadius: 24,
  padding: SPACINGS.SIXTEEN,
  marginBottom: SPACINGS.SIXTEEN,
  ...SETTINGS.BOXSHADOW,
});

const HeaderRow = styled.View({
  flexDirection: 'row',
});

type MyPostCardProps = {
  userProfile?: UserProfile;
  text: string;
  isPublic: boolean;
};

const MyPostCard: React.FC<MyPostCardProps> = ({
  text,
  userProfile,
  isPublic,
}) => {
  const {t} = useTranslation('Component.MyPostCard');

  return (
    <SharingCard>
      <HeaderRow>
        <BylineUser user={userProfile} />
        <Spacer4 />
        <Badge
          Icon={isPublic ? <PublicIcon /> : <PrivateIcon />}
          text={isPublic ? t('everyoneLabel') : t('onlyMeLabel')}
        />
      </HeaderRow>
      <Spacer8 />
      <Body14>{text}</Body14>
    </SharingCard>
  );
};

export default MyPostCard;
