import {DailyParticipant} from '@daily-co/react-native-daily-js';
import {snapshot_UNSTABLE} from 'recoil';
import {
  activeParticipants,
  participantsAtom,
  participantsSelector,
} from './state';

const createParticipant = (id: string, local = false) => ({
  [id]: {user_id: id, local} as DailyParticipant,
});

describe('Temple state', () => {
  describe('participantsSelector', () => {
    it('should omit undefineds streams from server', () => {
      const initialSnapshot = snapshot_UNSTABLE(({set}) =>
        set(participantsAtom, {
          ['test-id-1']: undefined,
          ...createParticipant('test-id-2'),
        }),
      );

      expect(
        initialSnapshot.getLoadable(participantsSelector).valueOrThrow(),
      ).toEqual([{user_id: 'test-id-2', local: false}]);
    });

    it('should return active participant first', () => {
      const initialSnapshot = snapshot_UNSTABLE(({set}) => {
        set(participantsAtom, {
          ...createParticipant('test-id-1', true),
          ...createParticipant('test-id-2'),
        });
        set(activeParticipants, ['test-id-2']);
      });

      expect(
        initialSnapshot.getLoadable(participantsSelector).valueOrThrow(),
      ).toEqual([
        {user_id: 'test-id-2', local: false},
        {user_id: 'test-id-1', local: true},
      ]);
    });

    it('should order participants depending on when active', () => {
      const initialSnapshot = snapshot_UNSTABLE(({set}) => {
        set(participantsAtom, {
          ...createParticipant('test-id-1', true),
          ...createParticipant('test-id-2'),
          ...createParticipant('test-id-3'),
        });
        set(activeParticipants, ['test-id-2', 'test-id-3', 'test-id-1']);
      });

      expect(
        initialSnapshot.getLoadable(participantsSelector).valueOrThrow(),
      ).toEqual([
        {user_id: 'test-id-2', local: false},
        {user_id: 'test-id-3', local: false},
        {user_id: 'test-id-1', local: true},
      ]);
    });

    it('should order handle participants leaving', () => {
      const initialSnapshot = snapshot_UNSTABLE(({set}) => {
        set(participantsAtom, {
          ...createParticipant('test-id-1', true),
          ...createParticipant('test-id-2'),
        });
        set(activeParticipants, ['test-id-2', 'test-id-3', 'test-id-1']);
      });

      expect(
        initialSnapshot.getLoadable(participantsSelector).valueOrThrow(),
      ).toEqual([
        {user_id: 'test-id-2', local: false},
        {user_id: 'test-id-1', local: true},
      ]);
    });
  });
});
