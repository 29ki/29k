import create from 'zustand';
import {COLORS} from '../../../../../shared/src/constants/colors';

type State = {
  backgroundColor: string;
};

type Actions = {
  setBackgroundColor: (backgroundColor: State['backgroundColor']) => void;
};

const useModalState = create<State & Actions>()(set => ({
  backgroundColor: COLORS.CREAM,
  setBackgroundColor: backgroundColor => set({backgroundColor}),
}));

export default useModalState;
