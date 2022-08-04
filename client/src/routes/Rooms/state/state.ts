import {prop, uniqBy, values} from 'ramda';
import {atom, selector} from 'recoil';
import {Room} from '../../../lib/api/room';

const NAMESPACE = 'Rooms';

type RoomsState = {
  isLoading: boolean;
};

export const roomsStateAtom = atom<RoomsState>({
  key: NAMESPACE,
  default: {
    isLoading: false,
  },
});

export const roomsAtom = atom<{
  [roomId: string]: Room;
}>({
  key: `${NAMESPACE}/participants`,
  default: {},
});

export const roomsSelector = selector({
  key: `${NAMESPACE}/roomsSelector`,
  get: ({get}) => {
    const rooms = values(get(roomsAtom));
    return uniqBy(prop('id'), rooms);
  },
});
