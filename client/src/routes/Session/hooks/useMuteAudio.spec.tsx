import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';

import {
  DailyContext,
  DailyProviderTypes,
} from '../../../lib/daily/DailyProvider';
import useMuteAudio from './useMuteAudio';
import useSessionNotificationsState from '../state/sessionNotificationsState';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';

afterEach(() => {
  jest.clearAllMocks();
});

const mockMuteAll = jest.fn();

jest.mock('../../../lib/daily/DailyProvider');
jest.mock('./useSessionSlideState', () => jest.fn());

jest.mock('../../../lib/components/Icons', () => ({
  MicrophoneOffIcon: 'MicOffIconComponent',
}));

describe('useMuteAudioListener', () => {
  const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
    <DailyContext.Provider
      value={{muteAll: mockMuteAll} as unknown as DailyProviderTypes}>
      {children}
    </DailyContext.Provider>
  );

  describe('conditionallyMuteParticipants', () => {
    it('should toggle audio when state is playing and current slide is not sharing', async () => {
      const {t} = useTranslation();
      (t as unknown as jest.Mock).mockReturnValue('Some translation');

      const current = renderHook(() => useMuteAudio(), {
        wrapper,
      });

      current.result.current.conditionallyMuteParticipants(true, {
        type: 'reflection',
      } as ExerciseSlide);

      expect(mockMuteAll).toHaveBeenCalledTimes(1);
      expect(
        useSessionNotificationsState.getState().notifications,
      ).toContainEqual({
        text: 'Some translation',
        Icon: 'MicOffIconComponent',
      });
    });

    it('should not toggle audio when state is not playing', async () => {
      const {t} = useTranslation();
      (t as unknown as jest.Mock).mockReturnValue('Some translation');

      const current = renderHook(() => useMuteAudio(), {
        wrapper,
      });

      current.result.current.conditionallyMuteParticipants(false, {
        type: 'reflection',
      } as ExerciseSlide);

      expect(mockMuteAll).toHaveBeenCalledTimes(0);
      expect(useSessionNotificationsState.getState().notifications).toEqual([]);
    });

    it('should not toggle audio when current slide is sharing', async () => {
      const {t} = useTranslation();
      (t as unknown as jest.Mock).mockReturnValue('Some translation');

      const current = renderHook(() => useMuteAudio(), {
        wrapper,
      });

      current.result.current.conditionallyMuteParticipants(true, {
        type: 'sharing',
      } as ExerciseSlide);

      expect(mockMuteAll).toHaveBeenCalledTimes(0);
      expect(useSessionNotificationsState.getState().notifications).toEqual([]);
    });
  });
});
