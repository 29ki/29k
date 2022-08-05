import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {omit} from 'ramda';
import Daily, {
  DailyEvent,
  DailyEventObject,
  DailyCall,
} from '@daily-co/react-native-daily-js';
import {useResetRecoilState, useSetRecoilState} from 'recoil';
import {videoSharingFields, participantsAtom} from './state/state';

type DailyProviderTypes = {
  call?: DailyCall;
  prepareMeeting: (url: string) => void;
  startMeeting: () => void;
  leaveMeeting: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  hasAudio: boolean;
  hasVideo: boolean;
};

export const DailyContext = createContext<DailyProviderTypes>({
  startMeeting: () => {},
  prepareMeeting: () => {},
  leaveMeeting: () => {},
  toggleAudio: () => {},
  toggleVideo: () => {},
  hasAudio: false,
  hasVideo: false,
});

const DailyProvider: React.FC = ({children}) => {
  const [daily] = useState(() => Daily.createCallObject());
  const [hasAudio, setHasAudio] = useState(true);
  const [hasVideo, setHasVideo] = useState(true);

  const setIsLoading = useSetRecoilState(videoSharingFields('isLoading'));
  const setParticipants = useSetRecoilState(participantsAtom);
  const resetVideoCall = useResetRecoilState(participantsAtom);

  const eventHandlers = useMemo<Array<[DailyEvent, (obj: any) => void]>>(() => {
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
      setParticipants(participants =>
        omit([participant.user_id], participants),
      );
    };
    return [
      ['joined-meeting', onJoinedMeeting],
      ['participant-joined', onParticipantJoined],
      ['participant-left', onParticipantLeft],
      ['participant-updated', onParticipantUpdated],
      //   ['network-quality-change', connect(networkQualityChange)],
      //   ['error', error => dispatch(setError(error.errorMsg))],
    ];
  }, [setParticipants]);

  const leaveMeeting = useCallback(async () => {
    if (!daily) {
      return null;
    }

    await daily.leave();

    eventHandlers.forEach(([event, handler]) => {
      daily.off(event, handler);
    });

    resetVideoCall();
  }, [daily, eventHandlers, resetVideoCall]);

  useEffect(
    () => () => {
      leaveMeeting();
      daily?.destroy();
    },
    [daily, leaveMeeting],
  );
  const prepareMeeting = useCallback(
    async url => {
      if (daily.meetingState() !== 'joined-meeting') {
        setIsLoading(true);

        await daily.preAuth({
          url, // TODO should fetch also token from function in the future
        });
        setIsLoading(false);
      }
    },
    [daily, setIsLoading],
  );

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

    daily.setLocalAudio(hasAudio);
    daily.setLocalVideo(hasVideo);
  }, [daily, eventHandlers, hasAudio, hasVideo]);

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
