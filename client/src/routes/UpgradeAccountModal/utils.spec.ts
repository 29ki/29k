import {States} from './constants';
import {getAggregatedState} from './utils';

describe('getState', () => {
  it.each([
    [
      {
        haveRequested: false,
        needToUpgrade: false,
        haveCode: false,
        upgradeComplete: false,
      },
      States.START,
    ],
    [
      {
        haveRequested: true,
        needToUpgrade: false,
        haveCode: false,
        upgradeComplete: false,
      },
      States.START,
    ],
    [
      {
        haveRequested: true,
        needToUpgrade: true,
        haveCode: false,
        upgradeComplete: false,
      },
      States.START,
    ],
    [
      {
        haveRequested: false,
        needToUpgrade: true,
        haveCode: false,
        upgradeComplete: false,
      },
      States.UPGRADE,
    ],
    [
      {
        haveRequested: false,
        needToUpgrade: false,
        haveCode: true,
        upgradeComplete: false,
      },
      States.INPUT_CODE,
    ],
    [
      {
        haveRequested: true,
        needToUpgrade: true,
        haveCode: true,
        upgradeComplete: false,
      },
      States.INPUT_CODE,
    ],
    [
      {
        haveRequested: false,
        needToUpgrade: false,
        haveCode: false,
        upgradeComplete: true,
      },
      States.COMPLETE,
    ],
    [
      {
        haveRequested: true,
        needToUpgrade: true,
        haveCode: true,
        upgradeComplete: true,
      },
      States.COMPLETE,
    ],
  ])(`%j resolves to %s`, (states, aggregatedState) => {
    expect(getAggregatedState(states)).toEqual(aggregatedState);
  });
});
