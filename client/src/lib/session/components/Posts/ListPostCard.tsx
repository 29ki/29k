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
import {Spacer4, Spacer8} from '../../../components/Spacers/Spacer';
import hexToRgba from 'hex-to-rgba';
import Badge from '../../../components/Badge/Badge';
import {EarthIcon, PrivateEyeIcon} from '../../../components/Icons';
import dayjs from 'dayjs';

export const CARD_WIDTH = 216;
const CARD_LARGE_HEIGHT = 280;
const CARD_SMALL_HEIGHT = 216;

const SharingCard = styled(TouchableOpacity)<{height: number}>(({height}) => ({
  backgroundColor: COLORS.CREAM,
  borderRadius: 24,
  height,
  width: CARD_WIDTH,
  padding: SPACINGS.SIXTEEN,
  marginBottom: SPACINGS.TWENTYFOUR,
  ...SETTINGS.BOXSHADOW,
}));

const SharingAttributesWrapper = styled.View({
  flexDirection: 'row',
});

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

type ListPostCardProps = {
  userProfile?: UserProfile;
  text: string;
  sharingAt?: string;
  isPublic?: boolean;
};

const ListPostCard: React.FC<ListPostCardProps> = ({
  text,
  userProfile,
  sharingAt,
  isPublic,
}) => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const screenHeight = Dimensions.get('screen').height;
  const cardHeight = screenHeight > 750 ? CARD_LARGE_HEIGHT : CARD_SMALL_HEIGHT;
  const numberOfLines = screenHeight > 750 ? 11 : 8;

  const onPress = useCallback(() => {
    navigate('SharingPostModal', {userProfile, text});
  }, [navigate, userProfile, text]);

  const gradientColors = useMemo(
    () => [hexToRgba(COLORS.CREAM, 0), hexToRgba(COLORS.CREAM, 1)],
    [],
  );

  const timeStamp = useMemo(() => {
    if (sharingAt) {
      return dayjs(sharingAt).local().format('ddd, D MMM');
    }
  }, [sharingAt]);

  return (
    <SharingCard onPress={onPress} height={cardHeight}>
      <BylineUser user={userProfile} />
      {timeStamp && (
        <>
          <Spacer4 />
          <SharingAttributesWrapper>
            <Badge
              IconAfter={isPublic ? <EarthIcon /> : <PrivateEyeIcon />}
              text={timeStamp}
            />
          </SharingAttributesWrapper>
        </>
      )}

      <Spacer8 />
      <SharingText numberOfLines={numberOfLines}>{text}</SharingText>
      <BottomGradient colors={gradientColors} />
    </SharingCard>
  );
};

export default React.memo(ListPostCard);
