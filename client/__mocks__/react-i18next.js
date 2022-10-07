const mockT = jest.fn(key => key);

export const useTranslation = jest.fn(() => ({t: mockT}));
