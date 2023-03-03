import {renderHook} from '@testing-library/react-hooks';
import useAppState from '../../appState/state/state';
import useCollections from './useCollections';

const mockGetDataByLanguage = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      getDataByLanguage: mockGetDataByLanguage,
    },
  }),
}));

const mockGetCollectionById = jest.fn();

jest.mock('./useGetCollectionById', () => () => mockGetCollectionById);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCollections', () => {
  it('should return collections sorted by name', () => {
    mockGetDataByLanguage.mockReturnValue({
      collections: {
        'some-collection-id': {name: 'some name'},
        'some-other-collection-id': {name: 'some other name'},
      },
    });
    mockGetCollectionById
      .mockReturnValueOnce({name: 'aaa'})
      .mockReturnValueOnce({name: 'bbb'});

    const {result} = renderHook(() => useCollections());

    expect(mockGetCollectionById).toHaveBeenCalledTimes(2);
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-collection-id',
      'en',
    );
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-other-collection-id',
      'en',
    );
    expect(result.current).toEqual([{name: 'aaa'}, {name: 'bbb'}]);
  });

  it('should filter out collections not found', () => {
    mockGetDataByLanguage.mockReturnValue({
      collections: {
        'some-collection-id': {name: 'some name'},
        'some-other-collection-id': {name: 'some other name'},
      },
    });
    mockGetCollectionById
      .mockReturnValueOnce({name: 'aaa'})
      .mockReturnValueOnce(null);

    const {result} = renderHook(() => useCollections());

    expect(mockGetCollectionById).toHaveBeenCalledTimes(2);
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-collection-id',
      'en',
    );
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-other-collection-id',
      'en',
    );
    expect(result.current).toEqual([{name: 'aaa'}]);
  });

  it('should return collections sorted by name with user preferred language', () => {
    mockGetDataByLanguage.mockReturnValueOnce({
      collections: {
        'some-collection-id': {},
        'some-other-collection-id': {},
      },
    });
    mockGetCollectionById
      .mockReturnValueOnce({name: 'aaa'})
      .mockReturnValueOnce({name: 'bbb'});
    useAppState.setState({
      settings: {
        preferredLanguage: 'sv',
        showWelcome: false,
        showHiddenContent: false,
      },
    });

    const {result} = renderHook(() => useCollections());

    expect(mockGetCollectionById).toHaveBeenCalledTimes(2);
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-collection-id',
      'sv',
    );
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-other-collection-id',
      'sv',
    );
    expect(result.current).toEqual([{name: 'aaa'}, {name: 'bbb'}]);
  });

  it('should return empty list if no collections', () => {
    mockGetDataByLanguage.mockReturnValueOnce({});

    const {result} = renderHook(() => useCollections());

    expect(mockGetCollectionById).toHaveBeenCalledTimes(0);

    expect(result.current).toEqual([]);
  });
});
