import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SessionType} from '../../../../../../shared/src/types/Session';
import Byline from '../../../../common/components/Bylines/Byline';
import Gutters from '../../../../common/components/Gutters/Gutters';
import {PrivateIcon, PublicIcon} from '../../../../common/components/Icons';
import Image from '../../../../common/components/Image/Image';
import {
  Spacer16,
  Spacer28,
  Spacer8,
} from '../../../../common/components/Spacers/Spacer';
import TouchableOpacity from '../../../../common/components/TouchableOpacity/TouchableOpacity';
import {Body16} from '../../../../common/components/Typography/Body/Body';
import {Display24} from '../../../../common/components/Typography/Display/Display';
import {ModalHeading} from '../../../../common/components/Typography/Heading/Heading';
import {SPACINGS} from '../../../../common/constants/spacings';
import useExerciseById from '../../../../lib/content/hooks/useExerciseById';
import {StepProps} from '../../CreateSessionModal';

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
});

const CardImageWrapper = styled.View({
  width: 80,
  height: 80,
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
  selectedExercise,
  setSelectedType,
  nextStep,
  userProfile,
}) => {
  const exercise = useExerciseById(selectedExercise);
  const {t} = useTranslation('Modal.CreateSession');

  const sessionTypes = useMemo(
    () =>
      Object.values(SessionType).map((type, i, arr) => (
        <TypeItemWrapper key={i}>
          <TypeItem
            onPress={() => {
              setSelectedType(type);
              nextStep();
            }}
            label={t(`selectType.${type}.title`)}
            Icon={type === 'private' ? <PrivateIcon /> : <PublicIcon />}
          />
          {i < arr.length - 1 && <Spacer16 />}
        </TypeItemWrapper>
      )),
    [t, nextStep, setSelectedType],
  );

  const exerciseImg = useMemo(
    () => ({uri: exercise?.card?.image?.source}),
    [exercise],
  );

  return (
    <Gutters>
      <Spacer8 />
      <Row>
        <TextWrapper>
          <Display24>{exercise?.name}</Display24>
          <Spacer8 />
          <Byline
            pictureURL={userProfile.photoURL}
            name={userProfile.displayName}
          />
        </TextWrapper>
        <Spacer16 />
        <CardImageWrapper>
          <Image source={exerciseImg} />
        </CardImageWrapper>
      </Row>
      <Spacer28 />
      <TypeItemHeading>{t('selectType.title')}</TypeItemHeading>
      <Spacer16 />
      <Row>{sessionTypes}</Row>
    </Gutters>
  );
};

export default SelectTypeStep;
