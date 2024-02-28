import {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {LANGUAGE_TAGS} from '..';
import {PUBLISHABLE_NAMESPACES} from '../../../../../shared/src/content/constants';

const useReloadResourceBundles = () => {
  const {i18n} = useTranslation();
  const reloadResourceBundles = useCallback(async () => {
    // Needs to be removed for all languages,
    // otherwise they are not reloaded when switching language
    LANGUAGE_TAGS.forEach(lng => {
      PUBLISHABLE_NAMESPACES.forEach(namespace => {
        i18n.removeResourceBundle(lng, namespace);
      });
    });
    await i18n.reloadResources(undefined, PUBLISHABLE_NAMESPACES);

    // Trigger re-render of i18next-react
    i18n.emit('languageChanged');
  }, [i18n]);

  return reloadResourceBundles;
};

export default useReloadResourceBundles;
