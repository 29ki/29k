import React, {Dispatch, SetStateAction, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native-gesture-handler';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import styled from 'styled-components/native';
import Gutters from '../../../common/components/Gutters/Gutters';
import Image from '../../../common/components/Image/Image';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer24} from '../../../common/components/Spacers/Spacer';
import TouchableOpacity from '../../../common/components/TouchableOpacity/TouchableOpacity';
import {Body14} from '../../../common/components/Typography/Body/Body';
import {Display16} from '../../../common/components/Typography/Display/Display';
import {Heading16} from '../../../common/components/Typography/Heading/Heading';
import {COLORS} from '../../../common/constants/colors';
import SETTINGS from '../../../common/constants/settings';
import {SPACINGS} from '../../../common/constants/spacings';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';

const Content = styled(Gutters)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Card = styled(TouchableOpacity)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: SETTINGS.BORDER_RADIUS.CARDS,
  padding: SPACINGS.SIXTEEN,
  backgroundColor: COLORS.CREAM,
});

const ImageWrapper = styled.View({
  flex: 1,
  width: 80,
  height: 80,
});

const CardContent = styled.View({
  flex: 2,
});

const ListHeader = styled(Heading16)({
  alignSelf: 'center',
});

const Step = styled(Animated.View).attrs({
  entering: FadeIn.duration(300),
  exiting: FadeOut.duration(300),
})({
  flex: 1,
});

const ContentCard: React.FC<{id: string; onPress: () => void}> = ({
  id,
  onPress,
}) => {
  const exercise = useExerciseById(id);
  return (
    <Card onPress={onPress}>
      <CardContent>
        <Display16>{exercise?.name}</Display16>
        <Body14>{exercise?.id}</Body14>
      </CardContent>
      <ImageWrapper>
        <Image source={{uri: exercise?.card?.image?.source}} />
      </ImageWrapper>
    </Card>
  );
};

const SelectContent: React.FC<{setStep: Dispatch<SetStateAction<number>>}> = ({
  setStep,
}) => {
  const exercises = ['095f9642-73b6-4c9a-ae9a-ea7dea7363f5'];
  const {t} = useTranslation(NS.COMPONENT.CREATE_TEMPLE_MODAL);

  return (
    <Step>
      <FlatList
        ListHeaderComponent={
          <ListHeader>{t('selectContent.title')}</ListHeader>
        }
        keyExtractor={id => id}
        data={exercises}
        renderItem={({item}) => (
          <ContentCard onPress={() => setStep(1)} id={item} />
        )}
      />
    </Step>
  );
};
const SetDateTime = () => {
  const {t} = useTranslation(NS.COMPONENT.CREATE_TEMPLE_MODAL);

  return (
    <Step>
      <Heading16>{t('setDateTime.title')}</Heading16>
    </Step>
  );
};
const steps = [SelectContent, SetDateTime];

const CreateTempleModal = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const CurrentStepComponent = steps[currentStep];
  return (
    <HalfModal backgroundColor={COLORS.WHITE}>
      <Spacer24 />
      <Content>
        <CurrentStepComponent setStep={setCurrentStep} />
      </Content>
    </HalfModal>
  );
};

export default CreateTempleModal;
