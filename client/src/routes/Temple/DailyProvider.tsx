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
  localParticipantAtom,
} from './state/state';

type DailyProviderTypes = {
  call?: DailyCall;
  preJoinMeeting: (url: string) => Promise<void>;
  joinMeeting: () => Promise<void>;
  leaveMeeting: () => Promise<void>;
  toggleAudio: () => void;
  toggleVideo: () => void;
  setUserName: (userName: string) => Promise<void>;
  hasAudio: boolean;
  hasVideo: boolean;
};

export const DailyContext = createContext<DailyProviderTypes>({
  preJoinMeeting: () => Promise.resolve(),
  joinMeeting: () => Promise.resolve(),
  leaveMeeting: () => Promise.resolve(),
  toggleAudio: () => {},
  toggleVideo: () => {},
  setUserName: () => Promise.resolve(),
  hasAudio: false,
  hasVideo: false,
});

const DailyProvider: React.FC = ({children}) => {
  const [daily] = useState(() => Daily.createCallObject());
  const [hasAudio, setHasAudio] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);

  const setIsLoading = useSetRecoilState(videoSharingFields('isLoading'));
  const setLocalParticipant = useSetRecoilState(localParticipantAtom);
  const setParticipants = useSetRecoilState(participantsAtom);
  const setActiveParticipant = useSetRecoilState(activeParticipantAtom);
  const resetParticipants = useResetRecoilState(participantsAtom);
  const resetVideoCallState = useResetRecoilState(videoSharingAtom);

  const eventHandlers = useMemo<Array<[DailyEvent, (obj: any) => void]>>(() => {
    const onJoinedMeeting = ({
      participants,
    }: DailyEventObject<'joined-meeting'>) => {
      setParticipants(participants);
    };

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
      console.log('UPDATING', participant.user_id);
      if (participant.local) {
        setLocalParticipant(participant);
      }

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
      ['joined-meeting', onJoinedMeeting],
      ['participant-joined', onParticipantJoined],
      ['participant-left', onParticipantLeft],
      ['participant-updated', onParticipantUpdated],
      ['active-speaker-change', onActiveSpeakerChange],
      //   ['network-quality-change', connect(networkQualityChange)],
      //   ['error', error => dispatch(setError(error.errorMsg))],
    ];
  }, [setParticipants, setActiveParticipant, setLocalParticipant]);

  const leaveMeeting = useCallback(async () => {
    if (!daily) {
      return;
    }

    await daily.leave();

    resetParticipants();
    resetVideoCallState();
  }, [daily, resetParticipants, resetVideoCallState]);

  useEffect(() => {
    console.log('EVENT HANDLERS');
    eventHandlers.forEach(([event, handler]) => {
      daily.on(event, handler);
    });

    return () => {
      console.log('DESTROY');
      eventHandlers.forEach(([event, handler]) => {
        daily.off(event, handler);
      });

      daily?.destroy();
    };
  }, [daily, eventHandlers]);

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

  const setUserName = async (userName: string) => {
    if (!daily) {
      return;
    }

    await daily.setUserName(userName);
  };

  const preJoinMeeting = useCallback(
    async url => {
      console.log('STATE', daily.meetingState());
      if (daily.meetingState() === 'new') {
        console.log('PRE JOIN');
        await prepareMeeting(url);
        await daily.startCamera();
      }
    },
    [daily, prepareMeeting],
  );

  const joinMeeting = useCallback(async () => {
    if (daily.meetingState() !== 'joined-meeting') {
      await daily.join();
    }
  }, [daily]);

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
        hasAudio,
        hasVideo,
      }}>
      {children}
    </DailyContext.Provider>
  );
};

export default DailyProvider;
