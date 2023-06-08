import {Alert} from 'react-native';
import {renderHook} from '@testing-library/react-hooks';

import usePracticeRemindersSetting from './usePracticeRemindersSetting';
import {REMINDER_INTERVALS} from '../constants';
import useConfirmPracticeReminders from './useConfirmPracticeReminders';

const mockAlert = jest.mocked(Alert.alert);

const mockSetPracticeRemindersConfig = jest.fn();
const mockUsePracticeReminderSetting = jest.mocked(usePracticeRemindersSetting);
jest.mock('./usePracticeRemindersSetting');

afterEach(jest.clearAllMocks);

describe('useConfirmPracticeReminders', () => {
  describe('practiceReminderConfig == not null', () => {
    beforeEach(() => {
      mockUsePracticeReminderSetting.mockReturnValueOnce({
        practiceReminderConfig: {
          interval: REMINDER_INTERVALS.MONDAY,
          hour: 10,
          minute: 0,
        },
        setPracticeRemindersConfig: mockSetPracticeRemindersConfig,
        practiceRemindersEnabled: undefined,
      });
    });

    it('toggles reminder off', async () => {
      const {result} = renderHook(() => useConfirmPracticeReminders());

      await result.current(false);

      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledTimes(1);
      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledWith(null);
    });
  });

  describe('practiceReminderConfig == null', () => {
    beforeEach(() => {
      mockUsePracticeReminderSetting.mockReturnValueOnce({
        practiceReminderConfig: null,
        setPracticeRemindersConfig: mockSetPracticeRemindersConfig,
        practiceRemindersEnabled: undefined,
      });
    });

    it('does not toggle reminder on', async () => {
      const {result} = renderHook(() => useConfirmPracticeReminders());

      await result.current(true);

      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledTimes(0);
    });

    it('does not toggle reminder off', async () => {
      const {result} = renderHook(() => useConfirmPracticeReminders());

      await result.current(false);

      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledTimes(0);
    });
  });

  describe('practiceReminderConfig == undefined', () => {
    beforeEach(() => {
      mockUsePracticeReminderSetting.mockReturnValueOnce({
        practiceReminderConfig: undefined,
        setPracticeRemindersConfig: mockSetPracticeRemindersConfig,
        practiceRemindersEnabled: undefined,
      });
    });

    it('prompts the user about enabling notification reminders', async () => {
      const {result} = renderHook(() => useConfirmPracticeReminders());

      await result.current(true);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith('title', 'message', [
        {
          text: 'actions.dismiss',
          style: 'destructive',
          onPress: expect.any(Function),
        },
        {text: 'actions.cancel'},
        {
          text: 'actions.confirm',
          onPress: expect.any(Function),
        },
      ]);
    });

    it('disables notification reminders on dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dismiss action
        if (config?.[0]?.onPress) {
          config[0].onPress();
        }
      });

      const {result} = renderHook(() => useConfirmPracticeReminders());

      await result.current(true);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledTimes(1);
      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledWith(null);
    });

    it('does nothing on cancel', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the cancel action
        if (config?.[1]?.onPress) {
          config[1].onPress();
        }
      });

      const {result} = renderHook(() => useConfirmPracticeReminders());

      await result.current(true);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledTimes(0);
    });

    it('enables notification reminders on confirm', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        if (config?.[2]?.onPress) {
          config[2].onPress();
        }
      });

      const {result} = renderHook(() => useConfirmPracticeReminders());

      await result.current(true);

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledTimes(1);
      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledWith({
        interval: expect.any(String),
        hour: expect.any(Number),
        minute: expect.any(Number),
      });
    });

    it('does nothing on disabling notification reminder', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        if (config?.[2]?.onPress) {
          config[2].onPress();
        }
      });

      const {result} = renderHook(() => useConfirmPracticeReminders());

      await result.current(false);

      expect(mockAlert).toHaveBeenCalledTimes(0);
      expect(mockSetPracticeRemindersConfig).toHaveBeenCalledTimes(0);
    });
  });
});
