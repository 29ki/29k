const verifyIdToken = jest.fn();
const getUser = jest.fn();
const setCustomUserClaims = jest.fn();
export const getAuth = jest.fn(() => ({
  verifyIdToken,
  getUser,
  setCustomUserClaims,
}));
