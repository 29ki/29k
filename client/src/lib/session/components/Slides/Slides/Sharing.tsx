import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import hexToRgba from 'hex-to-rgba';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ListRenderItem, ScrollView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import {ExerciseSlideSharingSlide} from '../../../../../../../shared/src/types/generated/Exercise';
import Button from '../../../../components/Buttons/Button';
import Gutters from '../../../../components/Gutters/Gutters';
import {PlusIcon} from '../../../../components/Icons';
import {
  Spacer16,
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
import ListPostCard, {CARD_WIDTH} from '../../Posts/ListPostCard';
import MyPostCard from '../../Posts/MyPostCard';
import {PostItem} from '../../../../posts/types/PostItem';

const Wrapper = styled.View({
  flex: 1,
});

const TopGradient = styled(LinearGradient)({
  height: 40,
  justifyContent: 'flex-end',
});

const Content = styled.View({
  flex: 1,
  marginTop: -SPACINGS.TWELVE,
});

const StickyHeader = styled(Body16)<{textColor?: string}>(({textColor}) => ({
  textAlign: 'left',
  color: textColor ?? COLORS.BLACK,
  fontFamily: HKGroteskBold,
  marginTop: -35,
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

const PostsList = styled(FlatList)({
  flexGrow: 0,
  width: '100%',
}) as unknown as FlatList;

const ItemWrapper = styled.View<{isLast: boolean}>(({isLast}) => ({
  paddingLeft: SPACINGS.SIXTEEN,
  paddingRight: isLast ? SPACINGS.SIXTEEN : undefined,
  paddingTop: SPACINGS.EIGHT,
}));

const ButtonWrapper = styled.View({flexDirection: 'row'});

type SharingProps = {
  slide: ExerciseSlideSharingSlide;
};

const Sharing: React.FC<SharingProps> = ({slide}) => {
  const scrollRef = useRef<ScrollView>(null);
  const {t} = useTranslation('Component.Sharing');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const user = useUser();
  const session = useSessionState(state => state.asyncSession);
  const theme = useSessionState(state => state.exercise?.theme);
  const {getSharingPosts, getSharingPostForSession} = useSharingPosts(
    session?.exerciseId,
  );

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

  const [posts, setPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    getSharingPosts(slide.id, slide.sharingVideos).then(setPosts);
  }, [getSharingPosts, slide.id, slide.sharingVideos]);

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

  const renderItem = useCallback<ListRenderItem<PostItem>>(
    ({item, index}) => {
      if (item.type === 'text') {
        return (
          <ItemWrapper isLast={index === posts.length - 1}>
            <ListPostCard
              text={item.item.text}
              userProfile={item.item.userProfile}
            />
          </ItemWrapper>
        );
      }
      return (
        <ItemWrapper isLast={index === posts.length - 1}>
          <ListPostCard
            videoSource={item.item.video?.source}
            subtitles={item.item.video?.subtitles}
            userProfile={item.item.video?.profile ?? null}
          />
        </ItemWrapper>
      );
    },
    [posts],
  );

  const keyExtractor = useCallback(
    (item: PostItem) =>
      item.type === 'video' ? item.item.video!.source! : item.item.id,
    [],
  );

  return (
    <Wrapper>
      <ScrollView stickyHeaderIndices={[0]} ref={scrollRef}>
        <TopGradient colors={topGradientColors}>
          <Gutters>
            {posts.length > 0 && (
              <StickyHeader textColor={theme?.textColor}>
                {t('othersHeading')}
              </StickyHeader>
            )}
          </Gutters>
        </TopGradient>
        <Content>
          {posts.length > 0 && (
            <PostsList
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              horizontal
              data={posts}
              snapToAlignment="center"
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH + SPACINGS.SIXTEEN}
              showsHorizontalScrollIndicator={false}
            />
          )}

          <Gutters>
            {currentPostEvent ? (
              <>
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
          <Spacer60 />
          <Spacer8 />
        </Content>
      </ScrollView>
    </Wrapper>
  );
};

export default React.memo(Sharing);
