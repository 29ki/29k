import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import AnimatedLottieView from 'lottie-react-native';

import styled from 'styled-components/native';
import {COLORS} from '../../../../../../../shared/src/constants/colors';
import {
  LiveSessionType,
  SessionMode,
  SessionType,
} from '../../../../../../../shared/src/schemas/Session';
import Gutters from '../../../../../lib/components/Gutters/Gutters';
import {
  CommunityIcon,
  FriendsIcon,
  MeIcon,
  LogoIconAnimated,
  ShareIcon,
} from '../../../../../lib/components/Icons';
import {
  Spacer12,
  Spacer16,
  Spacer24,
  Spacer28,
  Spacer4,
  Spacer8,
} from '../../../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Body16} from '../../../../../lib/components/Typography/Body/Body';
import {Display24} from '../../../../../lib/components/Typography/Display/Display';
import {SPACINGS} from '../../../../../lib/constants/spacings';
import {StepProps} from '../../CreateSessionModal';
import Button from '../../../../../lib/components/Buttons/Button';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import useGetExerciseById from '../../../../../lib/content/hooks/useGetExerciseById';
import {formatContentName} from '../../../../../lib/utils/string';
import Image from '../../../../../lib/components/Image/Image';
import {ActivityIndicator, ListRenderItem, Share} from 'react-native';
import SessionCard from '../../../../../lib/components/Cards/SessionCard/SessionCard';
import {Heading18} from '../../../../../lib/components/Typography/Heading/Heading';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {fetchSessions} from '../../../../../lib/sessions/api/sessions';
import {ModalStackProps} from '../../../../../lib/navigation/constants/routes';
import useStartAsyncSession from '../../../../../lib/session/hooks/useStartAsyncSession';
import Markdown from '../../../../../lib/components/Typography/Markdown/Markdown';
import useGetTagsById from '../../../../../lib/content/hooks/useGetTagsById';
import Tag from '../../../../../lib/components/Tag/Tag';
import IconButton from '../../../../../lib/components/Buttons/IconButton/IconButton';
import Byline from '../../../../../lib/components/Bylines/Byline';

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

const TypeItemHeading = styled(Body16)({
  textAlign: 'left',
});

const Row = styled.View({
  flexDirection: 'row',
});

const SpaceBetweenRow = styled(Row)({
  alignItems: 'center',
  justifyContent: 'space-between',
});

const CenteredRow = styled(Row)({
  alignItems: 'center',
  justifyContent: 'center',
});

const VCenteredRow = styled(Row)({
  alignItems: 'center',
});

const Lottie = styled(AnimatedLottieView)({
  aspectRatio: 1,
});

const LogoWrapper = styled.View({
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

const Spinner = styled(ActivityIndicator)({
  marginRight: -SPACINGS.EIGHT,
  marginLeft: SPACINGS.EIGHT,
});

const EmptyListContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

const Tags = styled.View({
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -SPACINGS.FOUR,
});

const SelectTypeStep: React.FC<StepProps> = ({
  setSelectedModeAndType,
  nextStep,
  isPublicHost,
  selectedExercise,
}) => {
  const {t} = useTranslation('Modal.CreateSession');
  const {navigate, popToTop} =
    useNavigation<NativeStackNavigationProp<ModalStackProps>>();
  const getExerciseById = useGetExerciseById();
  const startSession = useStartAsyncSession();
  const [sessions, setSessions] = useState<Array<LiveSessionType>>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const exercise = useMemo(
    () => (selectedExercise ? getExerciseById(selectedExercise) : null),
    [getExerciseById, selectedExercise],
  );

  useEffect(() => {
    if (exercise && exercise.live) {
      setIsLoadingSessions(true);
      fetchSessions(exercise.id).then(
        ([first, second, third, fourth, fifth, ..._] = []) => {
          setSessions([first, second, third, fourth, fifth].filter(Boolean));
          setIsLoadingSessions(false);
        },
      );
    }
  }, [setSessions, exercise, setIsLoadingSessions]);

  const exerciseImage = useMemo(
    () => (exercise?.card?.image ? {uri: exercise.card.image.source} : null),
    [exercise],
  );

  const exerciseLottie = useMemo(() => {
    if (exercise?.card?.lottie?.source) {
      return {uri: exercise?.card?.lottie?.source};
    }
  }, [exercise]);

  const tags = useGetTagsById(exercise?.tags);

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

  const onShare = useCallback(() => {
    if (exercise?.link) {
      Share.share({
        url: exercise.link,
      });
    }
  }, [exercise?.link]);

  const onStartPress = useCallback(() => {
    if (selectedExercise) {
      popToTop();
      startSession(selectedExercise);
    }
  }, [startSession, popToTop, selectedExercise]);

  const renderItem = useCallback<ListRenderItem<LiveSessionType>>(
    ({item, index}) => {
      const hasCardBefore = index > 0;
      const hasCardAfter = index !== sessions.length - 1;

      return (
        <Gutters>
          <SessionCard
            session={item}
            hasCardBefore={hasCardBefore}
            hasCardAfter={hasCardAfter}
            standAlone={false}
            onBeforeContextPress={popToTop}
          />
        </Gutters>
      );
    },
    [sessions, popToTop],
  );

  const keyExtractor = useCallback((item: LiveSessionType) => item.id, []);

  const typeSelection = useMemo(
    () => (
      <SpaceBetweenRow>
        {(!exercise || exercise.async) && (
          <TypeItemWrapper>
            <TypeItem
              onPress={onTypePress(SessionMode.async, SessionType.public)}
              label={t('selectType.async-public.title')}
              Icon={<MeIcon />}
            />
          </TypeItemWrapper>
        )}
        {(!exercise || exercise?.live) && (
          <TypeItemWrapper isLast={!isPublicHost}>
            <TypeItem
              onPress={onTypePress(SessionMode.live, SessionType.private)}
              label={t('selectType.live-private.title')}
              Icon={<FriendsIcon />}
            />
          </TypeItemWrapper>
        )}
        {isPublicHost && (!exercise || exercise?.live) && (
          <TypeItemWrapper isLast>
            <TypeItem
              onPress={onTypePress(SessionMode.live, SessionType.public)}
              label={t('selectType.live-public.title')}
              Icon={<CommunityIcon />}
            />
          </TypeItemWrapper>
        )}
      </SpaceBetweenRow>
    ),
    [exercise, isPublicHost, onTypePress, t],
  );

  if (exercise) {
    return (
      <>
        <BottomSheetFlatList
          data={sessions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={
            <EmptyListContainer>
              {isLoadingSessions && <Spinner color={COLORS.BLACK} />}
            </EmptyListContainer>
          }
          ListFooterComponent={
            <Gutters>
              {Boolean(exercise.coCreators?.length) && (
                <>
                  <Spacer24 />
                  {exercise.link && (
                    <>
                      <VCenteredRow>
                        <IconButton
                          variant="secondary"
                          onPress={onShare}
                          Icon={ShareIcon}
                        />
                        <Spacer8 />
                        <Body16>{t('shareHeading')}</Body16>
                      </VCenteredRow>
                      <Spacer24 />
                    </>
                  )}
                  <Heading18>{t('coCreatorsHeading')}</Heading18>
                  <Spacer8 />
                  {exercise.coCreators?.map(({name, avatar_url}, idx) => (
                    <>
                      <Byline
                        key={`${name}-${idx}`}
                        small
                        prefix={false}
                        pictureURL={avatar_url}
                        name={name}
                      />
                      <Spacer4 />
                    </>
                  ))}
                </>
              )}
            </Gutters>
          }
          ListHeaderComponent={
            <Gutters>
              <SpaceBetweenRow>
                <TextWrapper>
                  <Display24>{formatContentName(exercise)}</Display24>
                </TextWrapper>
                <Spacer16 />
                <LogoWrapper>
                  {exerciseLottie ? (
                    <Lottie source={exerciseLottie} autoPlay loop />
                  ) : exerciseImage ? (
                    <Image source={exerciseImage} />
                  ) : null}
                </LogoWrapper>
              </SpaceBetweenRow>
              {exercise.description && (
                <>
                  <Spacer16 />
                  <Markdown>{exercise.description}</Markdown>
                </>
              )}
              {tags && (
                <Tags>
                  {tags.map(({id, tag}) => (
                    <Fragment key={id}>
                      <Tag>{tag}</Tag>
                      <Spacer4 />
                    </Fragment>
                  ))}
                </Tags>
              )}

              {exercise.live ? (
                <>
                  <Spacer16 />
                  <TypeItemHeading>{t('description')}</TypeItemHeading>
                  <Spacer16 />
                  {typeSelection}
                  <Spacer24 />
                  {Boolean(sessions.length) && (
                    <>
                      <Heading18>{t('orJoinUpcoming')}</Heading18>
                      <Spacer16 />
                    </>
                  )}
                </>
              ) : (
                <>
                  <Spacer24 />
                  <Row>
                    <Button variant="secondary" onPress={onStartPress}>
                      {t('startCta')}
                    </Button>
                    <Spacer12 />
                    <IconButton
                      variant="secondary"
                      onPress={onShare}
                      Icon={ShareIcon}
                    />
                  </Row>
                </>
              )}
            </Gutters>
          }
        />
        <Spacer24 />
      </>
    );
  }

  return (
    <Gutters>
      <Spacer8 />
      <SpaceBetweenRow>
        <TextWrapper>
          <Display24>{t('description')}</Display24>
        </TextWrapper>
        <Spacer16 />
        <LogoWrapper>
          <LogoIconAnimated />
        </LogoWrapper>
      </SpaceBetweenRow>
      <Spacer28 />
      {typeSelection}
      <Spacer16 />
      <CenteredRow>
        <Body16>{t('or')}</Body16>
      </CenteredRow>
      <Spacer16 />
      <CenteredRow>
        <Button variant="secondary" onPress={onJoinByInvite}>
          {t('joinByInviteCta')}
        </Button>
      </CenteredRow>
    </Gutters>
  );
};

export default SelectTypeStep;
