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
  DailyCall,
} from '@daily-co/react-native-daily-js';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {videoSharingFields, videoSharingParticipantsAtom} from './state/state';
import {values} from 'ramda';

type DailyProviderTypes = {
  call?: DailyCall;
  prepareMeeting: () => void;
  startMeeting: () => void;
  leaveMeeting: () => void;
};

export const DailyContext = createContext<DailyProviderTypes>({
  startMeeting: () => {},
  prepareMeeting: () => {},
  leaveMeeting: () => {},
});

const DailyProvider: React.FC = ({children}) => {
  const [daily] = useState(() => Daily.createCallObject());
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);
  const [shouldJoin, setShouldJoin] = useState(false);

  const setIsLoading = useSetRecoilState(videoSharingFields('isLoading'));
  const setParticipants = useSetRecoilState(videoSharingParticipantsAtom);
  const participants = useRecoilValue(videoSharingParticipantsAtom);

  const onJoinedMeeting = ({participants}: DailyEventObject) => {
    setParticipants(participants);
  };

  const onParticipantJoined = ({participant}: DailyEventObject) => {
    setParticipants(participants => ({
      ...participants,
      [participant.user_id]: participant,
    }));
  };

  const onParticipantUpdated = ({participant}: DailyEventObject) => {
    setParticipants(participants => ({
      ...participants,
      [participant.user_id]: participant,
    }));
  };

  const onParticipantLeft = ({participant}: DailyEventObject) => {
    const {[participant.user_id]: praticipantToRemove, ...otherParticipants} =
      participants;

    setParticipants(otherParticipants);
  };

  const eventHandlers = useMemo<Array<[DailyEvent, (obj: any) => void]>>(
    () => [
      ['joined-meeting', onJoinedMeeting],
      ['participant-joined', onParticipantJoined],
      ['participant-left', onParticipantLeft],
      ['participant-updated', onParticipantUpdated],
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
    setIsLoading(true);

    daily.preAuth({url: 'https://29k-testing.daily.co/I1s53jXePycRMHTAwcQC'}); // TODO should fetch url and token from function in the future

    setIsLoading(false);
  }, [daily]);

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
    eventHandlers.forEach(([event, handler]) => {
      daily.on(event, handler);
    });

    await daily.join();

    daily.setLocalAudio(false);
  }, []);

  return (
    <DailyContext.Provider
      value={{
        call: daily,
        prepareMeeting,
        startMeeting,
        leaveMeeting,
        // toggleAudio,
        // toggleVideo,
        // hasAudio,
        // hasVideo,
      }}>
      {children}
    </DailyContext.Provider>
  );
};

export default DailyProvider;
