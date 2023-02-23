import hexToRgba from 'hex-to-rgba';
import React from 'react';
import {TouchableOpacityProps, View, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {PlayfairDisplayRegular} from '../../constants/fonts';
import {SPACINGS} from '../../constants/spacings';
import {CameraIcon} from '../Icons';
import Image from '../Image/Image';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';

const ImageContainer = styled(TouchableOpacity)<{
  size: number;
  hasError?: boolean;
}>(({size, hasError}) => ({
  width: size,
  height: size,
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: size / 2,
  aspectRatio: 1,
  overflow: 'hidden',
  shadowColor: COLORS.GREYDARK,
  borderColor: hasError ? COLORS.ERROR : undefined,
  borderWidth: hasError ? 1 : undefined,
}));

const Letter = styled.Text.attrs({
  adjustsFontSizeToFit: true,
  numberOfLines: 1,
})<{size: number}>(({size}) => ({
  flex: 1,
  fontFamily: PlayfairDisplayRegular,
  fontSize: size * 0.9,
  lineHeight: size,
  color: COLORS.BLACK,
  textAlign: 'center',
}));

const Spinner = styled.ActivityIndicator({
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundColor: hexToRgba(COLORS.WHITE, 0.7),
});

const IconContainer = styled.View<{size: number}>(({size}) => ({
  width: size * 0.25,
  height: size * 0.25,
  padding: SPACINGS.FOUR,
  backgroundColor: COLORS.BLACK,
  borderRadius: 200,
  position: 'absolute',
  right: 0,
  bottom: 0,
}));

type ProfilePictureProps = {
  size?: number;
  letter?: string;
  pictureURL?: string | null;
  hasError?: boolean;
  loading?: boolean;
  onPress?: TouchableOpacityProps['onPress'];
  style?: ViewStyle;
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  size = 144,
  letter,
  pictureURL,
  hasError,
  loading,
  onPress,
  style,
}) => {
  return (
    <View style={style}>
      <ImageContainer
        size={size}
        hasError={hasError}
        onPress={onPress}
        disabled={!onPress}>
        {pictureURL ? (
          <Image source={{uri: pictureURL}} />
        ) : (
          <Letter size={size}>{(letter?.[0] || 'A').toUpperCase()}</Letter>
        )}
        {loading && (
          <Spinner size={size < 40 ? 'small' : 'large'} color={COLORS.BLACK} />
        )}
      </ImageContainer>
      {onPress && (
        <IconContainer size={size}>
          <CameraIcon fill={COLORS.WHITE} />
        </IconContainer>
      )}
    </View>
  );
};

export default ProfilePicture;
