import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {Fragment, useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {complement, isNil, take} from 'ramda';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import Button from '../../../lib/components/Buttons/Button';
import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  BottomSafeArea,
  Spacer16,
  Spacer24,
  Spacer32,
  Spacer4,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import {formatContentName} from '../../../lib/utils/string';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import Byline from '../../../lib/components/Bylines/Byline';
import {Body14} from '../../../lib/components/Typography/Body/Body';
import Badge from '../../../lib/components/Badge/Badge';
import {
  CommunityIcon,
  FriendsIcon,
  MeIcon,
} from '../../../lib/components/Icons';
import {
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import {PostEvent} from '../../../../../shared/src/types/Event';
import useSharingPosts from '../../../lib/posts/hooks/useSharingPosts';
import {ExerciseSlideSharingSlide} from '../../../../../shared/src/types/generated/Exercise';
import useUserProfile from '../../../lib/user/hooks/useUserProfile';
import MyPostCard from '../../../lib/session/components/Posts/MyPostCard';
import useUser from '../../../lib/user/hooks/useUser';
import useGetFeedbackBySessionId from '../../../lib/user/hooks/useGetFeedbackBySessionId';
import Node from '../../../lib/components/Node/Node';
import {SPACINGS} from '../../../lib/constants/spacings';
import Tag from '../../../lib/components/Tag/Tag';
import useGetTagsById from '../../../lib/content/hooks/useGetTagsById';
import {Heading16} from '../../../lib/components/Typography/Heading/Heading';
import SessionCard from '../../../lib/components/Cards/SessionCard/SessionCard';
import useLiveSessionsByExercise from '../../../lib/session/hooks/useLiveSessionsByExercise';
import FeedbackCard from '../../../lib/components/FeedbackCard/FeedbackCard';
import ExerciseCard from '../../../lib/components/Cards/SessionCard/ExerciseCard';
import useExercisesByTags from '../../../lib/content/hooks/useExercisesByTags';
import {Tag as TagType} from '../../../../../shared/src/types/generated/Tag';
import CoCreators from '../../../lib/components/CoCreators/CoCreators';
import ExerciseGraphic from '../../../lib/components/ExerciseGraphic/ExerciseGraphic';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const SpaceBetweenRow = styled(View)({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const StatusRow = styled(Gutters)({
  flexDirection: 'row',
  alignItems: 'flex-start',
});

const VerticalAlign = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const TitleContainer = styled.View({
  flex: 2,
  justifyContent: 'center',
});

const Graphic = styled(ExerciseGraphic)({
  width: 90,
  height: 90,
});

const SharingPost = styled(MyPostCard)({
  backgroundColor: COLORS.WHITE,
});

const Tags = styled(Gutters)({
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -SPACINGS.FOUR,
});

const ButtonWrapper = styled.View({flexDirection: 'row'});

const MORE_LIKE_THIS_LIMIT = 5;

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
  const exercise = useExerciseById(payload.exerciseId, payload.language);
  const tags = useGetTagsById(exercise?.tags);
  const {getSharingPostForSession} = useSharingPosts(exercise?.id);
  const getFeedbackBySessionId = useGetFeedbackBySessionId();
  const exercisesByTags = useExercisesByTags(
    exercise?.tags as TagType[],
    exercise?.id,
  );

  const sessionTime = useMemo(() => dayjs(timestamp), [timestamp]);

  const {sessions} = useLiveSessionsByExercise(exercise?.id && exercise, 5);

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

  const feedback = useMemo(
    () => getFeedbackBySessionId(payload.id),
    [getFeedbackBySessionId, payload],
  );

  const userProfile = useMemo(() => {
    if (user?.displayName) {
      return {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : undefined,
      };
    }
  }, [user]);

  const moreLikeThisExercises = useMemo(
    () =>
      take(MORE_LIKE_THIS_LIMIT, exercisesByTags).map(e => (
        <Fragment key={e.id}>
          <ExerciseCard key={e.id} exercise={e} />
          <Spacer16 />
        </Fragment>
      )),
    [exercisesByTags],
  );

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
              <Display24>{formatContentName(exercise)}</Display24>
              <Spacer4 />
              <Byline
                pictureURL={hostProfile?.photoURL}
                name={hostProfile?.displayName}
                onPress={onHostPress}
              />
            </TitleContainer>
            <Spacer32 />
            <Graphic graphic={exercise.card} />
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
        {tags && (
          <Tags>
            {tags.map(({id, tag}) => (
              <Fragment key={id}>
                <Tag>{tag}</Tag>
                <Spacer4 />
              </Fragment>
            ))}
          </Tags>
        )}
        <Spacer16 />
        <StatusRow>
          <VerticalAlign>
            <Node />
            <Spacer4 />
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
            <Spacer4 />
          </VerticalAlign>
        </StatusRow>
        {feedback && feedback.payload.comment && (
          <Gutters>
            <Spacer16 />
            <FeedbackCard
              date={feedback.timestamp}
              answer={feedback.payload.answer}>
              {feedback.payload.comment}
            </FeedbackCard>
          </Gutters>
        )}
        {sharingPosts && sharingPosts.length > 0 && (
          <>
            <Spacer24 />
            <Gutters>
              {sharingPosts.map((post, index) => (
                <SharingPost
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
        <Spacer24 />
        <Gutters>
          <ButtonWrapper>
            <Button size="small" variant="secondary" onPress={onStartSession}>
              {t('doAgainButton')}
            </Button>
          </ButtonWrapper>
        </Gutters>

        {Boolean(sessions?.length) && (
          <Gutters>
            <Spacer24 />
            <View>
              {sessions.map(item => (
                <Fragment key={item.id}>
                  <SessionCard
                    session={item}
                    small
                    onBeforeContextPress={popToTop}
                  />
                  <Spacer16 />
                </Fragment>
              ))}
            </View>
          </Gutters>
        )}

        {Boolean(exercise.coCreators?.length) && (
          <Gutters>
            <Spacer24 />
            <Heading16>{t('coCreatorsHeading')}</Heading16>
            <Spacer8 />
            <CoCreators coCreators={exercise.coCreators} />
          </Gutters>
        )}

        {Boolean(exercisesByTags?.length) && (
          <Gutters>
            <Spacer24 />
            <Heading16>{t('moreLikeThis')}</Heading16>
            <Spacer8 />
            <View>{moreLikeThisExercises}</View>
          </Gutters>
        )}

        <BottomSafeArea minSize={SPACINGS.THIRTYTWO} />
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default CompletedSessionModal;
