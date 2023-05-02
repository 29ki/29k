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
import {Image} from 'react-native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../../lib/constants/spacings';
import useUser from '../../../../lib/user/hooks/useUser';
import {useTranslation} from 'react-i18next';

export {HEIGHT} from '../../../../lib/components/ScroreCard/ScoreCard';

const Container = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ImageContainer = styled.View<{small?: boolean}>(() => ({
  backgroundColor: COLORS.GREYMEDIUM,
  width: SPACINGS.TWENTYFOUR,
  height: SPACINGS.TWENTYFOUR,
  borderRadius: SPACINGS.TWELVE,
  overflow: 'hidden',
  shadowColor: COLORS.GREYDARK,
}));

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
      <ImageContainer>
        {user?.photoURL && <Image source={{uri: user.photoURL}} />}
      </ImageContainer>
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
      {positiveFeedbacks.length && (
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
      {completedHostedSessions.length && (
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
