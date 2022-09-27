import React from 'react';
import {View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import Gutters from '../../../common/components/Gutters/Gutters';
import Image from '../../../common/components/Image/Image';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer24} from '../../../common/components/Spacers/Spacer';
import {Body14} from '../../../common/components/Typography/Body/Body';
import {Display16} from '../../../common/components/Typography/Display/Display';
import {COLORS} from '../../../common/constants/colors';
import SETTINGS from '../../../common/constants/settings';
import {SPACINGS} from '../../../common/constants/spacings';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';

const Content = styled(Gutters)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Card = styled.View({
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

const ContentCard: React.FC<{id: string}> = ({id}) => {
  const exercise = useExerciseById(id);

  return (
    <Card>
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

const ContentPickedModal = () => {
  const exercises = ['095f9642-73b6-4c9a-ae9a-ea7dea7363f5'];
  if (!exercises) {
    return null;
  }

  return (
    <HalfModal backgroundColor={COLORS.WHITE}>
      <Spacer24 />
      <Content>
        <FlatList
          keyExtractor={id => id}
          data={exercises}
          renderItem={({item}) => <ContentCard id={item} />}
        />
      </Content>
    </HalfModal>
  );
};

export default ContentPickedModal;
