import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import hexToRgba from 'hex-to-rgba';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {LayoutChangeEvent, ListRenderItem, ScrollView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import {ExerciseSlideSharingSlide} from '../../../../../../../shared/src/types/generated/Exercise';
import {PostEvent} from '../../../../../../../shared/src/types/Event';
import {PostType} from '../../../../../../../shared/src/schemas/Post';
import Button from '../../../../components/Buttons/Button';
import Gutters from '../../../../components/Gutters/Gutters';
import {PlusIcon} from '../../../../components/Icons';
import {
  Spacer16,
  Spacer4,
  Spacer60,
  Spacer8,
} from '../../../../components/Spacers/Spacer';
import {Body16} from '../../../../components/Typography/Body/Body';
import {Display24} from '../../../../components/Typography/Display/Display';
import {HKGroteskBold} from '../../../../constants/fonts';
import {SPACINGS} from '../../../../constants/spacings';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../../navigation/constants/routes';
import useSharingPosts from '../../../../posts/hooks/useSharingPosts';
import useUser from '../../../../user/hooks/useUser';
import useSessionState from '../../../state/state';
import MyPostCard from '../../Posts/MyPostCard';
import ListPostCard, {CARD_WIDTH} from '../../Posts/ListPostCard';

const Wrapper = styled.View({
  flex: 1,
});

const TopGradient = styled(LinearGradient)({
  height: 60,
  justifyContent: 'flex-end',
});

const Content = styled.View({
  flex: 1,
  marginTop: -SPACINGS.SIXTEEN,
});

const StickyHeader = styled(Body16)<{textColor?: string}>(({textColor}) => ({
  textAlign: 'left',
  color: textColor ?? COLORS.BLACK,
  fontFamily: HKGroteskBold,
  marginTop: -SPACINGS.FOURTYEIGHT,
}));

const StyledHeader = styled(Body16)<{textColor?: string}>(({textColor}) => ({
  textAlign: 'left',
  color: textColor ?? COLORS.BLACK,
  fontFamily: HKGroteskBold,
}));

const StyledSubHeader = styled(Display24)<{textColor?: string}>(
  ({textColor}) => ({
    textAlign: 'left',
    color: textColor ?? COLORS.BLACK,
  }),
);

const StyledEmptyText = styled(Body16)<{textColor?: string}>(({textColor}) => ({
  color: textColor ?? COLORS.BLACK,
}));

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

const EmptyListComponent = styled.View({
  height: 50,
  width: '100%',
  paddingTop: SPACINGS.SIXTEEN,
});

type SharingProps = {
  slide: ExerciseSlideSharingSlide;
};

const Sharing: React.FC<SharingProps> = ({slide}) => {
  const scrollRef = useRef<ScrollView>(null);
  const {t} = useTranslation('Component.Sharing');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const user = useUser();
  const [otherPostListHeight, setOhterPostListHeight] = useState(0);
  const [myPostListHeight, setMyPostListHeight] = useState(0);
  const session = useSessionState(state => state.asyncSession);
  const theme = useSessionState(state => state.exercise?.theme);
  const {
    getSharingPosts,
    getSharingPostForSession,
    getSharingPostsForExercise,
  } = useSharingPosts(session?.exerciseId);

  const background = theme?.backgroundColor ?? COLORS.WHITE;
  const topGradientColors = useMemo(
    () => [
      hexToRgba(background, 1),
      hexToRgba(background, 1),
      hexToRgba(background, 1),
      hexToRgba(background, 0),
    ],
    [background],
  );

  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    getSharingPosts(slide.id).then(setPosts);
  }, [getSharingPosts, slide.id]);

  const onAddSharing = useCallback(() => {
    if (session?.exerciseId) {
      navigate('SharingModal', {exerciseId: session.exerciseId});
    }
  }, [session?.exerciseId, navigate]);

  const currentPostEvent = useMemo(() => {
    if (session?.id) {
      return getSharingPostForSession(session.id, slide.id);
    }
  }, [session?.id, slide.id, getSharingPostForSession]);

  const previousPosts = useMemo(() => {
    if (session?.id) {
      return getSharingPostsForExercise(slide.id).filter(
        e => e.payload.sessionId !== currentPostEvent?.payload.sessionId,
      );
    }
    return [];
  }, [session?.id, slide.id, getSharingPostsForExercise, currentPostEvent]);

  const allMyPosts = useMemo(() => {
    if (currentPostEvent) {
      return [currentPostEvent, ...previousPosts];
    }
    return previousPosts;
  }, [currentPostEvent, previousPosts]);

  const onOhterPostListLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setOhterPostListHeight(event.nativeEvent.layout.height);
    },
    [setOhterPostListHeight],
  );

  const onMyPostListLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setMyPostListHeight(event.nativeEvent.layout.height);
    },
    [setMyPostListHeight],
  );

  useEffect(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({
        y: otherPostListHeight + myPostListHeight,
        animated: true,
      });
    });
  }, [otherPostListHeight, myPostListHeight]);

  const userProfile = useMemo(() => {
    if (user?.displayName) {
      return {
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : undefined,
        uid: user.uid,
      };
    }
    return null;
  }, [user]);

  const renderOtherItem = useCallback<ListRenderItem<PostType>>(
    ({item, index}) => {
      return (
        <ItemWrapper isLast={index === posts.length - 1}>
          <ListPostCard text={item.text} userProfile={item.userProfile} />
        </ItemWrapper>
      );
    },
    [posts],
  );

  const otherKeyExtractor = useCallback((item: PostType) => item.id, []);

  const renderMyItem = useCallback<ListRenderItem<PostEvent>>(
    ({item, index}) => {
      return (
        <ItemWrapper isLast={index === allMyPosts.length - 1}>
          <ListPostCard
            text={item.payload.text}
            userProfile={!item.payload.isAnonymous ? userProfile : null}
            isPublic={item.payload.isPublic}
            sharingAt={item.timestamp}
          />
        </ItemWrapper>
      );
    },
    [allMyPosts, userProfile],
  );

  const myKeyExtractor = useCallback(
    (item: PostEvent) => item.payload.sessionId,
    [],
  );

  return (
    <Wrapper>
      <ScrollView stickyHeaderIndices={[0]} ref={scrollRef}>
        <TopGradient colors={topGradientColors}>
          <Gutters>
            <StickyHeader textColor={theme?.textColor}>
              {t('othersHeading')}
            </StickyHeader>
          </Gutters>
        </TopGradient>
        <Content>
          <PostsList
            onLayout={onOhterPostListLayout}
            renderItem={renderOtherItem}
            keyExtractor={otherKeyExtractor}
            ListEmptyComponent={
              <EmptyListComponent>
                <Gutters>
                  <StyledEmptyText textColor={theme?.textColor}>
                    {t('emptyText')}
                  </StyledEmptyText>
                </Gutters>
              </EmptyListComponent>
            }
            horizontal
            data={posts}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + SPACINGS.SIXTEEN}
            showsHorizontalScrollIndicator={false}
          />

          {currentPostEvent && previousPosts.length === 0 && (
            <Gutters>
              <StyledHeader textColor={theme?.textColor}>
                {t('reflectionLabel')}
              </StyledHeader>
              <Spacer16 />
              <MyPostCard
                text={currentPostEvent.payload.text}
                isPublic={currentPostEvent.payload.isPublic}
                userProfile={
                  !currentPostEvent.payload.isAnonymous ? userProfile : null
                }
              />
            </Gutters>
          )}

          {previousPosts.length > 0 && (
            <>
              <Gutters>
                <StyledHeader textColor={theme?.textColor}>
                  {t('reflectionLabel')}
                </StyledHeader>
              </Gutters>
              <Spacer4 />
              <PostsList
                onLayout={onMyPostListLayout}
                renderItem={renderMyItem}
                keyExtractor={myKeyExtractor}
                horizontal
                data={allMyPosts}
                snapToAlignment="center"
                decelerationRate="fast"
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACINGS.SIXTEEN}
              />
            </>
          )}

          {!currentPostEvent && (
            <Gutters>
              <StyledSubHeader textColor={theme?.textColor}>
                {slide.content?.heading}
              </StyledSubHeader>
              <Spacer16 />
              <ButtonWrapper>
                <Button
                  variant="secondary"
                  onPress={onAddSharing}
                  LeftIcon={PlusIcon}>
                  {t('addReflectionCta')}
                </Button>
              </ButtonWrapper>
            </Gutters>
          )}

          <Spacer60 />
          <Spacer8 />
        </Content>
      </ScrollView>
    </Wrapper>
  );
};

export default React.memo(Sharing);
