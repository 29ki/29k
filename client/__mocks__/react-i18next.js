const mockT = jest.fn(key => key);
const mockRemoveResourceBundle = jest.fn();
const mockReloadResources = jest.fn();
const mockGetDataByLanguage = jest.fn();
const mockEmit = jest.fn();

const mockI18n = {
  removeResourceBundle: mockRemoveResourceBundle,
  reloadResources: mockReloadResources,
  getDataByLanguage: mockGetDataByLanguage,
  emit: mockEmit,
  language: 'en',
};

export const useTranslation = jest.fn(() => ({t: mockT, i18n: mockI18n}));
