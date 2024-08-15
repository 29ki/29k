import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Collection} from '../../../../../shared/src/types/generated/Collection';
import {LANGUAGE_TAG} from '../../i18n';
import useAppState from '../../appState/state/state';
import useUnlockedCollectionIds from '../../user/hooks/useUnlockedCollectionIds';
import {CollectionWithLanguage} from '../types';

const useGetCollectionById = () => {
  const {t} = useTranslation('collections');
  const showLockedContent = useAppState(
    state => state.settings.showLockedContent,
  );
  const unlockedCollectionIds = useUnlockedCollectionIds();

  return useCallback(
    (
      id: string,
      language?: LANGUAGE_TAG,
      ignoreLocked?: boolean,
    ): CollectionWithLanguage | null => {
      const translation = t(id, {
        lng: language,
        returnObjects: true,
        returnDetails: true,
        keySeparator: false, // prevents object from being copied
      });

      // i18next fallbacks to the key if no translation is found
      if (typeof translation.res !== 'object') {
        return null;
      }

      const collection = {
        ...(translation.res as Collection),
        language: translation.usedLng as LANGUAGE_TAG,
      };

      if (
        collection.locked &&
        !ignoreLocked &&
        !showLockedContent &&
        !unlockedCollectionIds?.includes(id)
      ) {
        return null;
      }

      return collection;
    },
    [t, showLockedContent, unlockedCollectionIds],
  );
};

export default useGetCollectionById;
