import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';

import Image from '../../lib/components/Image/Image';
import SheetModal from '../../lib/components/Modals/SheetModal';
import {Spacer16, Spacer32, Spacer4} from '../../lib/components/Spacers/Spacer';
import {Display24} from '../../lib/components/Typography/Display/Display';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import {formatExerciseName} from '../../lib/utils/string';
import {COLORS} from '../../../../shared/src/constants/colors';
import Markdown from '../../lib/components/Typography/Markdown/Markdown';
import Byline from '../../lib/components/Bylines/Byline';
import {CheckIcon} from '../../lib/components/Icons/Check/Check';
import {Body14} from '../../lib/components/Typography/Body/Body';
import Badge from '../../lib/components/Badge/Badge';
import {CommunityIcon, ProfileFillIcon} from '../../lib/components/Icons';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SessionMode} from '../../../../shared/src/types/Session';
import {PostEvent} from '../../../../shared/src/types/Event';
import useSharingPosts from '../../lib/posts/hooks/useSharingPosts';
import {ExerciseSlideSharingSlide} from '../../../../shared/src/types/generated/Exercise';
import {complement, isNil} from 'ramda';
import MyPostCard from '../../lib/session/components/Posts/MyPostCard';
import useUser from '../../lib/user/hooks/useUser';
import useCompletedSessionById from '../../lib/user/hooks/useCompletedSessionById';

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
    params: {session, hostProfile},
  } = useRoute<RouteProp<ModalStackProps, 'CompletedSessionModal'>>();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const {t} = useTranslation('Modal.CompletedSession');
  const completedSession = useCompletedSessionById(session.id);
  const user = useUser();

  const sessionTime = useMemo(
    () => dayjs(completedSession?.completedAt),
    [completedSession?.completedAt],
  );

  const onStartSession = useCallback(() => {
    navigate('CreateSessionModal', {exerciseId: session.exerciseId});
  }, [session, navigate]);

  const exercise = useExerciseById(session?.exerciseId);
  const {getSharingPostForSession} = useSharingPosts(exercise?.id);

  const sharingPosts = useMemo(() => {
    if (session.mode === SessionMode.async) {
      return [
        ...(exercise?.slides
          .filter(s => s.type === 'sharing')
          .map(s =>
            getSharingPostForSession(
              session.id,
              (s as ExerciseSlideSharingSlide).id,
            ),
          )
          .filter(complement(isNil)) as PostEvent[]),
        ...(exercise?.slides
          .filter(s => s.type === 'sharing')
          .map(s =>
            getSharingPostForSession(
              session.id,
              (s as ExerciseSlideSharingSlide).id,
            ),
          )
          .filter(complement(isNil)) as PostEvent[]),
      ];
    }
  }, [getSharingPostForSession, exercise, session]);

  const userProfile = useMemo(() => {
    if (user?.displayName) {
      return {
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : undefined,
      };
    }
  }, [user]);

  if (!completedSession || !exercise) {
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
              <Byline
                pictureURL={
                  hostProfile?.photoURL
                    ? hostProfile.photoURL
                    : exercise.card.host?.photoURL
                }
                name={
                  hostProfile?.displayName
                    ? hostProfile.displayName
                    : exercise.card.host?.displayName
                }
              />
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
                session.mode === SessionMode.async ? (
                  <ProfileFillIcon />
                ) : (
                  <CommunityIcon />
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
                  userProfile={userProfile}
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
