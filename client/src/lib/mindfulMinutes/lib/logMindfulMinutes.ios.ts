import HealthKit, {
  HKCategoryTypeIdentifier,
  HKCategoryValueNotApplicable,
  HKAuthorizationStatus,
} from '@kingstinct/react-native-healthkit';

export const isAvailable = () => HealthKit.isHealthDataAvailable();

export const requestAuthorization = () =>
  HealthKit.requestAuthorization([], [HKCategoryTypeIdentifier.mindfulSession]);

export const getAuthorizationStatus = async () =>
  (await isAvailable()) &&
  (await HealthKit.authorizationStatusFor(
    HKCategoryTypeIdentifier.mindfulSession,
  )) === HKAuthorizationStatus.sharingAuthorized;

export const log = (start: Date, end?: Date) =>
  HealthKit.saveCategorySample(
    HKCategoryTypeIdentifier.mindfulSession,
    HKCategoryValueNotApplicable.notApplicable,
    {start, end},
  );
