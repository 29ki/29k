const mockNavigation = {
  navigate: jest.fn(),
};

export const useNavigation = jest.fn(() => mockNavigation);
export const useIsFocused = jest.fn();
