import {act, renderHook} from '@testing-library/react-hooks';
import {RecoilRoot, useRecoilValue} from 'recoil';
import {activeParticipantsAtom} from '../state/state';
import useSetActiveParticipants from './useSetActiveParticipants';

describe('setActiveParticipants', () => {
  const useTestHook = () => {
    // Actual function to test
    const setActiveParticipants = useSetActiveParticipants();
    // State to expect on
    const activeParticipants = useRecoilValue(activeParticipantsAtom);

    return {
      setActiveParticipants,
      activeParticipants,
    };
  };

  it('should not change order if participant is already first', () => {
    const {result} = renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(activeParticipantsAtom, ['test-id-2', 'test-id-1']);
        },
        children: null,
      },
    });

    act(() => result.current.setActiveParticipants('test-id-2'));

    expect(result.current.activeParticipants).toEqual([
      'test-id-2',
      'test-id-1',
    ]);
  });

  it('should not change order if participant is already second', () => {
    const {result} = renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(activeParticipantsAtom, ['test-id-2', 'test-id-1']);
        },
        children: null,
      },
    });

    act(() => result.current.setActiveParticipants('test-id-1'));

    expect(result.current.activeParticipants).toEqual([
      'test-id-2',
      'test-id-1',
    ]);
  });

  it('should change order if participant is not first or second', () => {
    const {result} = renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
      initialProps: {
        initializeState: ({set}) => {
          set(activeParticipantsAtom, ['test-id-2', 'test-id-1']);
        },
        children: null,
      },
    });

    act(() => result.current.setActiveParticipants('test-id-3'));

    expect(result.current.activeParticipants).toEqual([
      'test-id-3',
      'test-id-2',
      'test-id-1',
    ]);
  });
});
