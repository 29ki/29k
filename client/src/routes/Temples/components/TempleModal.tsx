import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import {useRecoilValue} from 'recoil';
import styled from 'styled-components/native';
import Button from '../../../common/components/Buttons/Button';
import {DeleteIcon} from '../../../common/components/Icons';
import Image from '../../../common/components/Image/Image';
import HalfModal from '../../../common/components/Modals/HalfModal';
import {Spacer16} from '../../../common/components/Spacers/Spacer';
import {Display24} from '../../../common/components/Typography/Display/Display';
import {COLORS} from '../../../common/constants/colors';
import {RootStackProps} from '../../../common/constants/routes';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import NS from '../../../lib/i18n/constants/namespaces';
import useTemples from '../hooks/useTemples';
import {templeByIdSelector} from '../state/state';

const Container = styled.View<{backgroundColor?: string}>(
  ({backgroundColor}) => ({
    backgroundColor,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  }),
);

const Content = styled.View({
  flexDirection: 'row',
});

const ImageContainer = styled.View({
  width: 100,
  height: 100,
});

const DeleteButton = styled(Button)({
  backgroundColor: COLORS.DELETE,
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
      <Container>
        <Content>
          <Display24>{exercise?.name}</Display24>
          <ImageContainer>
            <Image source={{uri: exercise?.card?.image?.source}} />
          </ImageContainer>
        </Content>
        <Spacer16 />
        <DeleteButton elevated RightIcon={DeleteIcon} onPress={onDelete}>
          {t('deleteButton')}
        </DeleteButton>
      </Container>
    </HalfModal>
  );
};

export default TempleModal;
