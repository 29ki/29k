import {renderHook} from '@testing-library/react-hooks';
import useGet from './useGet';
import {getItem, setItem} from './cache';
import apiClient from './apiClient';

jest.mock('./apiClient');
jest.mock('./cache');
const mockedGetItem = jest.mocked(getItem);
const mockedSetItem = jest.mocked(setItem);
const mockedApiClient = jest.mocked(apiClient);

afterEach(jest.clearAllMocks);

describe('useGet', () => {
  it('should skip everything', async () => {
    const {result} = renderHook(() =>
      useGet('/endpoint/some-value', {skip: true}),
    );

    expect(mockedApiClient).toHaveBeenCalledTimes(0);
    expect(getItem).toHaveBeenCalledTimes(0);
    expect(setItem).toHaveBeenCalledTimes(0);

    expect(result.current).toEqual({data: undefined, error: undefined});
  });

  describe('when cache-control is specified in the response header', () => {
    beforeEach(() => {
      mockedApiClient.mockResolvedValueOnce({
        json: () => Promise.resolve({name: 'test-name'}),
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue('max-age=3600'),
        },
      } as unknown as Response);
    });

    it('should call apiClient with proper parameters', async () => {
      mockedGetItem.mockResolvedValueOnce(undefined);
      mockedGetItem.mockResolvedValueOnce({name: 'cached-test-name'});
      const {waitForNextUpdate} = renderHook(() =>
        useGet('/endpoint/some-value'),
      );

      await waitForNextUpdate();

      expect(mockedApiClient).toHaveBeenCalledTimes(1);
      expect(mockedApiClient).toHaveBeenCalledWith('/endpoint/some-value', {
        method: 'GET',
      });
    });

    it('should set cache value with right expiry', async () => {
      mockedGetItem.mockResolvedValueOnce(undefined);
      mockedGetItem.mockResolvedValueOnce({name: 'cached-test-name'});
      const {waitForNextUpdate, result} = renderHook(() =>
        useGet('/endpoint/some-value'),
      );

      await waitForNextUpdate();

      expect(result.current).toEqual({
        data: {name: 'cached-test-name'},
        error: undefined,
      });
      expect(mockedSetItem).toHaveBeenCalledTimes(1);
      expect(mockedSetItem).toHaveBeenCalledWith(
        '/endpoint/some-value',
        {name: 'test-name'},
        3600,
      );
    });

    it('should use cached value and not call the api', async () => {
      mockedGetItem.mockResolvedValue({name: 'this-is-the-cached-data'});

      const {waitForNextUpdate, result} = renderHook(() =>
        useGet('/endpoint/some-value'),
      );

      await waitForNextUpdate();

      expect(mockedGetItem).toHaveBeenCalledTimes(1);
      expect(mockedGetItem).toHaveBeenCalledWith('/endpoint/some-value');
      expect(mockedApiClient).toHaveBeenCalledTimes(0);
      expect(result.current).toEqual({
        data: {name: 'this-is-the-cached-data'},
        error: undefined,
      });
    });
  });

  describe('when cache-control isnt specified in the response header', () => {
    beforeEach(() => {
      mockedApiClient.mockResolvedValueOnce({
        json: () => Promise.resolve({name: 'test-name'}),
        ok: true,
        headers: {
          get: jest.fn().mockReturnValue(null),
        },
      } as unknown as Response);
    });

    it('should call apiClient with proper parameters', async () => {
      mockedGetItem.mockResolvedValueOnce(undefined);
      const {waitForNextUpdate} = renderHook(() =>
        useGet('/endpoint/some-value'),
      );

      await waitForNextUpdate();

      expect(mockedApiClient).toHaveBeenCalledTimes(1);
      expect(mockedApiClient).toHaveBeenCalledWith('/endpoint/some-value', {
        method: 'GET',
      });
    });

    it('should should not set a cache value', async () => {
      mockedGetItem.mockResolvedValueOnce(undefined);
      const {waitForNextUpdate, result} = renderHook(() =>
        useGet('/endpoint/some-value'),
      );

      await waitForNextUpdate();

      expect(result.current).toEqual({
        data: {name: 'test-name'},
        error: undefined,
      });
      expect(mockedSetItem).toHaveBeenCalledTimes(0);
    });
  });
});
