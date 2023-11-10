import React, {useCallback} from 'react';
import {Dimensions, FlatList} from 'react-native';
import {PostItem} from '../../../../lib/posts/types/PostItem';
import styled from 'styled-components/native';
import ExerciseSharingPostCard from '../../../../lib/components/PostCard/ExerciseSharingPostCard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Spacer16} from '../../../../lib/components/Spacers/Spacer';
import {SPACINGS} from '../../../../lib/constants/spacings';
import {ModalStackProps} from '../../../../lib/navigation/constants/routes';

const SCREEN_DIMENSIONS = Dimensions.get('screen');
const CARD_WIDTH = SCREEN_DIMENSIONS.width * 0.6;
const CARD_HEIGHT = SCREEN_DIMENSIONS.height / 3;

const SharingPostWrapper = styled.View({
  width: CARD_WIDTH,
  height: CARD_HEIGHT,
});

const SharingPost: React.FC<{sharingPost: PostItem}> = ({sharingPost}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const onPress = useCallback(() => {
    navigate('SharingPostModal', {
      sharingPost,
      showRelated: true,
    });
  }, [navigate, sharingPost]);

  return (
    <SharingPostWrapper>
      <ExerciseSharingPostCard
        sharingPost={sharingPost}
        onPress={onPress}
        clip
      />
    </SharingPostWrapper>
  );
};

const renderSharingPost = ({item}: {item: PostItem}) => (
  <SharingPost sharingPost={item} />
);

type Props = {
  sharingPosts: PostItem[];
};
const SharingPosts: React.FC<Props> = ({sharingPosts}) => (
  <FlatList
    renderItem={renderSharingPost}
    horizontal
    data={sharingPosts}
    ListHeaderComponent={Spacer16}
    ItemSeparatorComponent={Spacer16}
    ListFooterComponent={Spacer16}
    snapToAlignment="center"
    decelerationRate="fast"
    snapToInterval={CARD_WIDTH + SPACINGS.SIXTEEN}
    showsHorizontalScrollIndicator={false}
  />
);

export default SharingPosts;
