export const checkMultiple = jest.fn().mockResolvedValue();
export const openSettings = jest.fn().mockResolvedValue();

export const PERMISSIONS = {
  IOS: {CAMERA: 'CAMERA', MICROPHONE: 'MICROPHONE'},
  ANDROID: {CAMERA: 'CAMERA', RECORD_AUDIO: 'MICROPHONE'},
};

export const RESULTS = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  GRANTED: 'granted',
  LIMITED: 'limited',
  BLOCKED: 'blocked',
};
