import React, {useCallback, useMemo, useState} from 'react';
import {Switch} from 'react-native';
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
import {EarthIcon, PrivateEyeIcon} from '../../../lib/components/Icons';
import useSessionSlideState from '../../../lib/session/hooks/useSessionSlideState';
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
import useSharingPosts from '../../../lib/posts/hooks/useSharingPosts';
import {ModalStackProps} from '../../../lib/navigation/constants/routes';

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

const IconWrapper = styled.View({
  height: 20,
  width: 20,
});

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

const AnonymousText = styled(Body16)({
  color: COLORS.BLACK,
});

const SharingModal = () => {
  const {
    params: {exerciseId},
  } = useRoute<RouteProp<ModalStackProps, 'SharingModal'>>();
  const {goBack} = useNavigation();
  const {t} = useTranslation('Modal.Sharing');
  const user = useUser();
  const sessionState = useSessionSlideState();
  const {addSharingPost} = useSharingPosts(exerciseId);
  const [isPublic, setIsPublic] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [text, setText] = useState('');

  const userProfile = useMemo(() => {
    if (user?.displayName) {
      return {
        displayName: user.displayName,
        photoURL: user?.photoURL ? user?.photoURL : undefined,
      };
    }
    return undefined;
  }, [user?.displayName, user?.photoURL]);

  const setPrivate = useCallback(() => {
    setIsPublic(false);
  }, []);

  const setPublic = useCallback(() => {
    setIsPublic(true);
  }, []);

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

  const trackColor = useMemo(() => ({true: COLORS.PRIMARY}), []);

  const onSubmit = useCallback(() => {
    if (sharingId) {
      addSharingPost(sharingId, text, isPublic, isAnonymous);
      goBack();
    }
  }, [addSharingPost, sharingId, isPublic, isAnonymous, text, goBack]);

  return (
    <SheetModal backgroundColor={COLORS.WHITE}>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <HeaderWrapper>
          <BodyBold>{t('header')}</BodyBold>
        </HeaderWrapper>
        <Spacer16 />
        <Gutters>
          <BylineUser user={userProfile} />
          <Spacer16 />
          <Body16>{t('description')}</Body16>
          <Spacer16 />
          <RadioButtonRow onPress={setPublic}>
            <ActionWrapper>
              <IconWrapper>
                <EarthIcon />
              </IconWrapper>
              <Spacer4 />
              <RadioButtonLabel>{t('publicLabel')}</RadioButtonLabel>
            </ActionWrapper>
            <RadioButton
              color={COLORS.BLACK}
              active={isPublic}
              onPress={setPublic}
            />
          </RadioButtonRow>
          <Spacer8 />
          <RadioButtonRow onPress={setPrivate}>
            <ActionWrapper>
              <IconWrapper>
                <PrivateEyeIcon />
              </IconWrapper>
              <Spacer4 />
              <RadioButtonLabel>{t('onlyMeLabel')}</RadioButtonLabel>
            </ActionWrapper>
            <RadioButton
              color={COLORS.BLACK}
              active={!isPublic}
              onPress={setPrivate}
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
          <Row>
            <Button
              variant="primary"
              disabled={text.length < 5}
              onPress={onSubmit}>
              {t('submitCta')}
            </Button>
            {isPublic && user?.displayName && (
              <ActionWrapper>
                <AnonymousText>{t('anonymousLabel')}</AnonymousText>
                <Spacer8 />
                <Switch
                  trackColor={trackColor}
                  onValueChange={setIsAnonymous}
                  value={isAnonymous}
                />
              </ActionWrapper>
            )}
          </Row>
        </Gutters>
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default React.memo(SharingModal);
