import {create} from 'zustand';

type State = {
  relatesCount: {[id: string]: number | null};
};

type Actions = {
  setInitialRelatesCount: (id: string, count: number | null) => void;
  increaseRelatesCount: (id: string) => void;
  decreaseRelatesCount: (id: string) => void;
};

const initialState: State = {
  relatesCount: {},
};

const useRelatesState = create<State & Actions>()(set => ({
  ...initialState,
  setInitialRelatesCount: (id, count) =>
    set(({relatesCount}) =>
      relatesCount[id] === undefined
        ? {relatesCount: {...relatesCount, [id]: count}}
        : {},
    ),
  increaseRelatesCount: id =>
    set(({relatesCount}) => ({
      relatesCount: {
        ...relatesCount,
        [id]: (relatesCount[id] || 0) + 1,
      },
    })),
  decreaseRelatesCount: id =>
    set(({relatesCount}) => ({
      relatesCount: {
        ...relatesCount,
        [id]: (relatesCount[id] || 1) - 1,
      },
    })),
}));

export default useRelatesState;
