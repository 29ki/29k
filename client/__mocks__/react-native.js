import * as ReactNative from 'react-native';

export const Platform = {
  ...ReactNative.Platform,
  OS: 'some-os',
  Version: 'some-os-version',
  select: jest.fn(({ios}) => ios),
};

export const AppState = {
  addEventListener: jest.fn(),
  currentState: 'active',
};

export const Alert = {
  alert: jest.fn(),
};

export default Object.setPrototypeOf(
  {
    Platform,
    AppState,
    Alert,
  },
  ReactNative,
);
