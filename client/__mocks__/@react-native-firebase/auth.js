const mockAuth = {
  onAuthStateChanged: jest.fn(),
  signInAnonymously: jest.fn(),
};

const authMock = jest.fn(() => mockAuth);

export default authMock;
