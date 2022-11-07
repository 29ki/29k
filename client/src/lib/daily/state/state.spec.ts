import {renderHook} from '@testing-library/react-hooks';
import {DailyParticipant} from '@daily-co/react-native-daily-js';
import useDailyState from './state';
import {act} from 'react-test-renderer';

describe('Daily state', () => {
  describe('setParticipant', () => {
    it('sets participants state', () => {
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipant('some-id', {
          user_id: 'some-id',
        } as DailyParticipant);
      });

      expect(result.current.participants).toEqual({
        'some-id': {user_id: 'some-id'},
      });
    });
  });

  describe('setParticipantsSortOrder', () => {
    it('sets participantsSortOrder state', () => {
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipantsSortOrder(['some-id', 'some-other-id']);
      });

      expect(result.current.participantsSortOrder).toEqual([
        'some-id',
        'some-other-id',
      ]);
    });
  });

  describe('removeParticipant', () => {
    it('removed from participants and participantsSortOrder states', () => {
      const {result} = renderHook(() => useDailyState());

      act(() => {
        result.current.setParticipant('some-id', {
          user_id: 'some-id',
        } as DailyParticipant);
        result.current.setParticipant('some-other-id', {
          user_id: 'some-other-id',
        } as DailyParticipant);
        result.current.setParticipantsSortOrder(['some-id', 'some-other-id']);
      });

      expect(result.current.participantsSortOrder).toEqual([
        'some-id',
        'some-other-id',
      ]);
      expect(result.current.participants).toEqual({
        'some-id': {user_id: 'some-id'},
        'some-other-id': {user_id: 'some-other-id'},
      });

      act(() => {
        result.current.removeParticipant('some-id');
      });

      expect(result.current.participants).toEqual({
        'some-other-id': {user_id: 'some-other-id'},
      });
      expect(result.current.participantsSortOrder).toEqual(['some-other-id']);
    });
  });

  describe('reset', () => {
    it('resets state to inital state', () => {
      const {result} = renderHook(() => useDailyState());

      expect(result.current.participants).toEqual({});
      expect(result.current.participantsSortOrder).toEqual([]);

      act(() => {
        result.current.setParticipant('some-id', {
          user_id: 'some-id',
        } as DailyParticipant);
        result.current.setParticipant('some-other-id', {
          user_id: 'some-other-id',
        } as DailyParticipant);
        result.current.setParticipantsSortOrder(['some-id', 'some-other-id']);
      });

      expect(result.current.participantsSortOrder).toEqual([
        'some-id',
        'some-other-id',
      ]);
      expect(result.current.participants).toEqual({
        'some-id': {user_id: 'some-id'},
        'some-other-id': {user_id: 'some-other-id'},
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.participants).toEqual({});
      expect(result.current.participantsSortOrder).toEqual([]);
    });
  });
});
