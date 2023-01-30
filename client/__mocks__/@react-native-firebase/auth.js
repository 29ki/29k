const onUserChanged = jest.fn().mockReturnValue(() => {});
const signInAnonymously = jest.fn().mockResolvedValue();
const signInWithCredential = jest.fn().mockResolvedValue();
const signOut = jest.fn().mockResolvedValue();

const deleteMock = jest.fn();
const getIdToken = jest.fn();
const getIdTokenResult = jest.fn();
const linkWithCredential = jest.fn();
const updateEmail = jest.fn();
const updatePassword = jest.fn();
const updateProfile = jest.fn();

const mockAuth = {
  onUserChanged,
  signInAnonymously,
  signInWithCredential,
  signOut,
  currentUser: {
    isAnonymous: true,
    delete: deleteMock,
    getIdToken,
    getIdTokenResult,
    linkWithCredential,
    updateEmail,
    updatePassword,
    updateProfile,
  },
};

const authMock = jest.fn(() => mockAuth);

export default authMock;
