import {Alert} from 'react-native';
import {renderHook} from '@testing-library/react-hooks';

import useConfirmLogMindfulMinutes from './useConfirmLogMindfulMinutes';
import useLogMindfulMinutes from './useLogMindfulMinutes';

const mockAlert = jest.mocked(Alert.alert);

const mockSetMindfulMinutesEnabled = jest.fn();
const mockLogMindfulMinutes = jest.fn();
const mockUseLogMindfulMinutes = jest.mocked(useLogMindfulMinutes);
jest.mock('./useLogMindfulMinutes');

afterEach(jest.clearAllMocks);

describe('useConfirmLogMindfulMinutes', () => {
  describe('mindfulMinutesEnabled == true', () => {
    it('does nothing when already enabled', async () => {
      mockUseLogMindfulMinutes.mockReturnValueOnce({
        mindfulMinutesAvailable: true,
        mindfulMinutesEnabled: true,
        setMindfulMinutesEnabled: mockSetMindfulMinutesEnabled,
        logMindfulMinutes: mockLogMindfulMinutes,
      });

      const {result} = renderHook(() => useConfirmLogMindfulMinutes());

      await result.current();

      expect(mockAlert).toHaveBeenCalledTimes(0);
      expect(mockSetMindfulMinutesEnabled).toHaveBeenCalledTimes(0);
    });
  });

  describe('mindfulMinutesEnabled == false', () => {
    it('does nothing when explicitly disabled', async () => {
      mockUseLogMindfulMinutes.mockReturnValueOnce({
        mindfulMinutesAvailable: true,
        mindfulMinutesEnabled: false,
        setMindfulMinutesEnabled: mockSetMindfulMinutesEnabled,
        logMindfulMinutes: mockLogMindfulMinutes,
      });

      const {result} = renderHook(() => useConfirmLogMindfulMinutes());

      await result.current();

      expect(mockAlert).toHaveBeenCalledTimes(0);
      expect(mockSetMindfulMinutesEnabled).toHaveBeenCalledTimes(0);
    });
  });

  describe('mindfulMinutesAvailable == false', () => {
    it('does nothing when not available', async () => {
      mockUseLogMindfulMinutes.mockReturnValueOnce({
        mindfulMinutesAvailable: false,
        mindfulMinutesEnabled: undefined,
        setMindfulMinutesEnabled: mockSetMindfulMinutesEnabled,
        logMindfulMinutes: mockLogMindfulMinutes,
      });

      const {result} = renderHook(() => useConfirmLogMindfulMinutes());

      await result.current();

      expect(mockAlert).toHaveBeenCalledTimes(0);
      expect(mockSetMindfulMinutesEnabled).toHaveBeenCalledTimes(0);
    });
  });

  describe('mindfulMinutesEnabled == undefined', () => {
    beforeEach(() => {
      mockUseLogMindfulMinutes.mockReturnValueOnce({
        mindfulMinutesAvailable: true,
        mindfulMinutesEnabled: undefined,
        setMindfulMinutesEnabled: mockSetMindfulMinutesEnabled,
        logMindfulMinutes: mockLogMindfulMinutes,
      });
    });

    it('prompts about enabling mindful minutes', async () => {
      const {result} = renderHook(() => useConfirmLogMindfulMinutes());

      await result.current();

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith('title', 'message', [
        {
          text: 'actions.dismiss',
          style: 'destructive',
          onPress: expect.any(Function),
        },
        {text: 'actions.cancel', onPress: expect.any(Function)},
        {
          text: 'actions.confirm',
          onPress: expect.any(Function),
        },
      ]);
    });

    it('disables mindful minutes on dismiss', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the dismiss action
        if (config?.[0]?.onPress) {
          config[0].onPress();
        }
      });

      const {result} = renderHook(() => useConfirmLogMindfulMinutes());

      await result.current();

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockSetMindfulMinutesEnabled).toHaveBeenCalledTimes(1);
      expect(mockSetMindfulMinutesEnabled).toHaveBeenCalledWith(false);
    });

    it('does nothing on cancel', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the cancel action
        if (config?.[1]?.onPress) {
          config[1].onPress();
        }
      });

      const {result} = renderHook(() => useConfirmLogMindfulMinutes());

      await result.current();

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockSetMindfulMinutesEnabled).toHaveBeenCalledTimes(0);
    });

    it('enables mindful minutes on confirm', async () => {
      mockAlert.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        if (config?.[2]?.onPress) {
          config[2].onPress();
        }
      });

      const {result} = renderHook(() => useConfirmLogMindfulMinutes());

      await result.current();

      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockSetMindfulMinutesEnabled).toHaveBeenCalledTimes(1);
      expect(mockSetMindfulMinutesEnabled).toHaveBeenCalledWith(true);
    });
  });
});
