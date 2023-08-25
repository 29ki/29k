const mockNavigation = {
  navigate: jest.fn(),
  popToTop: jest.fn(),
  addListener: jest.fn(),
  getCurrentRoute: jest.fn(),
};

export const DefaultTheme = {
  colors: '#00000',
};

export const createNavigationContainerRef = jest.fn();

export const useNavigation = jest.fn(() => mockNavigation);
export const useIsFocused = jest.fn();
