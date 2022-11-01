import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import Image from '../../../common/components/Image/Image';

const ImageContainer = styled.TouchableOpacity({
  backgroundColor: COLORS.GREYMEDIUM,
  width: '100%',
  height: '100%',
  borderRadius: 200,
  overflow: 'hidden',
  shadowColor: COLORS.GREYDARK,
});

type ProfilePictureProps = {
  pictureURL?: string | null;
  onPress: () => void;
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  pictureURL,
  onPress,
}) => {
  return (
    <ImageContainer onPress={onPress}>
      {pictureURL && <Image source={{uri: pictureURL}} />}
    </ImageContainer>
  );
};

export default ProfilePicture;
