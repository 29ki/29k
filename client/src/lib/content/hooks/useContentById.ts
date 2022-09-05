import {useTranslation} from 'react-i18next';
import {ContentSlide} from '../../../../../shared/src/types/Content';
import NS from '../../i18n/constants/namespaces';

const useContentById = (id: string | undefined): ContentSlide[] => {
  const {t} = useTranslation(NS.EXERCISES);

  if (!id) {
    return [];
  }

  return t(id, {returnObjects: true});
};

export default useContentById;
