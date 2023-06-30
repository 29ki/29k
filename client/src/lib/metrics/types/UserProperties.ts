import {LANGUAGE_TAG} from '../../i18n';
import {Origin, OriginCampaign, OriginMedium, OriginSource} from './Properties';

type UserProperties = {
  Anonymous: boolean;
  'Public Host': boolean;
  Language: LANGUAGE_TAG;
} & Origin &
  OriginSource &
  OriginMedium &
  OriginCampaign;

export default UserProperties;
