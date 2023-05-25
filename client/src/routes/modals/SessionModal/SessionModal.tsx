import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Alert, Share, View} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import styled from 'styled-components/native';

import Button from '../../../lib/components/Buttons/Button';
import Gutters from '../../../lib/components/Gutters/Gutters';
import IconButton from '../../../lib/components/Buttons/IconButton/IconButton';
import {
  CommunityIcon,
  FriendsIcon,
  ShareIcon,
  AnimatedBell,
  AnimatedPlusToCheck,
} from '../../../lib/components/Icons';
import Image from '../../../lib/components/Image/Image';
import SheetModal from '../../../lib/components/Modals/SheetModal';
import {
  BottomSafeArea,
  Spacer16,
  Spacer32,
  Spacer4,
  Spacer8,
} from '../../../lib/components/Spacers/Spacer';
import {Display24} from '../../../lib/components/Typography/Display/Display';
import {
  ModalStackProps,
  AppStackProps,
} from '../../../lib/navigation/constants/routes';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useAddSessionToCalendar from '../../../lib/sessions/hooks/useAddSessionToCalendar';
import useSessionReminderNotification from '../../../lib/sessions/hooks/useSessionReminderNotification';
import {Body16} from '../../../lib/components/Typography/Body/Body';
import Byline from '../../../lib/components/Bylines/Byline';
import {formatContentName, formatInviteCode} from '../../../lib/utils/string';
import SessionTimeBadge from '../../../lib/components/SessionTimeBadge/SessionTimeBadge';
import {COLORS} from '../../../../../shared/src/constants/colors';
import useUser from '../../../lib/user/hooks/useUser';
import useSessions from '../../../lib/sessions/hooks/useSessions';
import {PencilIcon, CalendarIcon} from '../../../lib/components/Icons';
import TouchableOpacity from '../../../lib/components/TouchableOpacity/TouchableOpacity';
import DateTimePicker from '../../../lib/components/DateTimePicker/DateTimePicker';
import {updateSession} from '../../../lib/sessions/api/session';
import {
  LiveSessionType,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import EditSessionType from '../../../lib/components/EditSessionType/EditSessionType';
import {SPACINGS} from '../../../lib/constants/spacings';
import {ModalHeading} from '../../../lib/components/Typography/Heading/Heading';
import useLogSessionMetricEvents from '../../../lib/sessions/hooks/useLogSessionMetricEvents';
import Markdown from '../../../lib/components/Typography/Markdown/Markdown';
import useIsPublicHost from '../../../lib/user/hooks/useIsPublicHost';
import usePinSession from '../../../lib/sessions/hooks/usePinSession';
import useConfirmSessionReminder from '../../../lib/sessions/hooks/useConfirmSessionReminder';
import Tag from '../../../lib/components/Tag/Tag';
import useGetTagsById from '../../../lib/content/hooks/useGetTagsById';
import Interested from '../../../lib/components/Interested/Interested';
import AnimatedButton from '../../../lib/components/Buttons/AnimatedButton';
import AnimatedIconButton from '../../../lib/components/Buttons/IconButton/AnimatedIconButton';

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

const Content = styled(Gutters)({
  justifyContent: 'space-between',
});

const SpaceBetweenRow = styled(View)({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const Row = styled(View)({
  flexDirection: 'row',
  alignItems: 'flex-end',
});

const TitleContainer = styled.View({
  flex: 2,
});

const ImageContainer = styled(Image)({
  aspectRatio: '1',
  flex: 1,
  height: 90,
});

const EditButton = styled(TouchableOpacity)({
  flexDirection: 'row',
});

const EditIcon = styled(View)({
  width: 22,
  height: 22,
  alignSelf: 'center',
});

const DeleteButton = styled(Button)({
  backgroundColor: COLORS.DELETE,
});

const JourneyButton = styled(AnimatedButton)({
  alignSelf: 'flex-start',
});

const TypeItemWrapper = styled.View({
  flexDirection: 'row',
  height: 96,
  flex: 1,
});

const IconWrapper = styled.View({
  width: 30,
  height: 30,
});

const Tags = styled(Gutters)({
  flexWrap: 'wrap',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: -SPACINGS.FOUR,
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

const SessionModal = () => {
  const {
    params: {session: initialSessionData},
  } = useRoute<RouteProp<ModalStackProps, 'SessionModal'>>();

  const [session, setSession] = useState<LiveSessionType>(initialSessionData);

  const {t} = useTranslation('Modal.Session');
  const user = useUser();
  const isPublicHost = useIsPublicHost();
  const {deleteSession, fetchSessions} = useSessions();
  const [editMode, setEditMode] = useState(false);
  const [editTypeMode, setEditTypeMode] = useState(false);
  const [selectedType, setSelectedType] = useState(session?.type);

  const initialStartTime = dayjs(session.startTime).utc();
  const [sessionDateTime, setSessionDateTime] =
    useState<dayjs.Dayjs>(initialStartTime);
  const {togglePinned, isPinned} = usePinSession(session);
  const logSessionMetricEvent = useLogSessionMetricEvents();

  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackProps & ModalStackProps>>();

  const addToCalendar = useAddSessionToCalendar();
  const exercise = useExerciseById(session?.exerciseId);
  const tags = useGetTagsById(exercise?.tags);
  const {reminderEnabled, toggleReminder} =
    useSessionReminderNotification(session);
  const confirmToggleReminder = useConfirmSessionReminder(session);

  const startingNow = dayjs
    .utc()
    .isAfter(initialStartTime.subtract(10, 'minutes'));

  const isHost = user?.uid === session.hostId;

  const onJoin = useCallback(() => {
    logSessionMetricEvent('Join Sharing Session', session); // Log before navigating for correct Origin property in event
    navigation.popToTop();
    navigation.navigate('LiveSessionStack', {
      screen: 'ChangingRoom',
      params: {
        session: session,
      },
    });
  }, [navigation, session, logSessionMetricEvent]);

  const onAddToCalendar = useCallback(() => {
    if (session && exercise) {
      addToCalendar(
        exercise.name,
        session.hostProfile?.displayName,
        session.link,
        dayjs(session.startTime),
        dayjs(session.startTime).add(exercise.duration, 'minutes'),
      );
      logSessionMetricEvent('Add Sharing Session To Calendar', session);
    }
  }, [addToCalendar, exercise, session, logSessionMetricEvent]);

  const onToggleReminder = useCallback(() => {
    toggleReminder(!reminderEnabled);
    if (!reminderEnabled) {
      logSessionMetricEvent('Add Sharing Session Reminder', session);
    }
  }, [reminderEnabled, toggleReminder, session, logSessionMetricEvent]);

  const onShare = useCallback(() => {
    if (session.link) {
      Share.share({
        message: t('shareMessage', {
          link: session.link,
          code: formatInviteCode(session.inviteCode),
          interpolation: {escapeValue: false},
        }),
      });
    }
  }, [session.link, session.inviteCode, t]);

  const onDelete = useCallback(() => {
    Alert.alert(t('delete.header'), t('delete.text'), [
      {text: t('delete.buttons.cancel'), style: 'cancel', onPress: () => {}},
      {
        text: t('delete.buttons.confirm'),
        style: 'destructive',

        onPress: async () => {
          await deleteSession(session.id);
          navigation.popToTop();
        },
      },
    ]);
  }, [t, navigation, deleteSession, session.id]);

  const onUpdateSession = useCallback(async () => {
    const updatedSession = await updateSession(session.id, {
      startTime: sessionDateTime.utc().toISOString(),
      type: selectedType,
    });

    setSession(updatedSession);
    fetchSessions();
    setEditMode(false);
  }, [
    setSession,
    fetchSessions,
    setEditMode,
    session.id,
    selectedType,
    sessionDateTime,
  ]);

  const onChange = useCallback(
    (dateTime: dayjs.Dayjs) => setSessionDateTime(dateTime),
    [setSessionDateTime],
  );

  const onHostPress = useCallback(() => {
    navigation.popToTop();
    navigation.navigate('HostInfoModal', {host: session.hostProfile});
  }, [navigation, session.hostProfile]);

  const onEditMode = useCallback(() => setEditMode(true), [setEditMode]);

  const onEditType = useCallback(
    () => setEditTypeMode(true),
    [setEditTypeMode],
  );

  useEffect(() => {
    if (!editMode) {
      setEditTypeMode(false);
    }
  }, [editMode]);

  useEffect(() => {
    if (isHost) {
      // Allways try to set / update reminders for hosts
      confirmToggleReminder(true);
    }
  }, [isHost, confirmToggleReminder]);

  const sessionTypes = useMemo(
    () =>
      Object.values(SessionType).map((type, i, arr) => (
        <TypeItemWrapper key={i}>
          <TypeItem
            onPress={() => {
              setSelectedType(type);
              setEditTypeMode(false);
            }}
            label={t(`selectType.${type}.title`)}
            Icon={type === 'private' ? <FriendsIcon /> : <CommunityIcon />}
          />
          {i < arr.length - 1 && <Spacer16 />}
        </TypeItemWrapper>
      )),
    [t],
  );

  if (!session || !exercise) {
    return null;
  }

  return (
    <SheetModal backgroundColor={COLORS.CREAM}>
      <BottomSheetScrollView focusHook={useIsFocused}>
        <Spacer16 />
        {!editMode && (
          <>
            <Content>
              <SpaceBetweenRow>
                <TitleContainer>
                  <Display24>{formatContentName(exercise)}</Display24>
                  <Spacer4 />
                  <TouchableOpacity onPress={onHostPress}>
                    <Byline
                      pictureURL={session.hostProfile?.photoURL}
                      name={session.hostProfile?.displayName}
                      duration={exercise?.duration}
                    />
                  </TouchableOpacity>
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

            <Gutters>
              <Row>
                {startingNow && (
                  <>
                    <Button small variant="secondary" onPress={onJoin}>
                      {t('join')}
                    </Button>
                    <Spacer8 />
                  </>
                )}
                {isHost ? (
                  <SpaceBetweenRow>
                    <EditButton onPress={onEditMode}>
                      <SessionTimeBadge session={session} />
                      <EditIcon>
                        <PencilIcon />
                      </EditIcon>
                    </EditButton>
                    <Interested count={session.interestedCount} />
                  </SpaceBetweenRow>
                ) : (
                  <SessionTimeBadge session={session} />
                )}
              </Row>
              <Spacer16 />

              {!isHost && (
                <>
                  <JourneyButton
                    small
                    AnimatedIcon={AnimatedPlusToCheck}
                    fill={COLORS.WHITE}
                    onPress={togglePinned}
                    variant={isPinned ? 'primary' : 'secondary'}
                    active={isPinned}>
                    {t('journeyButton')}
                  </JourneyButton>

                  <Spacer32 />
                </>
              )}
            </Gutters>

            <Gutters>
              <Body16>{t('description')}</Body16>
              <Spacer16 />
              <Row>
                {!startingNow && (
                  <>
                    <IconButton
                      Icon={CalendarIcon}
                      variant={'secondary'}
                      onPress={onAddToCalendar}
                    />
                    <Spacer16 />
                  </>
                )}

                {session.link && (
                  <>
                    <IconButton
                      variant="secondary"
                      onPress={onShare}
                      Icon={ShareIcon}
                    />
                  </>
                )}
                {(isPinned || isHost) && (
                  <>
                    <Spacer16 />
                    <AnimatedIconButton
                      AnimatedIcon={AnimatedBell}
                      fill={COLORS.WHITE}
                      variant={reminderEnabled ? 'primary' : 'secondary'}
                      active={reminderEnabled}
                      onPress={onToggleReminder}
                    />
                  </>
                )}
              </Row>
            </Gutters>
          </>
        )}
        {editMode && (
          <Gutters>
            {editTypeMode && (
              <>
                <TypeItemHeading>{t('selectType.title')}</TypeItemHeading>
                <Spacer16 />
                <Row>{sessionTypes}</Row>
              </>
            )}
            {!editTypeMode && (
              <>
                {isPublicHost && (
                  <>
                    <EditSessionType
                      sessionType={selectedType}
                      onPress={onEditType}
                    />
                    <Spacer16 />
                  </>
                )}
                <DateTimePicker
                  initialDateTime={initialStartTime}
                  minimumDate={dayjs()}
                  onChange={onChange}
                />
                <Spacer16 />
                <SpaceBetweenRow>
                  <Button variant="secondary" onPress={onUpdateSession}>
                    {t('done')}
                  </Button>
                  <DeleteButton small onPress={onDelete}>
                    {t('deleteButton')}
                  </DeleteButton>
                </SpaceBetweenRow>
              </>
            )}
          </Gutters>
        )}
        <BottomSafeArea minSize={SPACINGS.THIRTYTWO} />
      </BottomSheetScrollView>
    </SheetModal>
  );
};

export default SessionModal;
