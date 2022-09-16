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
  activeParticipantsAtom,
} from './state/state';
import useSetActiveParticipants from './hooks/useSetActiveParticipants';

export type DailyProviderTypes = {
  call?: DailyCall;
  preJoinMeeting: (url: string) => Promise<void>;
  joinMeeting: () => Promise<void>;
  leaveMeeting: () => Promise<void>;
  toggleAudio: (enabled: boolean) => void;
  toggleVideo: (enabled: boolean) => void;
  setUserName: (userName: string) => Promise<void>;
};

export const DailyContext = createContext<DailyProviderTypes>({
  preJoinMeeting: () => Promise.resolve(),
  joinMeeting: () => Promise.resolve(),
  leaveMeeting: () => Promise.resolve(),
  toggleAudio: () => {},
  toggleVideo: () => {},
  setUserName: () => Promise.resolve(),
});

const DailyProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [daily] = useState(() => Daily.createCallObject());

  const setIsLoading = useSetRecoilState(videoSharingFields('isLoading'));
  const setParticipants = useSetRecoilState(participantsAtom);
  const setActiveParticipant = useSetActiveParticipants();
  const resetParticipants = useResetRecoilState(participantsAtom);
  const resetVideoCallState = useResetRecoilState(videoSharingAtom);
  const resetActiveParticipants = useResetRecoilState(activeParticipantsAtom);

  const resetState = useCallback(() => {
    resetParticipants();
    resetVideoCallState();
    resetActiveParticipants();
  }, [resetParticipants, resetVideoCallState, resetActiveParticipants]);

  const eventHandlers = useMemo<Array<[DailyEvent, (obj: any) => void]>>(() => {
    const onParticipantJoined = ({
      participant,
    }: DailyEventObject<'participant-joined'>) => {
      setParticipants(participants => ({
        ...participants,
        [participant.user_id]: participant,
      }));
    };

    const onParticipantUpdated = ({
      participant,
    }: DailyEventObject<'participant-updated'>) => {
      setParticipants(participants => ({
        ...participants,
        [participant.user_id]: participant,
      }));
    };

    const onParticipantLeft = ({
      participant,
    }: DailyEventObject<'participant-left'>) => {
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
      ['participant-joined', onParticipantJoined],
      ['participant-left', onParticipantLeft],
      ['participant-updated', onParticipantUpdated],
      ['active-speaker-change', onActiveSpeakerChange],
      //   ['network-quality-change', connect(networkQualityChange)],
      //   ['error', error => dispatch(setError(error.errorMsg))],
    ];
  }, [setParticipants, setActiveParticipant]);

  const leaveMeeting = useCallback(async () => {
    if (!daily) {
      return;
    }

    await daily.leave();
  }, [daily]);

  const prepareMeeting = useCallback(
    async (url: string) => {
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

  const toggleAudio = useCallback(
    (enabled = true) => {
      if (!daily) {
        return;
      }
      daily.setLocalAudio(enabled);
    },
    [daily],
  );

  const toggleVideo = useCallback(
    (enabled = true) => {
      if (!daily) {
        return;
      }

      daily.setLocalVideo(enabled);
    },
    [daily],
  );

  const setUserName = useCallback(
    async (userName: string) => {
      if (!daily) {
        return;
      }

      await daily.setUserName(userName);
    },
    [daily],
  );

  const preJoinMeeting = useCallback(
    async (url: string) => {
      if (daily.meetingState() === 'new') {
        await prepareMeeting(url);
        await daily.startCamera({url});
      }
    },
    [daily, prepareMeeting],
  );

  const joinMeeting = useCallback(async () => {
    if (daily.meetingState() !== 'joined-meeting') {
      await daily.join();
    }
  }, [daily]);

  useEffect(() => {
    eventHandlers.forEach(([event, handler]) => {
      daily.on(event, handler);
    });

    return () => {
      eventHandlers.forEach(([event, handler]) => {
        daily.off(event, handler);
      });

      resetState();

      daily?.destroy();
    };
  }, [daily, eventHandlers, resetState]);

  return (
    <DailyContext.Provider
      value={{
        call: daily,
        preJoinMeeting,
        joinMeeting,
        leaveMeeting,
        toggleAudio,
        toggleVideo,
        setUserName,
      }}>
      {children}
    </DailyContext.Provider>
  );
};

export default DailyProvider;
