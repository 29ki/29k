const mockFirestore = {
  collection: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          onSnapshot: jest.fn(cb => {
            cb({exists: true, data: () => ({id: 'test-id'})});
            return jest.fn(() => 'unsubscribe-mock');
          }),
        }),
      }),
    }),
  }),
};

const firestoreMock = jest.fn(() => mockFirestore);

export default firestoreMock;
