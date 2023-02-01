import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {View} from 'react-native';
import styled from 'styled-components/native';

import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';

import Image from '../../lib/components/Image/Image';
import SheetModal from '../../lib/components/Modals/SheetModal';
import {Spacer16, Spacer32, Spacer4} from '../../lib/components/Spacers/Spacer';
import {Display24} from '../../lib/components/Typography/Display/Display';
import {
  ModalStackProps,
  AppStackProps,
} from '../../lib/navigation/constants/routes';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import {formatExerciseName} from '../../lib/utils/string';
import {COLORS} from '../../../../shared/src/constants/colors';
import Markdown from '../../lib/components/Typography/Markdown/Markdown';
import Byline from '../../lib/components/Bylines/Byline';
import useUser from '../../lib/user/hooks/useUser';
import {CheckIcon} from '../../lib/components/Icons/Check/Check';
import {Body14} from '../../lib/components/Typography/Body/Body';
import useSessionStartTime from '../../lib/session/hooks/useSessionStartTime';
import Badge from '../../lib/components/Badge/Badge';
import {ProfileFillIcon, ProfileIcon} from '../../lib/components/Icons';

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const SpaceBetweenRow = styled(View)({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Row = styled(View)({
  flexDirection: 'row',
  alignItems: 'center',
});

const TitleContainer = styled.View({
  flex: 2,
});

const ImageContainer = styled(Image)({
  aspectRatio: '1',
  flex: 1,
  height: 90,
});

const ChekIconWrapper = styled(View)({
  width: 22,
  height: 22,
  alignSelf: 'center',
});

const AsyncSessionModal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<ModalStackProps, 'AsyncSessionModal'>>();
  const {t} = useTranslation('Modal.Session');
  const user = useUser();
  const sessionTime = dayjs(session.startTime);

  const navigation = useNavigation<NativeStackNavigationProp<AppStackProps>>();

  const exercise = useExerciseById(session?.contentId);

  if (!session || !exercise) {
    return null;
  }

  return (
    <SheetModal backgroundColor={COLORS.LIGHT_GREEN}>
      <Spacer16 />
      <Content>
        <SpaceBetweenRow>
          <TitleContainer>
            <Display24>{formatExerciseName(exercise)}</Display24>
            <Spacer4 />
            <Byline
              pictureURL={user?.photoURL ? user.photoURL : undefined}
              name={user?.displayName ? user.displayName : undefined}
            />
          </TitleContainer>
          <Spacer32 />
          <ImageContainer
            resizeMode="contain"
            source={{uri: exercise?.card?.image?.source}}
          />
        </SpaceBetweenRow>
      </Content>
      {exercise?.description && (
        <>
          <Spacer16 />
          <Gutters>
            <Markdown>{exercise?.description}</Markdown>
          </Gutters>
        </>
      )}
      <Spacer16 />
      <Gutters>
        <Row>
          <ChekIconWrapper>
            <CheckIcon fill={COLORS.PRIMARY} />
          </ChekIconWrapper>
          <Body14>{'Completed'}</Body14>
          <Spacer4 />
          <Badge
            text={sessionTime.format('ddd, D MMM')}
            Icon={<ProfileFillIcon />}
          />
        </Row>
      </Gutters>
    </SheetModal>
  );
};

export default AsyncSessionModal;
