import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components/native';
import ScoreCard from '../../../../lib/components/ScroreCard/ScoreCard';
import {LogoIcon} from '../../../../lib/components/Icons';
import {ThumbsUpWithoutPadding} from '../../../../lib/components/Thumbs/Thumbs';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import {
  OverlayStackProps,
  ModalStackProps,
} from '../../../../lib/navigation/constants/routes';
import useUserEvents from '../../../../lib/user/hooks/useUserEvents';
import useCompletedSessions from '../../../../lib/sessions/hooks/useCompletedSessions';

import useUser from '../../../../lib/user/hooks/useUser';
import {useTranslation} from 'react-i18next';
import ProfilePicture from '../../../../lib/components/User/ProfilePicture';

export {HEIGHT} from '../../../../lib/components/ScroreCard/ScoreCard';

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const SessionFilters = () => {
  const {t} = useTranslation('Screen.Journey');
  const {navigate} =
    useNavigation<
      NativeStackNavigationProp<OverlayStackProps & ModalStackProps>
    >();
  const {completedSessions, completedHostedSessions} = useCompletedSessions();
  const {feedbackEvents} = useUserEvents();
  const user = useUser();

  const positiveFeedbacks = useMemo(
    () => feedbackEvents.filter(feedback => feedback.payload.answer),
    [feedbackEvents],
  );

  const UserPic = useCallback(
    () => (
      <ProfilePicture
        size={32}
        pictureURL={user?.photoURL}
        letter={user?.displayName?.[0]}
      />
    ),
    [user],
  );

  const onPositivePress = useCallback(
    () => navigate('CompletedSessionsModal', {filterSetting: 'feedback'}),
    [navigate],
  );

  const onTotalPress = useCallback(
    () => navigate('CompletedSessionsModal', {filterSetting: 'mode'}),
    [navigate],
  );

  const onHostedPress = useCallback(
    () => navigate('CompletedSessionsModal', {filterSetting: 'host'}),
    [navigate],
  );

  return (
    <Container>
      <ScoreCard
        onPress={onTotalPress}
        Icon={LogoIcon}
        heading={`${completedSessions.length}`}
        description={t('totalSessions')}
      />
      {Boolean(positiveFeedbacks.length) && (
        <>
          <Spacer16 />
          <ScoreCard
            onPress={onPositivePress}
            Icon={ThumbsUpWithoutPadding}
            heading={`${positiveFeedbacks.length}`}
            description={t('meaninfulSessions')}
          />
        </>
      )}
      {Boolean(completedHostedSessions.length) && (
        <>
          <Spacer16 />
          <ScoreCard
            onPress={onHostedPress}
            Icon={UserPic}
            heading={`${completedHostedSessions.length}`}
            description={t('hostedSessions')}
          />
        </>
      )}
    </Container>
  );
};

export default SessionFilters;
