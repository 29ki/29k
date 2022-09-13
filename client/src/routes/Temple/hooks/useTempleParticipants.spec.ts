import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';
import {Temple} from '../../../../../shared/src/types/Temple';
import {participantsAtom, templeAtom} from '../state/state';
import useTempleExercise from './useTempleExercise';
import useTempleParticipants from './useTempleParticipants';

const mockUseTempleExercise = useTempleExercise as jest.Mock;
jest.mock('./useTempleExercise');

describe('useTempleParticipants', () => {
  it('filter participants if participant is on spotlight', () => {
    mockUseTempleExercise.mockReturnValue({
      slide: {current: {type: 'participantSpotlight'}},
    });

    const {result} = renderHook(() => useTempleParticipants(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(templeAtom, {
            exerciseState: {
              dailySpotlightId: 'some-spotlight-user-id',
            },
          } as Temple);
          set(participantsAtom, {
            'some-spotlight-user-id': {
              user_id: 'some-spotlight-user-id',
            } as DailyParticipant,
            'some-other-user-id': {
              user_id: 'some-other-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toEqual([{user_id: 'some-other-user-id'}]);
  });

  it('returns all participants when no temple spotlight participant', () => {
    mockUseTempleExercise.mockReturnValue({
      slide: {current: {type: 'participantSpotlight'}},
    });

    const {result} = renderHook(() => useTempleParticipants(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(participantsAtom, {
            'some-spotlight-user-id': {
              user_id: 'some-spotlight-user-id',
            } as DailyParticipant,
            'some-other-user-id': {
              user_id: 'some-other-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toEqual([
      {user_id: 'some-spotlight-user-id'},
      {user_id: 'some-other-user-id'},
    ]);
  });

  it('returns all participants when content is not ”spotlight type"', () => {
    mockUseTempleExercise.mockReturnValue({
      slide: {current: {type: 'not-participantSpotlight'}},
    });

    const {result} = renderHook(() => useTempleParticipants(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(templeAtom, {
            exerciseState: {
              dailySpotlightId: 'some-spotlight-user-id',
            },
          } as Temple);
          set(participantsAtom, {
            'some-spotlight-user-id': {
              user_id: 'some-spotlight-user-id',
            } as DailyParticipant,
            'some-other-user-id': {
              user_id: 'some-other-user-id',
            } as DailyParticipant,
          });
        },
        children: null,
      },
    });

    expect(result.current).toEqual([
      {user_id: 'some-spotlight-user-id'},
      {user_id: 'some-other-user-id'},
    ]);
  });
});
