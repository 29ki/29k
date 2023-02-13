import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ListRenderItem, View} from 'react-native';
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
import useUser from '../../lib/user/hooks/useUser';
import {CheckIcon} from '../../lib/components/Icons/Check/Check';
import {Body14} from '../../lib/components/Typography/Body/Body';
import Badge from '../../lib/components/Badge/Badge';
import {CommunityIcon, ProfileFillIcon} from '../../lib/components/Icons';
import useUserState, {
  getCompletedSessionByIdSelector,
  PostPayload,
} from '../../lib/user/state/state';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SessionMode} from '../../../../shared/src/types/Session';
import useSharingPosts from '../../lib/posts/hooks/useSharingPosts';
import {ExerciseSlideSharingSlide} from '../../../../shared/src/types/generated/Exercise';
import {complement, isNil} from 'ramda';
import MyPostCard from '../../lib/session/components/Posts/MyPostCard';
import {FlatList} from 'react-native-gesture-handler';
import {SPACINGS} from '../../lib/constants/spacings';

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

const PostsList = styled(FlatList)({
  flexGrow: 0,
  width: '100%',
}) as unknown as FlatList;

const ItemWrapper = styled.View<{isLast: boolean}>(({isLast}) => ({
  paddingLeft: SPACINGS.SIXTEEN,
  paddingRight: isLast ? SPACINGS.SIXTEEN : undefined,
  paddingTop: SPACINGS.SIXTEEN,
}));

const ButtonWrapper = styled.View({flexDirection: 'row'});

const CompletedSessionModal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<ModalStackProps, 'CompletedSessionModal'>>();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const {t} = useTranslation('Modal.CompletedSession');
  const user = useUser();
  const completedSession = useUserState(state =>
    getCompletedSessionByIdSelector(state, session.id),
  );

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
      const posts = exercise?.slides
        .filter(s => s.type === 'sharing')
        .map(s =>
          getSharingPostForSession(
            session.id,
            (s as ExerciseSlideSharingSlide).id,
          ),
        )
        .filter(complement(isNil)) as PostPayload[];
      return [...posts];
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

  const renderItem = useCallback<ListRenderItem<PostPayload>>(
    ({item, index}) => {
      return (
        <ItemWrapper isLast={index === sharingPosts!.length - 1}>
          <MyPostCard
            text={item.text}
            isPublic={item.isPublic}
            userProfile={userProfile}
            inList
          />
        </ItemWrapper>
      );
    },
    [sharingPosts, userProfile],
  );

  const keyExtractor = useCallback((item: PostPayload) => item.sharingId, []);

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
                  user?.photoURL ? user.photoURL : exercise.card.host?.photoURL
                }
                name={
                  user?.displayName
                    ? user.displayName
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
            {sharingPosts.length > 1 ? (
              <PostsList
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                data={sharingPosts}
                snapToAlignment="start"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <Gutters>
                <MyPostCard
                  text={sharingPosts[0].text}
                  isPublic={sharingPosts[0].isPublic}
                  userProfile={userProfile}
                />
              </Gutters>
            )}
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
