import {RouteProp, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useCallback, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import styled from 'styled-components/native';

import Button from '../../lib/components/Buttons/Button';
import Gutters from '../../lib/components/Gutters/Gutters';

import Image from '../../lib/components/Image/Image';
import SheetModal from '../../lib/components/Modals/SheetModal';
import {Spacer16, Spacer32, Spacer4} from '../../lib/components/Spacers/Spacer';
import {Display24} from '../../lib/components/Typography/Display/Display';
import {ModalStackProps} from '../../lib/navigation/constants/routes';
import useExerciseById from '../../lib/content/hooks/useExerciseById';
import {formatExerciseName} from '../../lib/utils/string';
import {COLORS} from '../../../../shared/src/constants/colors';
import Markdown from '../../lib/components/Typography/Markdown/Markdown';
import Byline from '../../lib/components/Bylines/Byline';
import useUser from '../../lib/user/hooks/useUser';
import {CheckIcon} from '../../lib/components/Icons/Check/Check';
import {Body14} from '../../lib/components/Typography/Body/Body';
import Badge from '../../lib/components/Badge/Badge';
import {ProfileFillIcon} from '../../lib/components/Icons';
import useUserState, {
  getCompletedSessionByIdSelector,
} from '../../lib/user/state/state';
import useStartAsyncSession from '../../lib/session/hooks/useStartAsyncSession';

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

const ButtonWrapper = styled.View({flexDirection: 'row'});

const AsyncSessionModal = () => {
  const {
    params: {session},
  } = useRoute<RouteProp<ModalStackProps, 'AsyncSessionModal'>>();
  const {t} = useTranslation('Modal.AsyncSession');
  const user = useUser();
  const completedSession = useUserState(state =>
    getCompletedSessionByIdSelector(state, session.id),
  );
  const startSession = useStartAsyncSession();

  const sessionTime = useMemo(
    () => dayjs(completedSession?.completedAt),
    [completedSession?.completedAt],
  );

  const onStartSession = useCallback(() => {
    startSession(session.contentId);
  }, [session, startSession]);

  const exercise = useExerciseById(session?.contentId);
  if (!completedSession || !exercise) {
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
          <Body14>{t('completed')}</Body14>
          <Spacer4 />
          <Badge
            text={sessionTime.format('ddd, D MMM')}
            Icon={<ProfileFillIcon />}
          />
        </Row>
        <Spacer16 />
        <ButtonWrapper>
          <Button small variant="secondary" onPress={onStartSession}>
            {t('doAgainButton')}
          </Button>
        </ButtonWrapper>
      </Gutters>
    </SheetModal>
  );
};

export default AsyncSessionModal;
