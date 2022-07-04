import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import Daily, {
  DailyEvent,
  DailyEventObject,
} from '@daily-co/react-native-daily-js';

export const DailyContext = createContext({});

const logParticipants = ({participants}: DailyEventObject) => {
  console.log(participants);
};

const DailyProvider: React.FC = ({children}) => {
  const [daily] = useState(() => Daily.createCallObject());
  const [completedAuth, setCompletedAuth] = useState(false);
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const [shouldJoin, setShouldJoin] = useState(false);

  const eventHandlers = useMemo<Array<[DailyEvent, (obj: any) => void]>>(
    () => [
      ['joined-meeting', logParticipants],
      ['participant-joined', logParticipants],
      //   ['participant-left', connect(participantLeft)],
      //   ['participant-updated', connect(participantUpdated)],
      //   ['network-quality-change', connect(networkQualityChange)],
      //   ['error', error => dispatch(setError(error.errorMsg))],
    ],
    [],
  );

  useEffect(
    () => () => {
      daily?.destroy();
    },
    [daily],
  );

  const prepareMeeting = useCallback(() => {
    daily.preAuth({url: 'https://29k-testing.daily.co/FlNLdGKawgSt3ItIpOdB'});
    setCompletedAuth(true);
  }, [daily]);

  // Join when setup is complete and user is ready
  useEffect(() => {
    // Make sure we only continue if user has choosen to start meeting
    if (!shouldJoin) {
      return;
    }

    if (!completedAuth) {
      return;
    }

    if (!daily) {
      console.error(new Error('Tried to join meeting before it was prepared'));
      return;
    }

    const joinMeeting = async () => {
      eventHandlers.forEach(([event, handler]) => {
        daily.on(event, handler);
      });

      await daily.join();

      daily.setLocalVideo(hasVideo);
      daily.setLocalAudio(hasAudio);
    };

    joinMeeting();

    // Make sure we don't join multiple times
    setShouldJoin(false);
  }, [daily, eventHandlers, shouldJoin, hasVideo, hasAudio, completedAuth]);

  const leaveMeeting = useCallback(async () => {
    if (!daily) {
      return null;
    }

    await daily.leave();

    eventHandlers.forEach(([event, handler]) => {
      daily.off(event, handler);
    });
  }, [daily, eventHandlers]);

  const toggleAudio = () => {
    if (!daily) {
      return;
    }
    daily.setLocalAudio(!hasAudio);
    setHasAudio(!hasAudio);
  };

  const toggleVideo = () => {
    if (!daily) {
      return;
    }
    daily.setLocalVideo(!hasVideo);
    setHasVideo(!hasVideo);
  };

  const startMeeting = useCallback(async () => {
    setShouldJoin(true);
  }, [setShouldJoin]);

  return (
    <DailyContext.Provider
      value={{
        call: daily,
        prepareMeeting,
        startMeeting,
        leaveMeeting,
        toggleAudio,
        toggleVideo,
        hasAudio,
        hasVideo,
      }}>
      {children}
    </DailyContext.Provider>
  );
};

export default DailyProvider;
