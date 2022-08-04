import {ROOM_ENDPOINT} from 'config';

// TODO: move to shared? nad use it also on functions/src/room/index.ts
export type Room = {
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

export const createRoom = async (name: string): Promise<Room> => {
  try {
    const response = await fetch(ROOM_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({name}),
    });
    const {room} = await response.json();
    return room;
  } catch (cause) {
    throw new Error('Could not create a room', {cause});
  }
};

export const getRooms = async (): Promise<Room[]> => {
  try {
    return (await fetch(ROOM_ENDPOINT)).json();
  } catch (cause) {
    throw new Error('Could not fetch rooms', {cause});
  }
};
