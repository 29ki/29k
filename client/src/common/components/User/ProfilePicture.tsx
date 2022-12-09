import React from 'react';
import {TouchableOpacityProps, View, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {PlayfairDisplayRegular} from '../../constants/fonts';
import {SPACINGS} from '../../constants/spacings';
import {CameraIcon} from '../Icons';
import Image from '../Image/Image';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';

const ImageContainer = styled(TouchableOpacity)<{hasError?: boolean}>(
  ({hasError}) => ({
    backgroundColor: COLORS.PURE_WHITE,
    borderRadius: 400,
    aspectRatio: 1,
    overflow: 'hidden',
    shadowColor: COLORS.GREYDARK,
    borderColor: hasError ? COLORS.ERROR : undefined,
    borderWidth: hasError ? 1 : undefined,
  }),
);

const Letter = styled.Text.attrs({
  adjustsFontSizeToFit: true,
  numberOfLines: 1,
})({
  flex: 1,
  top: '-3%', // Line height is a bit off in Playfair Display
  fontFamily: PlayfairDisplayRegular,
  fontSize: 100,
  color: COLORS.BLACK,
  textAlign: 'center',
});

const IconContainer = styled.View({
  width: '25%',
  height: '25%',
  padding: SPACINGS.FOUR,
  backgroundColor: COLORS.BLACK,
  borderRadius: 200,
  position: 'absolute',
  right: 0,
  bottom: 0,
});

type ProfilePictureProps = {
  letter?: string;
  pictureURL?: string | null;
  hasError?: boolean;
  onPress?: TouchableOpacityProps['onPress'];
  style?: ViewStyle;
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  letter,
  pictureURL,
  hasError,
  onPress,
  style,
}) => {
  return (
    <View style={style}>
      <ImageContainer hasError={hasError} onPress={onPress}>
        {pictureURL ? (
          <Image source={{uri: pictureURL}} />
        ) : (
          <Letter>{letter?.[0] || 'A'}</Letter>
        )}
      </ImageContainer>
      {onPress && (
        <IconContainer>
          <CameraIcon fill={COLORS.WHITE} />
        </IconContainer>
      )}
    </View>
  );
};

export default ProfilePicture;
