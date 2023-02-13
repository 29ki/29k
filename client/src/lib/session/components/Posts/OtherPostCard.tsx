import React, {useCallback, useMemo} from 'react';
import {Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {UserProfile} from '../../../../../../shared/src/types/User';
import TouchableOpacity from '../../../components/TouchableOpacity/TouchableOpacity';
import {Body14} from '../../../components/Typography/Body/Body';
import SETTINGS from '../../../constants/settings';
import {SPACINGS} from '../../../constants/spacings';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../navigation/constants/routes';
import BylineUser from '../../../components/Bylines/BylineUser';
import {Spacer8} from '../../../components/Spacers/Spacer';
import hexToRgba from 'hex-to-rgba';

const SharingCard = styled(TouchableOpacity)<{height: number}>(({height}) => ({
  backgroundColor: COLORS.CREAM,
  borderRadius: 24,
  height,
  width: 216,
  padding: SPACINGS.SIXTEEN,
  marginBottom: SPACINGS.TWENTYFOUR,
  ...SETTINGS.BOXSHADOW,
}));

const SharingText = styled(Body14)({
  flex: 1,
  width: '100%',
});

const BottomGradient = styled(LinearGradient)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 20,
  height: 40,
});

export const LARGE_HEIGHT = 280;
export const SMALL_HEIGHT = 216;

type OtherPostCardProps = {
  userProfile?: UserProfile;
  text: string;
};

const OtherPostCard: React.FC<OtherPostCardProps> = ({text, userProfile}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const screenHeight = Dimensions.get('screen').height;
  const cardHeight = screenHeight > 750 ? LARGE_HEIGHT : SMALL_HEIGHT;
  const numberOfLines = screenHeight > 750 ? 11 : 8;

  const onPress = useCallback(() => {
    navigate('SharingPostModal', {userProfile, text});
  }, [navigate, userProfile, text]);

  const gradientColors = useMemo(
    () => [hexToRgba(COLORS.CREAM, 0), hexToRgba(COLORS.CREAM, 1)],
    [],
  );

  return (
    <SharingCard onPress={onPress} height={cardHeight}>
      <BylineUser user={userProfile} />
      <Spacer8 />
      <SharingText numberOfLines={numberOfLines}>{text}</SharingText>
      <BottomGradient colors={gradientColors} />
    </SharingCard>
  );
};

export default OtherPostCard;
