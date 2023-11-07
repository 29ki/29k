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

const Header = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const VideoWrapper = styled.View<{square: boolean}>(({square}) => ({
  flex: 1,
  backgroundColor: 'red',
  justifyContent: 'center',
  alignItems: 'center',
  aspectRatio: square ? 1 : undefined,
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
};

const SharingPostCard: React.FC<Props> = ({
  sharingPost,
  clip = false,
  backgroundColor = COLORS.WHITE,
}) => {
  const {t} = useTranslation('Component.SharingPostCard');
  const currentUser = useUser();

  const userProfile =
    sharingPost.type === 'text'
      ? sharingPost.item.userProfile
      : sharingPost.type === 'video'
      ? sharingPost.item.profile
      : sharingPost.type === 'post' && !sharingPost.payload.isAnonymous
      ? currentUser
      : undefined;

  const text =
    sharingPost.type === 'text'
      ? sharingPost.item.text
      : sharingPost.type === 'post'
      ? sharingPost.payload.text
      : undefined;

  const video =
    sharingPost.type === 'video' ? sharingPost.item.video : undefined;

  const previewImage = useMemo(() => ({uri: video?.preview}), [video]);

  return (
    <PostCard
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
