import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';
import {TempleData} from '../../../../../shared/src/types/Temple';
import {participantsAtom, templeAtom} from '../state/state';
import useTempleParticipantSpotlight from './useTempleParticipantSpotlight';

describe('useTempleParticipantSpotlight', () => {
  it('returns the current participant spotlight', () => {
    const {result} = renderHook(() => useTempleParticipantSpotlight(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(templeAtom, {
            exerciseState: {
              dailySpotlightId: 'some-spotlight-user-id',
            },
          } as TempleData);

          set(participantsAtom, {
            'some-spotlight-user-id': {
              user_id: 'some-spotlight-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toEqual({user_id: 'some-spotlight-user-id'});
  });

  it('returns undefined when no dailySpotlightId is set', () => {
    const {result} = renderHook(() => useTempleParticipantSpotlight(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsAtom, {
            'some-spotlight-user-id': {
              user_id: 'some-spotlight-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toBe(undefined);
  });

  it('returns undefined when no matching participant', () => {
    const {result} = renderHook(() => useTempleParticipantSpotlight(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(templeAtom, {
            exerciseState: {
              dailySpotlightId: 'some-spotlight-user-id',
            },
          } as TempleData);

          set(participantsAtom, {
            'some-other-user-id': {
              user_id: 'some-other-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toBe(undefined);
  });
});
