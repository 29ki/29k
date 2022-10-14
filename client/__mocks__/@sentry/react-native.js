export const init = jest.fn();

export const captureException = jest.fn();

const mockScope = {
  setTag: jest.fn(),
};
export const configureScope = jest.fn(fn => fn(mockScope));
