import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
import Image from '../../../common/components/Image/Image';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {Display24} from '../../../common/components/Typography/Display/Display';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {RootStackProps} from '../../../common/constants/routes';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';
import useTemples from '../hooks/useTemples';
import {templeByIdSelector} from '../state/state';

const Content = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});
const BottomContent = styled.View({
  flex: 1,
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const ImageContainer = styled.View({
  flex: 1,
  height: 80,
});

const DeleteButton = styled(Button)({
  backgroundColor: COLORS.DELETE,
  justifySelf: 'flex-end',
});

const Title = styled(Display24)({
  flex: 2,
});

const TempleModal = () => {
  const {
    params: {templeId},
  } = useRoute<RouteProp<RootStackProps, 'TempleModal'>>();
  const {t} = useTranslation(NS.COMPONENT.TEMPLE_MODAL);
  const navigation = useNavigation();
  const {deleteTemple} = useTemples();
  const temple = useRecoilValue(templeByIdSelector(templeId));
  const exercise = useExerciseById(temple?.contentId);

  if (!temple || !exercise) {
    return null;
  }

  const onDelete = () => {
    Alert.alert(t('delete.header'), t('delete.text'), [
      {text: t('delete.buttons.cancel'), style: 'cancel', onPress: () => {}},
      {
        text: t('delete.buttons.confirm'),
        style: 'destructive',

        onPress: async () => {
          await deleteTemple(templeId);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <HalfModal>
      <Content>
        <Title>{exercise?.name}</Title>
        <ImageContainer>
          <Image
            resizeMode="contain"
            source={{uri: exercise?.card?.image?.source}}
          />
        </ImageContainer>
      </Content>
      <Spacer16 />
      <BottomContent>
        <DeleteButton small onPress={onDelete}>
          {t('deleteButton')}
        </DeleteButton>
      </BottomContent>
    </HalfModal>
  );
};

export default TempleModal;
