const mockAuth = {
  onUserChanged: jest.fn(),
  signInAnonymously: jest.fn(),
  signOut: jest.fn(),
  currentUser: {
    delete: jest.fn(),
    getIdToken: jest.fn(),
  },
};

const authMock = jest.fn(() => mockAuth);

export default authMock;
