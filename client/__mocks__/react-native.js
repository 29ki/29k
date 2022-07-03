import * as ReactNative from 'react-native';

export const Platform = {
  ...ReactNative.Platform,
  OS: 'some-os',
  Version: 'some-os-version',
  select: jest.fn(({ios}) => ios),
};

export default Object.setPrototypeOf(
  {
    Platform,
  },
  ReactNative,
);
