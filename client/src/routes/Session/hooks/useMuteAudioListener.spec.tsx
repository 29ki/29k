import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useTranslation} from 'react-i18next';

import useSessionState from '../state/state';

import {ExerciseState, Session} from '../../../../../shared/src/types/Session';
import {
  DailyContext,
  DailyProviderTypes,
} from '../../../lib/daily/DailyProvider';
import useMuteAudioListener from './useMuteAudioListener';
import useSessionExercise from './useSessionExercise';
import useSessionNotificationsState from '../state/sessionNotificationsState';
import useUserState from '../../../lib/user/state/state';

afterEach(() => {
  jest.clearAllMocks();
});

const mockToggleAudio = jest.fn();

jest.mock('../../../lib/daily/DailyProvider');
jest.mock('./useSessionExercise', () => jest.fn());

const mockUseSessionExercise = useSessionExercise as jest.Mock;
jest.mock('../../../common/components/Icons', () => ({
  MicrophoneOffIcon: 'MicOffIconComponent',
}));

describe('useMuteAudioListener', () => {
  const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
    <DailyContext.Provider
      value={{toggleAudio: mockToggleAudio} as unknown as DailyProviderTypes}>
      {children}
    </DailyContext.Provider>
  );

  describe('toggles audio', () => {
    it('should toggle audio when state is playing and current slide is not sharing', async () => {
      useSessionState.setState({
        session: {
          exerciseState: {playing: true} as ExerciseState,
        } as Session,
      });

      mockUseSessionExercise.mockReturnValue({
        slide: {current: {type: 'reflection'}},
      });

      renderHook(() => useMuteAudioListener(), {
        wrapper,
      });

      expect(mockToggleAudio).toHaveBeenCalledTimes(1);
    });

    it('should not toggle audio when state is not playing', async () => {
      useSessionState.setState({
        session: {
          exerciseState: {playing: false} as ExerciseState,
        } as Session,
      });

      mockUseSessionExercise.mockReturnValue({
        slide: {current: {type: 'reflection'}},
      });

      renderHook(() => useMuteAudioListener(), {
        wrapper,
      });

      expect(mockToggleAudio).toHaveBeenCalledTimes(0);
    });

    it('should not toggle audio when current slide is sharing', async () => {
      useSessionState.setState({
        session: {
          exerciseState: {playing: true} as ExerciseState,
        } as Session,
      });

      mockUseSessionExercise.mockReturnValue({
        slide: {current: {type: 'sharing'}},
      });

      renderHook(() => useMuteAudioListener(), {
        wrapper,
      });

      expect(mockToggleAudio).toHaveBeenCalledTimes(0);
    });
  });

  describe('triggers session notification', () => {
    const {t} = useTranslation();
    (t as jest.Mock).mockReturnValue('Some translation');

    beforeEach(() => {
      useSessionState.setState({
        session: {
          hostId: 'i-am-the-host-id',
          exerciseState: {playing: true} as ExerciseState,
        } as Session,
      });

      mockUseSessionExercise.mockReturnValue({
        slide: {current: {type: 'reflection'}},
      });
    });

    it('should trigger mute notification for host', async () => {
      useUserState.setState({
        user: {uid: 'i-am-the-host-id'} as FirebaseAuthTypes.User,
      });

      renderHook(() => useMuteAudioListener(), {
        wrapper,
      });

      expect(
        useSessionNotificationsState.getState().notifications,
      ).toContainEqual({
        text: 'Some translation',
        Icon: 'MicOffIconComponent',
      });
    });

    it('should not trigger mute notification for non-host participants', () => {
      useUserState.setState({
        user: {uid: 'im-not-the-host-id'} as FirebaseAuthTypes.User,
      });

      renderHook(() => useMuteAudioListener(), {
        wrapper,
      });

      expect(useSessionNotificationsState.getState().notifications).toEqual([]);
    });
  });
});
