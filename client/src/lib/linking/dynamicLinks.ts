import dynamicLinks from '@react-native-firebase/dynamic-links';
import {utils} from '@react-native-firebase/app';
import {appendOrigin} from './utils/url';

export const getInitialURL = async () => {
  const {isAvailable} = utils().playServicesAvailability;

  if (isAvailable) {
    const dynamicLink = await dynamicLinks().getInitialLink();

    if (dynamicLink) {
      const {url, utmParameters} = dynamicLink;

      return appendOrigin(url, 'link', utmParameters);
    }
  }
};

export const addEventListener = (handler: (url: string) => void) =>
  dynamicLinks().onLink(({url, utmParameters}) => {
    handler(appendOrigin(url, 'link', utmParameters));
  });
