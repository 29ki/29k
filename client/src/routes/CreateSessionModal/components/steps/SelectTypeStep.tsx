import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SessionType} from '../../../../../../shared/src/types/Session';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {
  LogoIcon,
  PrivateIcon,
  ProfileFillIcon,
  PublicIcon,
} from '../../../../lib/components/Icons';
import {
  Spacer16,
  Spacer28,
  Spacer8,
} from '../../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Body16} from '../../../../lib/components/Typography/Body/Body';
import {Display24} from '../../../../lib/components/Typography/Display/Display';
import {ModalHeading} from '../../../../lib/components/Typography/Heading/Heading';
import {SPACINGS} from '../../../../lib/constants/spacings';
import {StepProps} from '../../CreateSessionModal';
import Button from '../../../../lib/components/Buttons/Button';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ModalStackProps} from '../../../../lib/navigation/constants/routes';

const TypeItemWrapper = styled.View({
  flexDirection: 'row',
  height: 96,
  flex: 1,
});

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
  setSelectedType,
  nextStep,
  lastStep,
  isPublicHost,
  selectedExercise,
}) => {
  const {t} = useTranslation('Modal.CreateSession');
  const {navigate, popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();

  const renderIcon = useCallback((type: SessionType) => {
    switch (type) {
      case 'async':
        return <ProfileFillIcon />;
      case 'private':
        return <PrivateIcon />;
      default:
        return <PublicIcon />;
    }
  }, []);

  const sessionTypes = useMemo(
    () =>
      Object.values(SessionType)
        .filter(type => type !== 'public' || isPublicHost)
        .filter(type => type !== 'async' || !selectedExercise)
        .map((type, i, arr) => (
          <TypeItemWrapper key={i}>
            <TypeItem
              onPress={() => {
                setSelectedType(type);
                if (selectedExercise) {
                  // Already selected exercise, here to change type
                  lastStep();
                } else {
                  nextStep();
                }
              }}
              label={t(`selectType.${type}.title`)}
              Icon={renderIcon(type)}
            />
            {i < arr.length - 1 && <Spacer16 />}
          </TypeItemWrapper>
        )),
    [
      t,
      nextStep,
      lastStep,
      setSelectedType,
      renderIcon,
      isPublicHost,
      selectedExercise,
    ],
  );

  const onJoinByInvite = useCallback(() => {
    popToTop();
    navigate('AddSessionByInviteModal');
  }, [popToTop, navigate]);

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
      <Row>{sessionTypes}</Row>
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
