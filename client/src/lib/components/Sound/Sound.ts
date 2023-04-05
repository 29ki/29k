import {NativeEventEmitter, NativeModules} from 'react-native';
const {Sound} = NativeModules;
interface SoundInterface {
  prepare: (source: string, playWhenReady: boolean, repeat: boolean) => void;
  release: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (value: number) => void;
  setRepeat: (value: boolean) => void;
}
export default Sound as SoundInterface;
export const eventEmitter = new NativeEventEmitter(Sound);
