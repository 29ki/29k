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
import {
  videoSharingFields,
  participantsAtom,
  videoSharingAtom,
  activeParticipantAtom,
} from './state/state';

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
  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);

  const setIsLoading = useSetRecoilState(videoSharingFields('isLoading'));
  const setIsJoined = useSetRecoilState(videoSharingFields('isJoined'));
  const setParticipants = useSetRecoilState(participantsAtom);
  const setActiveParticipant = useSetRecoilState(activeParticipantAtom);
  const resetParticipants = useResetRecoilState(participantsAtom);
  const resetVideoCallState = useResetRecoilState(videoSharingAtom);

  const eventHandlers = useMemo<Array<[DailyEvent, (obj: any) => void]>>(() => {
    const onJoinedMeeting = ({participants}: DailyEventObject) => {
      setIsJoined(true);
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

    const onActiveSpeakerChange = ({
      activeSpeaker,
    }: DailyEventObject<'active-speaker-change'>) => {
      const {peerId} = activeSpeaker;
      setActiveParticipant(peerId);
    };

    return [
      ['joined-meeting', onJoinedMeeting],
      ['participant-joined', onParticipantJoined],
      ['participant-left', onParticipantLeft],
      ['participant-updated', onParticipantUpdated],
      ['active-speaker-change', onActiveSpeakerChange],
      //   ['network-quality-change', connect(networkQualityChange)],
      //   ['error', error => dispatch(setError(error.errorMsg))],
    ];
  }, [setParticipants, setIsJoined, setActiveParticipant]);

  const leaveMeeting = useCallback(async () => {
    if (!daily) {
      return null;
    }

    await daily.leave();

    eventHandlers.forEach(([event, handler]) => {
      daily.off(event, handler);
    });

    resetParticipants();
    resetVideoCallState();
  }, [daily, eventHandlers, resetParticipants, resetVideoCallState]);

  useEffect(
    () => () => {
      daily?.destroy();
    },
    [daily],
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
