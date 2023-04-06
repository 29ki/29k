import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {complement, isNil} from 'ramda';

import Button from '../../../lib/components/Buttons/Button';
import Gutters from '../../../lib/components/Gutters/Gutters';

import Image from '../../../lib/components/Image/Image';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer32,
  Spacer4,
} from '../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import {formatExerciseName} from '../../../lib/utils/string';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import Byline from '../../../lib/components/Bylines/Byline';
import {CheckIcon} from '../../../lib/components/Icons/Check/Check';
import {Body14} from '../../../lib/components/Typography/Body/Body';
import Badge from '../../../lib/components/Badge/Badge';
import {
  CommunityIcon,
  FriendsIcon,
  MeIcon,
} from '../../../lib/components/Icons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  SessionMode,
  SessionType,
} from '../../../../../shared/src/types/Session';
import {PostEvent} from '../../../../../shared/src/types/Event';
import useSharingPosts from '../../../lib/posts/hooks/useSharingPosts';
import {ExerciseSlideSharingSlide} from '../../../../../shared/src/types/generated/Exercise';
import useUserProfile from '../../../lib/user/hooks/useUserProfile';
import MyPostCard from '../../../lib/session/components/Posts/MyPostCard';
import useUser from '../../../lib/user/hooks/useUser';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const SpaceBetweenRow = styled(View)({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Row = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
});

const TitleContainer = styled.View({
  flex: 2,
});

const ImageContainer = styled(Image)({
  aspectRatio: '1',
  flex: 1,
  height: 90,
});

const ChekIconWrapper = styled(View)({
  width: 22,
  height: 22,
  alignSelf: 'center',
});

const ButtonWrapper = styled.View({flexDirection: 'row'});

const CompletedSessionModal = () => {
  const {
    params: {completedSessionEvent},
  } = useRoute<RouteProp<ModalStackProps, 'CompletedSessionModal'>>();
  const {navigate, popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const hostProfile = useUserProfile(completedSessionEvent.payload.hostId);
  const {t} = useTranslation('Modal.CompletedSession');
  const {payload, timestamp} = completedSessionEvent;
  const user = useUser();

  const sessionTime = useMemo(() => dayjs(timestamp), [timestamp]);

  const onStartSession = useCallback(() => {
    popToTop();
    navigate('CreateSessionModal', {
      exerciseId: payload.exerciseId,
    });
  }, [payload, navigate, popToTop]);

  const onHostPress = useCallback(() => {
    popToTop();
    navigate('HostInfoModal', {host: hostProfile});
  }, [navigate, popToTop, hostProfile]);

  const exercise = useExerciseById(payload.exerciseId);
  const {getSharingPostForSession} = useSharingPosts(exercise?.id);

  const sharingPosts = useMemo(() => {
    if (payload.mode === SessionMode.async) {
      return exercise?.slides
        .filter(s => s.type === 'sharing')
        .map(s =>
          getSharingPostForSession(
            payload.id,
            (s as ExerciseSlideSharingSlide).id,
          ),
        )
        .filter(complement(isNil)) as PostEvent[];
    }
  }, [getSharingPostForSession, exercise, payload]);

  const userProfile = useMemo(() => {
    if (user?.displayName) {
      return {
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : undefined,
      };
    }
  }, [user]);

  if (!exercise) {
    return null;
  }

  return (
    <SheetModal backgroundColor={COLORS.LIGHT_GREEN}>
      <BottomSheetScrollView>
        <Spacer16 />
        <Content>
          <SpaceBetweenRow>
            <TitleContainer>
              <Display24>{formatExerciseName(exercise)}</Display24>
              <Spacer4 />
              <TouchableOpacity onPress={onHostPress}>
                <Byline
                  pictureURL={
                    hostProfile?.photoURL
                      ? hostProfile.photoURL
                      : exercise.card?.host?.photoURL
                  }
                  name={
                    hostProfile?.displayName
                      ? hostProfile.displayName
                      : exercise.card?.host?.displayName
                  }
                />
              </TouchableOpacity>
            </TitleContainer>
            <Spacer32 />
            <ImageContainer
              resizeMode="contain"
              source={{uri: exercise?.card?.image?.source}}
            />
          </SpaceBetweenRow>
        </Content>
        {exercise?.description && (
          <>
            <Spacer16 />
            <Gutters>
              <Markdown>{exercise?.description}</Markdown>
            </Gutters>
          </>
        )}
        <Spacer16 />
        <Gutters>
          <Row>
            <ChekIconWrapper>
              <CheckIcon fill={COLORS.PRIMARY} />
            </ChekIconWrapper>
            <Body14>{t('completed')}</Body14>
            <Spacer4 />
            <Badge
              text={sessionTime.format('ddd, D MMM')}
              IconAfter={
                payload.mode === SessionMode.async ? (
                  <MeIcon />
                ) : payload.type === SessionType.public ? (
                  <CommunityIcon />
                ) : (
                  <FriendsIcon />
                )
              }
            />
          </Row>
        </Gutters>
        {sharingPosts && sharingPosts.length > 0 && (
          <>
            <Spacer16 />
            <Gutters>
              {sharingPosts.map((post, index) => (
                <MyPostCard
                  key={index}
                  text={post.payload.text}
                  isPublic={post.payload.isPublic}
                  userProfile={
                    !post.payload.isAnonymous ? userProfile : undefined
                  }
                />
              ))}
            </Gutters>
          </>
        )}
        <Spacer16 />
        <Gutters>
          <ButtonWrapper>
            <Button small variant="secondary" onPress={onStartSession}>
              {t('doAgainButton')}
            </Button>
          </ButtonWrapper>
        </Gutters>
        <Spacer32 />
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default CompletedSessionModal;
