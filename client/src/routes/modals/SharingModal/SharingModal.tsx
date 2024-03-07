import React, {useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {
  BottomSheetTextInput,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';

import Button from '../../../lib/components/Buttons/Button';
import Gutters from '../../../lib/components/Gutters/Gutters';

import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  Spacer16,
  Spacer24,
  Spacer4,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import {COLORS} from '../../../../../shared/src/constants/colors';
import useUser from '../../../lib/user/hooks/useUser';
import {
  Body14,
  Body16,
  BodyBold,
} from '../../../lib/components/Typography/Body/Body';
import {PrivateEyeIcon, ProfileIcon} from '../../../lib/components/Icons';
import useAsyncSessionSlideState from '../../../lib/session/hooks/useAsyncSessionSlideState';
import BylineUser from '../../../lib/components/Bylines/BylineUser';
import {HKGroteskBold} from '../../../lib/constants/fonts';
import RadioButton from '../../../lib/components/Buttons/RadioButton/RadioButton';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import {ExerciseSlideSharingSlide} from '../../../../../shared/src/types/generated/Exercise';
import {SPACINGS} from '../../../lib/constants/spacings';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import useSessionSharingPosts from '../../../lib/posts/hooks/useSessionSharingPosts';
import {
  AppStackProps,
  ModalStackProps,
} from '../../../lib/navigation/constants/routes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import ProfilePicture from '../../../lib/components/User/ProfilePicture';

const HeaderWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const RadioButtonRow = styled(TouchableOpacity)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const Row = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ActionWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const IconWrapper = styled.View<{border?: boolean}>(({border}) => ({
  height: 21,
  width: 21,
  borderRadius: 21 / 2,
  borderWidth: border ? 1 : 0,
  borderColor: COLORS.BLACK,
}));

const RadioButtonLabel = styled(Body14)({
  fontFamily: HKGroteskBold,
});

const SharingInput = styled(BottomSheetTextInput)({
  borderRadius: SPACINGS.SIXTEEN,
  backgroundColor: COLORS.PURE_WHITE,
  padding: SPACINGS.SIXTEEN,
  fontSize: SPACINGS.SIXTEEN,
  height: 250,
});

const SharingModal = () => {
  const {
    params: {exerciseId},
  } = useRoute<RouteProp<ModalStackProps, 'SharingModal'>>();
  const {goBack, navigate} =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();
  const {t} = useTranslation('Modal.Sharing');
  const user = useUser();
  const sessionState = useAsyncSessionSlideState();
  const {addSharingPost} = useSessionSharingPosts(exerciseId);

  const userProfile = useMemo(() => {
    if (user?.uid && user?.displayName) {
      return {
        uid: user.uid,
        displayName: user.displayName,
        photoURL: user?.photoURL ? user?.photoURL : undefined,
      };
    }
  }, [user?.uid, user?.displayName, user?.photoURL]);

  const [isPublic, setIsPublic] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(!userProfile);
  const [text, setText] = useState('');

  const setVisibilty = useCallback(
    (makePublic: boolean, makeAnonymous: boolean) => () => {
      setIsPublic(makePublic);
      setIsAnonymous(makeAnonymous);
    },
    [],
  );

  const question = useMemo(() => {
    if (sessionState?.current.type === 'sharing') {
      const sharingSlide = sessionState.current as ExerciseSlideSharingSlide;
      return sharingSlide.content?.heading;
    }
  }, [sessionState]);

  const sharingId = useMemo(() => {
    if (sessionState?.current.type === 'sharing') {
      const sharingSlide = sessionState.current as ExerciseSlideSharingSlide;
      return sharingSlide.id;
    }
  }, [sessionState]);

  const onSubmit = useCallback(() => {
    if (sharingId) {
      addSharingPost(sharingId, text, isPublic, isAnonymous);
      goBack();
    }
  }, [addSharingPost, sharingId, isPublic, isAnonymous, text, goBack]);

  const onProfilePress = useCallback(() => {
    navigate('SimpleProfileSettingsModal');
  }, [navigate]);

  return (
    <SheetModal backgroundColor={COLORS.WHITE}>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <HeaderWrapper>
          <BodyBold>{t('header')}</BodyBold>
        </HeaderWrapper>
        <Spacer16 />
        <Gutters>
          <Row>
            <TouchableOpacity onPress={onProfilePress}>
              <BylineUser user={userProfile} />
            </TouchableOpacity>
            <Button
              variant="primary"
              size="small"
              disabled={text.length < 5}
              onPress={onSubmit}>
              {t('submitCta')}
            </Button>
          </Row>

          <Spacer16 />
          <Body16>{t('description')}</Body16>
          <Spacer16 />
          {user?.displayName && (
            <>
              <RadioButtonRow onPress={setVisibilty(true, false)}>
                <ActionWrapper>
                  <ProfilePicture
                    size={21}
                    pictureURL={user?.photoURL}
                    letter={user?.displayName?.[0]}
                    backgroundColor={COLORS.GREYLIGHTEST}
                  />
                  <Spacer4 />
                  <RadioButtonLabel>
                    {t('publicLabel', {displayName: user.displayName})}
                  </RadioButtonLabel>
                </ActionWrapper>
                <Spacer8 />
                <RadioButton
                  color={COLORS.BLACK}
                  active={isPublic && !isAnonymous}
                  onPress={setVisibilty(true, false)}
                />
              </RadioButtonRow>
              <Spacer8 />
            </>
          )}
          <RadioButtonRow onPress={setVisibilty(true, true)}>
            <ActionWrapper>
              <IconWrapper border>
                <ProfileIcon />
              </IconWrapper>
              <Spacer4 />
              <RadioButtonLabel>{t('anonymousLabel')}</RadioButtonLabel>
            </ActionWrapper>
            <RadioButton
              color={COLORS.BLACK}
              active={isPublic && isAnonymous}
              onPress={setVisibilty(true, true)}
            />
          </RadioButtonRow>
          <Spacer8 />
          <RadioButtonRow onPress={setVisibilty(false, true)}>
            <ActionWrapper>
              <IconWrapper>
                <PrivateEyeIcon />
              </IconWrapper>
              <Spacer4 />
              <RadioButtonLabel>{t('privateLabel')}</RadioButtonLabel>
            </ActionWrapper>
            <RadioButton
              color={COLORS.BLACK}
              active={!isPublic}
              onPress={setVisibilty(false, true)}
            />
          </RadioButtonRow>
          <Spacer24 />

          <Display24>{question}</Display24>

          <Spacer16 />

          <SharingInput
            editable
            multiline
            value={text}
            onChangeText={setText}
            textAlignVertical="top"
          />
          <Spacer16 />
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default React.memo(SharingModal);
