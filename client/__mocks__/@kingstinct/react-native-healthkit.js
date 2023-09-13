const HealthKit = {
  isHealthDataAvailable: jest.fn(),
  requestAuthorization: jest.fn(),
  saveCategorySample: jest.fn(),
  authorizationStatusFor: jest.fn(),
};

export const HKCategoryTypeIdentifier = {
  mindfulSession: 'mindfulSession',
};

export const HKCategoryValueNotApplicable = {
  notApplicable: 0,
};

export const HKAuthorizationStatus = {
  notDetermined: 0,
  sharingDenied: 1,
  sharingAuthorized: 2,
};

export default HealthKit;
