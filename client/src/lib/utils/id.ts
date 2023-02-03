import uuid from 'react-native-uuid';

export const generateId = () => uuid.v4().toString();
