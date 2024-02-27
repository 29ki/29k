import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {LANGUAGE_TAG} from '../../i18n';
import useAppState from '../../appState/state/state';
import useUnlockedCollectionIds from '../../user/hooks/useUnlockedCollectionIds';

const useGetCollectionById = () => {
  const {t} = useTranslation('collections');
  const showLockedContent = useAppState(
    state => state.settings.showLockedContent,
  );
  const unlockedCollectionIds = useUnlockedCollectionIds();

  return useCallback(
    (id: string, language?: LANGUAGE_TAG) => {
      const collection = t(id, {
        returnObjects: true,
        lng: language,
      }) as Collection;

      if (
        // i18next fallbacks to the key if no translation is found
        typeof collection !== 'object' ||
        (collection.locked &&
          !showLockedContent &&
          !unlockedCollectionIds?.includes(id))
      ) {
        return null;
      }

      return collection;
    },
    [t, showLockedContent, unlockedCollectionIds],
  );
};

export default useGetCollectionById;
