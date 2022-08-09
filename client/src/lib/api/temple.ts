import {TEMPLE_ENDPOINT} from 'config';

// TODO: move to shared? and use it also on functions/src/room/index.ts
export type Temple = {
  id: string;
  name: string;
  api_created: boolean;
  privacy: 'public' | 'private';
  url: string;
  created_at: string;
  config: {
    max_participants: number;
    nbf: number;
    exp: number;
    start_video_off: boolean;
    enable_recording:
      | 'cloud'
      | 'local'
      | 'rtp-tracks'
      | 'output-byte-stream'
      | '<not set>';
  };
};

export const addTemple = async (name: string): Promise<Temple> => {
  try {
    const response = await fetch(TEMPLE_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({name}),
    });
    const {temple} = await response.json();
    return temple;
  } catch (cause) {
    throw new Error('Could not create a room', {cause});
  }
};

export const fetchTemples = async (): Promise<Temple[]> => {
  try {
    return (await fetch(TEMPLE_ENDPOINT)).json();
  } catch (cause) {
    throw new Error('Could not fetch rooms', {cause});
  }
};
