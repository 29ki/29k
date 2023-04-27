import {cleanup, renderHook, act} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import useAppState from '../../appState/state/state';
import useToggleHiddenContent from './useToggleHiddenContent';

beforeEach(async () => {
  await cleanup(); //Normally added automatically by @testing-library/react-hooks
  jest.clearAllMocks();
});

describe('useToggleHiddenContent', () => {
  it('should reload resources on toggle on', () => {
    const {i18n} = useTranslation();
    const {result} = renderHook(() => useToggleHiddenContent());

    act(() => {
      result.current(true);
    });

    expect(useAppState.getState().settings.showHiddenContent).toBe(true);
    expect(i18n.removeResourceBundle).toHaveBeenCalledTimes(8);
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('es', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('es', 'collections');
    expect(i18n.reloadResources).toHaveBeenCalledTimes(1);
    expect(i18n.reloadResources).toHaveBeenCalledWith(undefined, [
      'exercises',
      'collections',
    ]);
  });

  it('should reload resources on toggle off', () => {
    const {i18n} = useTranslation();
    const {result} = renderHook(() => useToggleHiddenContent());

    act(() => {
      result.current(false);
    });

    expect(useAppState.getState().settings.showHiddenContent).toBe(false);
    expect(i18n.removeResourceBundle).toHaveBeenCalledTimes(8);
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('es', 'exercises');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('en', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('pt', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('sv', 'collections');
    expect(i18n.removeResourceBundle).toHaveBeenCalledWith('es', 'collections');
    expect(i18n.reloadResources).toHaveBeenCalledTimes(1);
    expect(i18n.reloadResources).toHaveBeenCalledWith(undefined, [
      'exercises',
      'collections',
    ]);
  });
});
