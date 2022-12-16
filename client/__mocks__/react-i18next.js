const mockT = jest.fn(key => key);
const mockRemoveResourceBundle = jest.fn();
const mockReloadResources = jest.fn();

const mockI18n = {
  removeResourceBundle: mockRemoveResourceBundle,
  reloadResources: mockReloadResources,
  language: 'en',
};

export const useTranslation = jest.fn(() => ({t: mockT, i18n: mockI18n}));
