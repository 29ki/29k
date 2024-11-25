import {renderHook, act} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import useReloadResourceBundles from './useReloadResourceBundles';

beforeEach(async () => {
  jest.clearAllMocks();
});

describe('useReloadResourceBundles', () => {
  it('should reload resources', async () => {
    const {i18n} = useTranslation();
    const {result} = renderHook(() => useReloadResourceBundles());

    await act(async () => {
      await result.current();
    });

    expect(i18n.removeResourceBundle).toHaveBeenCalledTimes(32);
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('da', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('cs', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('nl', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('es', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('da', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('cs', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('nl', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('es', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('da', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('cs', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('nl', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('es', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('da', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('cs', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('nl', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('es', 'exercises');
    expect(i18n.reloadResources).toHaveBeenCalledTimes(1);
    expect(i18n.reloadResources).toHaveBeenCalledWith(undefined, [
      'categories',
      'collections',
      'tags',
      'exercises',
    ]);
    expect(i18n.emit).toHaveBeenCalledTimes(1);
    expect(i18n.emit).toHaveBeenCalledWith('languageChanged');
  });
});
