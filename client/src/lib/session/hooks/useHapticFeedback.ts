import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const useHapticFeedback = () => () => {
  ReactNativeHapticFeedback.trigger('impactHeavy');
};

export default useHapticFeedback;
