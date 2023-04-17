import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {
  LiveSession,
  SessionType,
} from '../../../../../shared/src/types/Session';
import {ChevronLeftIcon, FriendsIcon, CommunityIcon} from '../Icons';
import {Spacer4} from '../Spacers/Spacer';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';
import {Body16} from '../Typography/Body/Body';

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

const EditSessionType: React.FC<{
  sessionType: LiveSession['type'];
  onPress: () => void;
}> = ({sessionType, onPress}) => {
  const {t} = useTranslation('Component.EditSessionType');

  return (
    <TouchableOpacity onPress={onPress}>
      <Row>
        <IconWrapper>
          <ChevronLeftIcon />
        </IconWrapper>
        <IconWrapper>
          {sessionType === SessionType.private ? (
            <FriendsIcon />
          ) : (
            <CommunityIcon />
          )}
        </IconWrapper>
        <Spacer4 />
        <Body16>{t(sessionType)}</Body16>
      </Row>
    </TouchableOpacity>
  );
};

export default EditSessionType;
