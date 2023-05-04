import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
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
  LogoIcon,
  FriendsIcon,
  MeIcon,
} from '../../../../../lib/components/Icons';
import {
  Spacer16,
  Spacer24,
  Spacer28,
  Spacer4,
  Spacer40,
  Spacer8,
} from '../../../../../lib/components/Spacers/Spacer';
import TouchableOpacity from '../../../../../lib/components/TouchableOpacity/TouchableOpacity';
import {Body16} from '../../../../../lib/components/Typography/Body/Body';
import {
  Display18,
  Display24,
} from '../../../../../lib/components/Typography/Display/Display';
import {SPACINGS} from '../../../../../lib/constants/spacings';
import {StepProps} from '../../CreateSessionModal';
import Button from '../../../../../lib/components/Buttons/Button';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import useGetExerciseById from '../../../../../lib/content/hooks/useGetExerciseById';
import {formatContentName} from '../../../../../lib/utils/string';
import Image from '../../../../../lib/components/Image/Image';
import {ActivityIndicator, ListRenderItem} from 'react-native';
import SessionCard from '../../../../../lib/components/Cards/SessionCard/SessionCard';
import {Heading16} from '../../../../../lib/components/Typography/Heading/Heading';
import {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {fetchSessions} from '../../../../../lib/sessions/api/sessions';
import {ModalStackProps} from '../../../../../lib/navigation/constants/routes';
import useStartAsyncSession from '../../../../../lib/session/hooks/useStartAsyncSession';
import Markdown from '../../../../../lib/components/Typography/Markdown/Markdown';
import useGetTagsById from '../../../../../lib/content/hooks/useGetTagsById';
import Tag from '../../../../../lib/components/Tag/Tag';

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

const Spinner = styled(ActivityIndicator)({
  marginRight: -SPACINGS.EIGHT,
  marginLeft: SPACINGS.EIGHT,
});

const EmptyListContainer = styled.View({
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  height: 200,
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

  useEffect(() => {
    if (selectedExercise) {
      setIsLoadingSessions(true);
      fetchSessions(selectedExercise).then(loadedSessions => {
        setSessions(loadedSessions);
        setIsLoadingSessions(false);
      });
    }
  }, [setSessions, setIsLoadingSessions, selectedExercise]);

  const exercise = useMemo(
    () => (selectedExercise ? getExerciseById(selectedExercise) : null),
    [getExerciseById, selectedExercise],
  );

  const exerciseImage = useMemo(
    () => (exercise?.card?.image ? {uri: exercise.card.image.source} : null),
    [exercise],
  );

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
      <Row>
        {(!exercise || exercise.async) && (
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
              {isLoadingSessions ? (
                <Spinner color={COLORS.BLACK} />
              ) : (
                <Display18>{t('noUpcomingSessions')}</Display18>
              )}
            </EmptyListContainer>
          }
          ListHeaderComponent={
            <Gutters>
              <Row>
                <TextWrapper>
                  <Display24>{formatContentName(exercise)}</Display24>
                </TextWrapper>
                <Spacer16 />
                <LogoWrapper>
                  {exerciseImage && <Image source={exerciseImage} />}
                </LogoWrapper>
              </Row>
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
              <Spacer16 />
              <TypeItemHeading>{t('description')}</TypeItemHeading>
              <Spacer16 />
              {typeSelection}
              <Spacer40 />
              <Heading16>{t('orJoinUpcoming')}</Heading16>
              <Spacer16 />
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
      {typeSelection}
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
