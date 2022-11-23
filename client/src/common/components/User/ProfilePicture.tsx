import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {CameraIcon} from '../Icons';
import Image from '../Image/Image';

const ImageContainer = styled.TouchableOpacity<{hasError?: boolean}>(
  ({hasError}) => ({
    backgroundColor: COLORS.GREYMEDIUM,
    width: '100%',
    height: '100%',
    borderRadius: 200,
    overflow: 'hidden',
    shadowColor: COLORS.GREYDARK,
    borderColor: hasError ? COLORS.ERROR : undefined,
    borderWidth: hasError ? 1 : undefined,
  }),
);

const IconContainer = styled.View({
  width: SPACINGS.THIRTYTWO,
  height: SPACINGS.THIRTYTWO,
  padding: SPACINGS.FOUR,
  backgroundColor: COLORS.BLACK,
  borderRadius: 200,
  position: 'absolute',
  right: 0,
  bottom: 0,
});

type ProfilePictureProps = {
  pictureURL?: string | null;
  hasError?: boolean;
  onPress: () => void;
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  pictureURL,
  hasError,
  onPress,
}) => {
  return (
    <View>
      <ImageContainer hasError={hasError} onPress={onPress}>
        {pictureURL && <Image source={{uri: pictureURL}} />}
      </ImageContainer>
      <IconContainer>
        <CameraIcon fill={COLORS.WHITE} />
      </IconContainer>
    </View>
  );
};

export default ProfilePicture;
