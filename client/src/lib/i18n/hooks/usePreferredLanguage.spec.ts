import {act, renderHook} from '@testing-library/react-hooks';
import useAppState from '../../appState/state/state';
import usePreferredLanguage from './usePreferredLanguage';

const mockI18n = {
  changeLanguage: jest.fn(),
};
jest.mock('react-i18next', () => ({
  useTranslation: () => ({i18n: mockI18n}),
}));

describe('usePreferredLanguage', () => {
  it('sets the i18n language when preferedLanguage is changed', () => {
    renderHook(() => usePreferredLanguage());

    expect(mockI18n.changeLanguage).toHaveBeenCalledTimes(0);

    act(() => {
      useAppState.getState().setSettings({preferredLanguage: 'sv'});
    });

    expect(mockI18n.changeLanguage).toHaveBeenCalledTimes(1);
    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('sv');
  });
});
