import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, ListRenderItem, ScrollView} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import {ExerciseSlideSharingSlide} from '../../../../../../../shared/src/types/generated/Exercise';
import Button from '../../../../components/Buttons/Button';
import Gutters from '../../../../components/Gutters/Gutters';
import {PlusIcon} from '../../../../components/Icons';
import {
  BottomSafeArea,
  Spacer16,
  Spacer28,
} from '../../../../components/Spacers/Spacer';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../../navigation/constants/routes';
import useSessionSharingPosts from '../../../../posts/hooks/useSessionSharingPosts';
import useSessionState from '../../../state/state';
import {PostItem} from '../../../../posts/types/PostItem';
import SharingPostCard from '../../../../components/PostCard/SharingPostCard';
import AutoScrollView from '../../../../components/AutoScrollView/AutoScrollView';
import StickyHeading from '../../../../components/StickyHeading/StickyHeading';
import {Heading16} from '../../../../components/Typography/Heading/Heading';
import {SPACINGS} from '../../../../constants/spacings';
import {Display24} from '../../../../components/Typography/Display/Display';

const StyledDisplay = styled(Display24)<{textColor?: string}>(
  ({textColor}) => ({
    color: textColor ?? COLORS.BLACK,
  }),
);

const StyledHeading = styled(Heading16)<{textColor?: string}>(
  ({textColor}) => ({
    color: textColor ?? COLORS.BLACK,
  }),
);

const PostsList = styled(FlatList)({
  flexGrow: 0,
  width: '100%',
}) as unknown as FlatList;

const SCREEN_DIMENSIONS = Dimensions.get('screen');
const CARD_WIDTH = SCREEN_DIMENSIONS.width / 2;
const CARD_HEIGHT = SCREEN_DIMENSIONS.height / 3;

const CardWrapper = styled.View({
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
});

const ButtonWrapper = styled.View({flexDirection: 'row'});

type SharingProps = {
  slide: ExerciseSlideSharingSlide;
};

const Sharing: React.FC<SharingProps> = ({slide}) => {
  const scrollRef = useRef<ScrollView>(null);
  const {t} = useTranslation('Component.Sharing');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const session = useSessionState(state => state.asyncSession);
  const theme = useSessionState(state => state.exercise?.theme);
  const {getSharingPosts, getSharingPostForSession} = useSessionSharingPosts();

  const [posts, setPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    getSharingPosts(slide.id, slide.sharingVideos).then(setPosts);
  }, [getSharingPosts, slide.id, slide.sharingVideos]);

  const onAddSharing = useCallback(() => {
    if (session?.exerciseId) {
      navigate('SharingModal');
    }
  }, [session?.exerciseId, navigate]);

  const currentPostEvent = useMemo(() => {
    if (session?.id) {
      return getSharingPostForSession(session.id, slide.id);
    }
  }, [session?.id, slide.id, getSharingPostForSession]);

  const renderItem = useCallback<ListRenderItem<PostItem>>(
    ({item}) => (
      <CardWrapper>
        <SharingPostCard
          sharingPost={item}
          clip
          onPress={() => {
            navigate('SharingPostModal', {
              sharingPost: item,
            });
          }}
        />
      </CardWrapper>
    ),
    [navigate],
  );

  const keyExtractor = useCallback(
    (item: PostItem) =>
      item.type === 'video' ? item.item.video!.source! : item.item.id,
    [],
  );

  return (
    <AutoScrollView stickyHeaderIndices={[0, 3]} ref={scrollRef}>
      {posts.length > 0 && (
        <StickyHeading backgroundColor={theme?.backgroundColor}>
          <StyledHeading textColor={theme?.textColor}>
            {t('othersHeading')}
          </StyledHeading>
        </StickyHeading>
      )}
      {posts.length > 0 && (
        <PostsList
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          data={posts}
          ListHeaderComponent={Spacer16}
          ItemSeparatorComponent={Spacer16}
          ListFooterComponent={Spacer16}
          snapToAlignment="center"
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + SPACINGS.SIXTEEN}
          showsHorizontalScrollIndicator={false}
        />
      )}
      <Spacer16 />
      {currentPostEvent ? (
        <StickyHeading backgroundColor={theme?.backgroundColor}>
          <StyledHeading textColor={theme?.textColor}>
            {t('reflectionLabel')}
          </StyledHeading>
        </StickyHeading>
      ) : (
        <Gutters>
          <StyledDisplay textColor={theme?.textColor}>
            {slide.content?.heading}
          </StyledDisplay>
          <Spacer16 />
        </Gutters>
      )}
      <Gutters>
        {currentPostEvent ? (
          <SharingPostCard sharingPost={currentPostEvent} />
        ) : (
          <ButtonWrapper>
            <Button
              variant="secondary"
              onPress={onAddSharing}
              LeftIcon={PlusIcon}>
              {t('addReflectionCta')}
            </Button>
          </ButtonWrapper>
        )}
      </Gutters>
      <Spacer28 />
      <BottomSafeArea />
    </AutoScrollView>
  );
};

export default React.memo(Sharing);
