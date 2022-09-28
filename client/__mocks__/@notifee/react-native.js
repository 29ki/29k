export const EventType = {
  UNKNOWN: -1,
  DISMISSED: 0,
  PRESS: 1,
  ACTION_PRESS: 2,
  DELIVERED: 3,
  APP_BLOCKED: 4,
  CHANNEL_BLOCKED: 5,
  CHANNEL_GROUP_BLOCKED: 6,
  TRIGGER_NOTIFICATION_CREATED: 7,
};

export const TriggerType = {
  TIMESTAMP: 0,
  INTERVAL: 1,
};

export default {
  cancelTriggerNotification: jest.fn(),
  createTriggerNotification: jest.fn(),
  getTriggerNotifications: jest.fn(),
  onForegroundEvent: jest.fn(),
  requestPermission: jest.fn(),
};
