import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/types/Session';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {
  CommunityIcon,
  LogoIcon,
  FriendsIcon,
  MeIcon,
} from '../../../../lib/components/Icons';
import {
  Spacer16,
  Spacer28,
  Spacer8,
} from '../../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {
  Body14,
  Body16,
  BodyBold,
} from '../../../../lib/components/Typography/Body/Body';
import {Display24} from '../../../../lib/components/Typography/Display/Display';
import {ModalHeading} from '../../../../lib/components/Typography/Heading/Heading';
import {SPACINGS} from '../../../../lib/constants/spacings';
import {StepProps} from '../../CreateSessionModal';
import Button from '../../../../lib/components/Buttons/Button';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../../../lib/navigation/constants/routes';
import useGetExercisesByMode from '../../../../lib/content/hooks/useGetExercisesByMode';
import useStartAsyncSession from '../../../../lib/session/hooks/useStartAsyncSession';

const TypeItemWrapper = styled.View<{isLast?: boolean}>(({isLast}) => ({
  flexDirection: 'row',
  height: 96,
  flex: 1,
  marginRight: !isLast ? SPACINGS.SIXTEEN : undefined,
}));

const TextWrapper = styled.View({
  flex: 2,
  paddingVertical: SPACINGS.SIXTEEN,
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

const TypeWrapper = styled(TouchableOpacity)({
  justifyContent: 'center',
  height: 96,
  flex: 1,
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: SPACINGS.SIXTEEN,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const TypeItemHeading = styled(ModalHeading)({
  textAlign: 'left',
  paddingHorizontal: SPACINGS.EIGHT,
});

const Row = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const Centered = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
});

const LogoWrapper = styled.View({
  width: 80,
  height: 80,
});

const ButtonWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

const TypeItem: React.FC<{
  Icon: React.ReactNode;
  label: string;
  onPress: () => void;
}> = ({Icon, label, onPress = () => {}}) => (
  <TypeWrapper onPress={onPress}>
    <IconWrapper>{Icon}</IconWrapper>
    <Body16>{label}</Body16>
  </TypeWrapper>
);

const SelectTypeStep: React.FC<StepProps> = ({
  setSelectedModeAndType,
  nextStep,
  isPublicHost,
  selectedExercise,
}) => {
  const {t} = useTranslation('Modal.CreateSession');
  const {navigate, popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const asyncExercises = useGetExercisesByMode(SessionMode.async);
  const startSession = useStartAsyncSession();

  const onJoinByInvite = useCallback(() => {
    popToTop();
    navigate('AddSessionByInviteModal');
  }, [popToTop, navigate]);

  const onTypePress = useCallback(
    (mode: SessionMode, type: SessionType) => () => {
      setSelectedModeAndType({mode, type});

      if (mode === SessionMode.async && selectedExercise) {
        popToTop();
        startSession(selectedExercise);
      } else {
        nextStep();
      }
    },
    [
      setSelectedModeAndType,
      nextStep,
      startSession,
      popToTop,
      selectedExercise,
    ],
  );

  return (
    <Gutters>
      <Spacer8 />
      <Row>
        <TextWrapper>
          <Display24>{t('description')}</Display24>
        </TextWrapper>
        <Spacer16 />
        <LogoWrapper>
          <LogoIcon />
        </LogoWrapper>
      </Row>
      <Spacer28 />
      <TypeItemHeading>{t('selectType.title')}</TypeItemHeading>
      <Spacer16 />
      <Row>
        {Boolean(asyncExercises.length) && (
          <TypeItemWrapper>
            <TypeItem
              onPress={onTypePress(SessionMode.async, SessionType.public)}
              label={t('selectType.async-public.title')}
              Icon={<MeIcon />}
            />
          </TypeItemWrapper>
        )}
        <TypeItemWrapper isLast={!isPublicHost}>
          <TypeItem
            onPress={onTypePress(SessionMode.live, SessionType.private)}
            label={t('selectType.live-private.title')}
            Icon={<FriendsIcon />}
          />
        </TypeItemWrapper>
        {isPublicHost && (
          <TypeItemWrapper isLast>
            <TypeItem
              onPress={onTypePress(SessionMode.live, SessionType.public)}
              label={t('selectType.live-public.title')}
              Icon={<CommunityIcon />}
            />
          </TypeItemWrapper>
        )}
      </Row>
      <Spacer16 />
      <Centered>
        <Body16>{t('or')}</Body16>
      </Centered>
      <Spacer16 />
      <ButtonWrapper>
        <Button variant="secondary" onPress={onJoinByInvite}>
          {t('joinByInviteCta')}
        </Button>
      </ButtonWrapper>
    </Gutters>
  );
};

export default SelectTypeStep;
