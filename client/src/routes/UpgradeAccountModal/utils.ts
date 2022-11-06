import {States} from './constants';

type StatesArg = {
  needToUpgrade: boolean;
  haveRequested: boolean;
  haveCode: boolean;
  upgradeComplete: boolean;
};

export const getAggregatedState: (states: StatesArg) => States = ({
  needToUpgrade,
  haveRequested,
  haveCode,
  upgradeComplete,
}) => {
  if (upgradeComplete) {
    return States.COMPLETE;
  }
  if (haveCode) {
    return States.INPUT_CODE;
  }
  if (!haveRequested && needToUpgrade) {
    return States.UPGRADE;
  }
  return States.START;
};
