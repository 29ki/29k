import hexToRgba from 'hex-to-rgba';
import React from 'react';
import {TouchableOpacityProps, View, ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {PlayfairDisplayRegular} from '../../constants/fonts';
import {SPACINGS} from '../../constants/spacings';
import {CameraIcon, ProfileIcon} from '../Icons';
import TouchableOpacity from '../TouchableOpacity/TouchableOpacity';

const Profile = styled(TouchableOpacity)<{
  size: number;
  backgroundColor?: string;
  hasError?: boolean;
}>(({size, backgroundColor, hasError}) => ({
  width: size,
  height: size,
  backgroundColor: backgroundColor ? backgroundColor : COLORS.PURE_WHITE,
  borderRadius: size / 2,
  aspectRatio: 1,
  alignItems: 'center',
  justifyContent: 'center',
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
  fontSize: size * 0.85,
  lineHeight: size - 2, // Compensate for the hasError border
  color: COLORS.BLACK,
  textAlign: 'center',
}));

const Image = styled.Image({
  width: '100%',
  height: '100%',
});

const ProfileIconContainer = styled.View<{size: number}>(({size}) => {
  const sizeStop = 32;
  const newSize = size > sizeStop ? size - (size - sizeStop) * 0.6 : size;
  return {
    width: newSize,
    height: newSize,
  };
});

const Spinner = styled.ActivityIndicator({
  position: 'absolute',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  backgroundColor: hexToRgba(COLORS.WHITE, 0.7),
});

const ActionIconContainer = styled.View<{size: number}>(({size}) => ({
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
  backgroundColor?: string;
  style?: ViewStyle;
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  size = 144,
  letter,
  pictureURL,
  hasError,
  loading,
  onPress,
  backgroundColor,
  style,
}) => {
  return (
    <View style={style}>
      <Profile
        size={size}
        hasError={hasError}
        onPress={onPress}
        disabled={!onPress}
        backgroundColor={backgroundColor}>
        {pictureURL ? (
          <Image source={{uri: pictureURL}} />
        ) : letter ? (
          <Letter size={size}>{letter[0].toUpperCase()}</Letter>
        ) : (
          <ProfileIconContainer size={size}>
            <ProfileIcon />
          </ProfileIconContainer>
        )}
        {loading && (
          <Spinner size={size < 40 ? 'small' : 'large'} color={COLORS.BLACK} />
        )}
      </Profile>
      {onPress && (
        <ActionIconContainer size={size}>
          <CameraIcon fill={COLORS.WHITE} />
        </ActionIconContainer>
      )}
    </View>
  );
};

export default ProfilePicture;
