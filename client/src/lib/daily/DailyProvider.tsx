import {once} from 'ramda';
import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {Platform} from 'react-native';
import Daily, {
  DailyEvent,
  DailyEventObject,
  DailyCall,
  DailyCallOptions,
} from '@daily-co/react-native-daily-js';
import {isEmulator} from 'react-native-device-info';
import useDailyState from './state/state';
import Sentry from '../sentry';

export type DailyProviderTypes = {
  call?: DailyCall;
  hasCameraPermissions: () => boolean;
  hasMicrophonePermissions: () => boolean;
  preJoinMeeting: (url: string, token: string) => Promise<void>;
  joinMeeting: (options?: DailyCallOptions) => Promise<void>;
  leaveMeeting: () => Promise<void>;
  toggleAudio: (enabled: boolean) => void;
  toggleVideo: (enabled: boolean) => void;
  muteAll: () => void;
  setUserName: (userName: string) => Promise<void>;
  setUserData: (userData: unknown) => Promise<void>;
  setSubscribeToAllTracks: () => void;
};

export const DailyContext = createContext<DailyProviderTypes>({
  hasCameraPermissions: () => false,
  hasMicrophonePermissions: () => false,
  preJoinMeeting: () => Promise.resolve(),
  joinMeeting: () => Promise.resolve(),
  leaveMeeting: () => Promise.resolve(),
  toggleAudio: () => {},
  toggleVideo: () => {},
  muteAll: () => {},
  setUserName: () => Promise.resolve(),
  setUserData: () => Promise.resolve(),
  setSubscribeToAllTracks: () => {},
});

const DailyProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [daily] = useState(() => Daily.createCallObject());

  const resetState = useDailyState(state => state.reset);
  const setParticipant = useDailyState(state => state.setParticipant);
  const removeParticipant = useDailyState(state => state.removeParticipant);
  const setParticipantsSortOrder = useDailyState(
    state => state.setParticipantsSortOrder,
  );

  const eventHandlers = useMemo<Array<[DailyEvent, (obj: any) => void]>>(() => {
    const onParticipantJoined = ({
      participant,
    }: DailyEventObject<'participant-joined'>) => {
      setParticipant(participant.session_id, participant);
    };

    const onParticipantUpdated = ({
      participant,
    }: DailyEventObject<'participant-updated'>) => {
      setParticipant(participant.session_id, participant);
    };

    const onParticipantLeft = ({
      participant,
    }: DailyEventObject<'participant-left'>) => {
      removeParticipant(participant.session_id);
    };

    const onActiveSpeakerChange = ({
      activeSpeaker,
    }: DailyEventObject<'active-speaker-change'>) => {
      const {peerId} = activeSpeaker;
      setParticipantsSortOrder(peerId);
    };

    const onError = ({error}: DailyEventObject<'error'>) => {
      Sentry.captureException(error);
    };

    return [
      ['participant-joined', onParticipantJoined],
      ['participant-left', onParticipantLeft],
      ['participant-updated', onParticipantUpdated],
      ['active-speaker-change', onActiveSpeakerChange],
      ['error', onError],
      //   ['network-quality-change', connect(networkQualityChange)],
    ];
  }, [setParticipant, removeParticipant, setParticipantsSortOrder]);

  const leaveMeeting = useCallback(async () => {
    if (!daily) {
      return;
    }

    await daily.leave();
  }, [daily]);

  const prepareMeeting = useCallback(
    async (url: string, token: string) => {
      if (daily.meetingState() !== 'joined-meeting') {
        await daily.preAuth({
          url,
          token,
        });
      }
    },

    [daily],
  );

  const setSubscribeToAllTracks = useCallback(() => {
    if (!daily) {
      return;
    }
    daily.setSubscribeToTracksAutomatically(true);
  }, [daily]);

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

  const muteAll = useCallback(() => {
    if (!daily) {
      return;
    }

    const updates = Object.keys(daily.participants()).reduce(
      (acc, id) => ({...acc, [id]: {setAudio: false}}),
      {},
    );

    daily.updateParticipants(updates);
  }, [daily]);

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
    async (url: string, token: string) => {
      if (daily.meetingState() === 'new') {
        await prepareMeeting(url, token);
        await daily.startCamera({url});
      }
    },
    [daily, prepareMeeting],
  );

  const joinMeeting = useCallback(
    async (options?: DailyCallOptions) =>
      new Promise<void>(async resolve => {
        if (daily.meetingState() !== 'joined-meeting') {
          await daily.join(options);

          // TODO: Remove as soon as intro portal is separated from daily call
          if (Platform.OS === 'ios' && !(await isEmulator())) {
            /* This is a hack to let the audio input/output settle before resolving to not
            cause a race condition with react-native-video (or other sound sources) */
            const resolveOnce = once(() => resolve());

            // This might not fire when camera is off 🤷‍♂️
            daily.once('available-devices-updated', resolveOnce);

            // If the event never fires, resolve after 2 seconds - as a fallback
            setTimeout(resolveOnce, 2000);

            return;
          }

          resolve();
        }
      }),
    [daily],
  );

  const setUserData = useCallback(
    async (userData: unknown) => {
      await daily.setUserData(userData);
    },
    [daily],
  );

  const hasCameraPermissions = useCallback(
    () =>
      daily.participants().local?.tracks.video.blocked?.byPermissions !== true,
    [daily],
  );

  const hasMicrophonePermissions = useCallback(
    () =>
      daily.participants().local?.tracks.audio.blocked?.byPermissions !== true,
    [daily],
  );

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
        hasCameraPermissions,
        hasMicrophonePermissions,
        preJoinMeeting,
        joinMeeting,
        leaveMeeting,
        toggleAudio,
        toggleVideo,
        muteAll,
        setUserName,
        setUserData,
        setSubscribeToAllTracks,
      }}>
      {children}
    </DailyContext.Provider>
  );
};

export default DailyProvider;
