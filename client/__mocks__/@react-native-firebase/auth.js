const mockAuth = {
  onUserChanged: jest.fn().mockReturnValue(() => {}),
  signInAnonymously: jest.fn(),
  signOut: jest.fn(),
  currentUser: {
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
  },
};

const authMock = jest.fn(() => mockAuth);

export default authMock;
