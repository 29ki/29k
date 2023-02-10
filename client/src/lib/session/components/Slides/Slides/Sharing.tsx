import {useIsFocused, useNavigation} from '@react-navigation/native';
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
import {Post} from '../../../../../../../shared/src/types/Post';
import Button from '../../../../components/Buttons/Button';
import Gutters from '../../../../components/Gutters/Gutters';
import {PlusIcon} from '../../../../components/Icons';
import {Spacer16, Spacer32} from '../../../../components/Spacers/Spacer';
import {Body16} from '../../../../components/Typography/Body/Body';
import {
  Display24,
  Display28,
} from '../../../../components/Typography/Display/Display';
import {SPACINGS} from '../../../../constants/spacings';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../../navigation/constants/routes';
import useSharingPosts from '../../../../posts/hooks/useSharingPosts';
import useUser from '../../../../user/hooks/useUser';
import useExerciseTheme from '../../../hooks/useExerciseTheme';
import useSessionState from '../../../state/state';
import MyPostCard from '../../Posts/MyPostCard';
import OtherPostCard from '../../Posts/OtherPostCard';

const Wrapper = styled.View({
  flex: 1,
});

const TopGradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  height: 80,
  zIndex: 1,
});

const Content = styled.View({
  flex: 1,
  marginTop: 80,
});

const StyledHeader = styled(Display28)<{textColor?: string}>(({textColor}) => ({
  textAlign: 'left',
  color: textColor ?? COLORS.BLACK,
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
  const isFocused = useIsFocused();
  const {t} = useTranslation('Component.Sharing');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const user = useUser();
  const session = useSessionState(state => state.asyncSession);
  const theme = useExerciseTheme();
  const {getSharingPosts, getSharingPostForSessionId} = useSharingPosts(
    session?.exerciseId,
  );

  const background = theme?.backgroundColor ?? COLORS.WHITE;
  const topGradientColors = useMemo(
    () => [hexToRgba(background, 1), hexToRgba(background, 0)],
    [background],
  );
  const [posts, setPosts] = useState<Post[]>([]);
  const [postListHeight, setPostListHeight] = useState(0);

  useEffect(() => {
    getSharingPosts().then(setPosts);
  }, [getSharingPosts]);

  const onAddSharing = useCallback(() => {
    if (session?.exerciseId) {
      navigate('SharingModal', {exerciseId: session.exerciseId});
    }
  }, [session?.exerciseId, navigate]);

  const sharingPost = useMemo(() => {
    if (session?.id) {
      const post = getSharingPostForSessionId(session.id, slide.id);
      if (post) {
        return {text: post.text, isPublic: post.isPublic};
      }
    }
  }, [session?.id, slide.id, getSharingPostForSessionId]);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      setPostListHeight(event.nativeEvent.layout.height);
    },
    [setPostListHeight],
  );

  useEffect(() => {
    if (sharingPost && isFocused) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({y: postListHeight, animated: true});
      });
    }
  }, [sharingPost, postListHeight, isFocused]);

  const userProfile = useMemo(() => {
    if (user?.displayName) {
      return {
        displayName: user.displayName,
        photoURL: user.photoURL ? user.photoURL : undefined,
      };
    }
  }, [user]);

  const renderItem = useCallback<ListRenderItem<Post>>(
    ({item, index}) => {
      return (
        <ItemWrapper isLast={index === posts.length - 1}>
          <OtherPostCard text={item.text} userProfile={item.userProfile} />
        </ItemWrapper>
      );
    },
    [posts],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  return (
    <Wrapper>
      <TopGradient colors={topGradientColors} />
      <ScrollView ref={scrollRef}>
        <Content>
          <Gutters>
            <StyledHeader textColor={theme?.textColor}>
              {t('othersHeading')}
            </StyledHeader>
          </Gutters>
          <PostsList
            onLayout={onLayout}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
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
            snapToAlignment="start"
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
          />
          <Gutters>
            {sharingPost ? (
              <>
                <StyledSubHeader textColor={theme?.textColor}>
                  {t('reflectionLabel')}
                </StyledSubHeader>
                <Spacer16 />
                <MyPostCard
                  text={sharingPost.text}
                  isPublic={sharingPost.isPublic}
                  userProfile={userProfile}
                />
              </>
            ) : (
              <>
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
              </>
            )}
          </Gutters>
          <Spacer32 />
        </Content>
      </ScrollView>
    </Wrapper>
  );
};

export default Sharing;
