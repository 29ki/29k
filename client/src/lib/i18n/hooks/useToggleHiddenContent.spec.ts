import {cleanup, renderHook, act} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import useAppState from '../../appState/state/state';
import useToggleHiddenContent from './useToggleHiddenContent';

beforeEach(async () => {
  await cleanup(); //Normally added automatically by @testing-library/react-hooks
  jest.clearAllMocks();
});

describe('useToggleHiddenContent', () => {
  it('should reload resources on toggle on', async () => {
    const {i18n} = useTranslation();
    const {result} = renderHook(() => useToggleHiddenContent());

    await act(async () => {
      await result.current(true);
    });

    expect(useAppState.getState().settings.showHiddenContent).toBe(true);
    expect(i18n.removeResourceBundle).toHaveBeenCalledTimes(16);
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'exercises');
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

  it('should reload resources on toggle off', async () => {
    const {i18n} = useTranslation();
    const {result} = renderHook(() => useToggleHiddenContent());

    await act(async () => {
      await result.current(false);
    });

    expect(useAppState.getState().settings.showHiddenContent).toBe(false);
    expect(i18n.removeResourceBundle).toHaveBeenCalledTimes(16);
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'categories');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'tags');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('ja', 'exercises');
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
