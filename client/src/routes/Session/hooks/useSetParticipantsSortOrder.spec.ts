import {act, renderHook} from '@testing-library/react-hooks';
import useDailyState from '../../../lib/daily/state/state';
import useSetParticipantsSortOrder from './useSetParticipantsSortOrder';

describe('setActiveParticipants', () => {
  const useTestHook = () => {
    // Actual function to test
    const setParticipantsSortOrder = useSetParticipantsSortOrder();
    // State to expect on
    const activeParticipants = useDailyState(
      state => state.participantsSortOrder,
    );

    return {
      setParticipantsSortOrder,
      activeParticipants,
    };
  };

  it('should not change sort order if participant is already first', () => {
    useDailyState.setState({
      participantsSortOrder: ['test-id-2', 'test-id-1'],
    });

    const {result} = renderHook(() => useTestHook());

    act(() => result.current.setParticipantsSortOrder('test-id-2'));

    expect(result.current.activeParticipants).toEqual([
      'test-id-2',
      'test-id-1',
    ]);
  });

  it('should not change sort order if participant is already second', () => {
    useDailyState.setState({
      participantsSortOrder: ['test-id-2', 'test-id-1'],
    });

    const {result} = renderHook(() => useTestHook());

    act(() => result.current.setParticipantsSortOrder('test-id-1'));

    expect(result.current.activeParticipants).toEqual([
      'test-id-2',
      'test-id-1',
    ]);
  });

  it('should change order if participant is not first or second', () => {
    useDailyState.setState({
      participantsSortOrder: ['test-id-2', 'test-id-1'],
    });

    const {result} = renderHook(() => useTestHook());

    act(() => result.current.setParticipantsSortOrder('test-id-3'));

    expect(result.current.activeParticipants).toEqual([
      'test-id-3',
      'test-id-2',
      'test-id-1',
    ]);
  });
});
