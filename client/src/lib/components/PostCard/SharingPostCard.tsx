import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {PostEvent} from '../../../../../shared/src/types/Event';
import {Body16} from '../Typography/Body/Body';
import PostCard from './PostCard';
import useUser from '../../user/hooks/useUser';
import {PostItem} from '../../posts/types/PostItem';
import BylineUser from '../Bylines/BylineUser';
import {Spacer16, Spacer4} from '../Spacers/Spacer';
import styled from 'styled-components/native';
import {EarthIcon, PlayIcon, PrivateEyeIcon} from '../Icons';
import Badge from '../Badge/Badge';
import {useTranslation} from 'react-i18next';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Image from '../Image/Image';
import hexToRgba from 'hex-to-rgba';
import PostRelates from '../../relates/PostRelates';

const Header = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Relates = styled(PostRelates)(({interactive}) => ({
  position: interactive ? 'relative' : 'absolute',
  right: interactive ? 0 : 16,
  bottom: interactive ? 0 : 16,
  paddingTop: 16,
  zIndex: 1,
  alignSelf: 'flex-end',
}));

const VideoWrapper = styled.View<{square: boolean}>(({square}) => ({
  flex: 1,
  backgroundColor: 'red',
  justifyContent: 'center',
  alignItems: 'center',
  aspectRatio: square ? '1' : undefined,
  borderRadius: 16,
  overflow: 'hidden',
}));

const PreviewImage = styled(Image)({
  ...StyleSheet.absoluteFillObject,
  backgroundColor: COLORS.BLACK,
});

const PlayIconWrapper = styled.View({
  height: 60,
});

type Props = {
  sharingPost: PostItem | PostEvent;
  clip?: boolean;
  backgroundColor?: string;
  onPress?: () => void;
};

const SharingPostCard: React.FC<Props> = ({
  sharingPost,
  clip = false,
  backgroundColor = COLORS.WHITE,
  onPress,
}) => {
  const {t} = useTranslation('Component.SharingPostCard');
  const currentUser = useUser();

  const {type} = sharingPost;

  const userProfile =
    type === 'text'
      ? sharingPost.item.userProfile
      : type === 'video'
        ? sharingPost.item.profile
        : sharingPost.type === 'post' && !sharingPost.payload.isAnonymous
          ? currentUser
          : undefined;

  const text =
    type === 'text'
      ? sharingPost.item.text
      : type === 'post'
        ? sharingPost.payload.text
        : undefined;

  const video = type === 'video' ? sharingPost.item.video : undefined;

  const previewImage = useMemo(() => ({uri: video?.preview}), [video]);

  return (
    <PostCard
      onPress={onPress}
      backgroundColor={backgroundColor}
      clip={sharingPost.type !== 'video' && clip}>
      <Header>
        <BylineUser user={userProfile} />
        <Spacer4 />
        {sharingPost.type === 'post' && (
          <Badge
            IconBefore={
              sharingPost.payload.isPublic ? <EarthIcon /> : <PrivateEyeIcon />
            }
            text={
              sharingPost.payload.isPublic
                ? t('everyoneLabel')
                : t('onlyMeLabel')
            }
          />
        )}
      </Header>
      <Spacer16 />
      {text && <Body16>{text}</Body16>}
      {type === 'text' && (
        <Relates post={sharingPost.item} interactive={!clip} />
      )}
      {video && (
        <VideoWrapper square={!clip}>
          <PreviewImage source={previewImage} />
          <PlayIconWrapper>
            <PlayIcon fill={hexToRgba(COLORS.PURE_WHITE, 0.51)} />
          </PlayIconWrapper>
        </VideoWrapper>
      )}
    </PostCard>
  );
};

export default SharingPostCard;
