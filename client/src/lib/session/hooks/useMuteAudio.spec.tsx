import React from 'react';
import {renderHook} from '@testing-library/react-hooks';

import {
  DailyContext,
  DailyProviderTypes,
} from '../../../lib/daily/DailyProvider';
import useMuteAudio from './useMuteAudio';
import {ExerciseSlide} from '../../../../../shared/src/types/Content';

afterEach(() => {
  jest.clearAllMocks();
});

const mockMuteAll = jest.fn();

jest.mock('../../../lib/daily/DailyProvider');

describe('useMuteAudioListener', () => {
  const wrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
    <DailyContext.Provider
      value={{muteAll: mockMuteAll} as unknown as DailyProviderTypes}>
      {children}
    </DailyContext.Provider>
  );

  describe('conditionallyMuteParticipants', () => {
    it('should toggle audio when state is playing and current slide is not sharing', async () => {
      const current = renderHook(() => useMuteAudio(), {
        wrapper,
      });

      current.result.current.conditionallyMuteParticipants(true, {
        type: 'reflection',
      } as ExerciseSlide);

      expect(mockMuteAll).toHaveBeenCalledTimes(1);
    });

    it('should not toggle audio when state is not playing', async () => {
      const current = renderHook(() => useMuteAudio(), {
        wrapper,
      });

      current.result.current.conditionallyMuteParticipants(false, {
        type: 'reflection',
      } as ExerciseSlide);

      expect(mockMuteAll).toHaveBeenCalledTimes(0);
    });

    it('should not toggle audio when current slide is sharing', async () => {
      const current = renderHook(() => useMuteAudio(), {
        wrapper,
      });

      current.result.current.conditionallyMuteParticipants(true, {
        type: 'sharing',
      } as ExerciseSlide);

      expect(mockMuteAll).toHaveBeenCalledTimes(0);
    });
  });
});
