const mockAuth = {
  onAuthStateChanged: jest.fn(),
  signInAnonymously: jest.fn(),
  signOut: jest.fn(),
  currentUser: {
    delete: jest.fn(),
  },
};

const authMock = jest.fn(() => mockAuth);

export default authMock;
