const verifyIdToken = jest.fn();
export const getAuth = jest.fn(() => ({
  verifyIdToken,
}));
