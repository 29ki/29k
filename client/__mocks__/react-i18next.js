const mockT = jest.fn();

export const useTranslation = jest.fn(() => ({t: mockT}));
