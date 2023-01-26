// https://github.com/pmndrs/zustand/blob/main/docs/guides/testing.mdx#typescript-usage
import {create as actualCreate, StateCreator} from 'zustand';
// const actualCreate = jest.requireActual('zustand') // if using jest
import {act} from '@testing-library/react-hooks';

// a variable to hold reset functions for all stores declared in the app
const storeResetFns = new Set<() => void>();

// when creating a store, we get its initial state, create a reset function and add it in the set
export const create =
  () =>
  <S>(createState: StateCreator<S>) => {
    const store = actualCreate<S>(createState);
    const initialState = store.getState();
    storeResetFns.add(() => store.setState(initialState, true));
    return store;
  };

// Reset all stores before each test run
beforeEach(() => {
  act(() => storeResetFns.forEach(resetFn => resetFn()));
});
